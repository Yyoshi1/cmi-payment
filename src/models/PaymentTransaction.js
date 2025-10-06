const mongoose = require('mongoose');

const PaymentTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  encryptedData: { type: String, required: true },
  relatedParties: { type: [String], default: [] },
  webhookUrl: { type: String, default: null },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
