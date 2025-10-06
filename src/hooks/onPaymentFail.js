const NotificationService = require('../../services/NotificationService');
const WebhookService = require('../../services/WebhookService');

async function triggerFailHook(transaction) {
  await NotificationService.notifyUser(transaction.userId, {
    title: 'Payment Failed',
    message: `Your payment for order ${transaction.orderId} failed. Please retry.`,
    type: 'error'
  });

  await NotificationService.notifyAdmin({
    title: 'Payment Failed',
    message: `Payment failed for order ${transaction.orderId} by user ${transaction.userId}`,
    type: 'error'
  });

  if (transaction.relatedParties && transaction.relatedParties.length) {
    for (const partyId of transaction.relatedParties) {
      await NotificationService.notifyUser(partyId, {
        title: 'Related Payment Failed',
        message: `Payment for order ${transaction.orderId} has failed.`,
        type: 'error'
      });
    }
  }

  if (transaction.webhookUrl) {
    await WebhookService.triggerWebhook(transaction.webhookUrl, transaction);
  }

  console.log(`Payment failed for transaction ${transaction.orderId}`);
}

module.exports = { triggerFailHook };
