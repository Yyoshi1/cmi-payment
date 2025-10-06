const PaymentTransaction = require('../models/PaymentTransaction');
const CMIService = require('../services/CMIService');
const { triggerSuccessHook, triggerFailHook } = require('../hooks/onPaymentSuccess');

exports.pay = async (req, res) => {
  try {
    const { userId, orderId, amount, relatedParties, webhookUrl } = req.body;

    const encryptedData = await CMIService.encryptPaymentData({ userId, orderId, amount });

    const transaction = await PaymentTransaction.create({
      userId,
      orderId,
      amount,
      encryptedData,
      relatedParties,
      webhookUrl,
      status: 'pending'
    });

    const paymentUrl = await CMIService.getPaymentUrl(encryptedData);

    res.json({ success: true, paymentUrl, transactionId: transaction._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Payment initiation failed.' });
  }
};

exports.callback = async (req, res) => {
  try {
    const { transactionId, status, data } = req.body;

    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    transaction.status = status === 'success' ? 'completed' : 'failed';
    await transaction.save();

    if (status === 'success') {
      await triggerSuccessHook(transaction);
    } else {
      await triggerFailHook(transaction);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Callback processing failed.' });
  }
};
