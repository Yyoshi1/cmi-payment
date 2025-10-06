const crypto = require('crypto');
const config = require('../config/cmi.config');

async function encryptPaymentData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.secretKey, 'hex'), Buffer.from(config.iv, 'hex'));
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

async function decryptPaymentData(encrypted) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.secretKey, 'hex'), Buffer.from(config.iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

async function getPaymentUrl(encryptedData) {
  return `${config.paymentBaseUrl}?data=${encryptedData}`;
}

module.exports = { encryptPaymentData, decryptPaymentData, getPaymentUrl };
