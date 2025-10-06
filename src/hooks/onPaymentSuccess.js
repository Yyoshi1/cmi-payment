const SubscriptionManager = require('../../subscription/SubscriptionManager');
const NotificationService = require('../../services/NotificationService');
const WebhookService = require('../../services/WebhookService');

async function triggerSuccessHook(transaction) {
  if (transaction.userId && transaction.orderId) {
    await SubscriptionManager.activateSubscription(transaction.userId, transaction.orderId);
  }

  await NotificationService.notifyUser(transaction.userId, {
    title: 'Payment Successful',
    message: `Your payment for order ${transaction.orderId} was successful.`,
    type: 'success'
  });

  await NotificationService.notifyAdmin({
    title: 'New Successful Payment',
    message: `Payment successful for order ${transaction.orderId} by user ${transaction.userId}`,
    type: 'info'
  });

  if (transaction.relatedParties && transaction.relatedParties.length) {
    for (const partyId of transaction.relatedParties) {
      await NotificationService.notifyUser(partyId, {
        title: 'Related Payment Successful',
        message: `Payment for order ${transaction.orderId} has been completed.`,
        type: 'success'
      });
    }
  }

  if (transaction.webhookUrl) {
    await WebhookService.triggerWebhook(transaction.webhookUrl, transaction);
  }

  console.log(`Payment successful for transaction ${transaction.orderId}`);
}

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

  console.log(`Payment failed for transaction ${transaction.orderId}`);
}

module.exports = { triggerSuccessHook, triggerFailHook };
