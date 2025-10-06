const SubscriptionManager = require('../../subscription/SubscriptionManager');

async function triggerSuccessHook(transaction) {
  // Activate subscription if linked
  if (transaction.userId && transaction.orderId) {
    await SubscriptionManager.activateSubscription(transaction.userId, transaction.orderId);
  }

  // Notify user or system (example)
  console.log(`Payment successful for transaction ${transaction.orderId}`);
}

async function triggerFailHook(transaction) {
  console.log(`Payment failed for transaction ${transaction.orderId}`);
}

module.exports = { triggerSuccessHook, triggerFailHook };
