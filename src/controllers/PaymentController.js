const CMIService = require('../services/CMIService');
const PaymentTransaction = require('../models/PaymentTransaction');
const { triggerSuccessHook, triggerFailHook } = require('../hooks/onPaymentSuccess');

class PaymentController {
  static async pay(req, res) {
    try {
      const { orderId, amount, userId } = req.body;
      const result = await CMIService.initiatePayment(orderId, amount, userId);

      // Save transaction encrypted
      await PaymentTransaction.create({
        orderId,
        userId,
        amount,
        status: 'pending',
        encryptedData: JSON.stringify(result)
      });

      res.json({ success: true, paymentUrl: result.paymentUrl });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async callback(req, res) {
    try {
      const data = CMIService.verifyPaymentResponse(req.body);

      // Update transaction
      const transaction = await PaymentTransaction.findOne({ orderId: data.orderId });
      transaction.status = data.success ? 'completed' : 'failed';
      await transaction.save();

      // Trigger hooks
      if (data.success) {
        await triggerSuccessHook(transaction);
      } else {
        await triggerFailHook(transaction);
      }

      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = PaymentController;
