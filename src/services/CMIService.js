const crypto = require('crypto');
const axios = require('axios');
const config = require('../config/cmi.config');

class CMIService {
  static encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(config.encryptionAlgorithm, Buffer.from(config.secretKey, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), data: encrypted.toString('hex') };
  }

  static decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const encryptedText = Buffer.from(encrypted.data, 'hex');
    const decipher = crypto.createDecipheriv(config.encryptionAlgorithm, Buffer.from(config.secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }

  static async initiatePayment(orderId, amount, userId) {
    const payload = { orderId, amount, userId, timestamp: Date.now() };
    const encryptedPayload = CMIService.encrypt(payload);

    // Example CMI endpoint call (replace with actual API)
    const response = await axios.post('https://cmi-payment-gateway.example.com/pay', encryptedPayload);
    return response.data;
  }

  static verifyPaymentResponse(response) {
    try {
      const decrypted = CMIService.decrypt(response);
      return decrypted;
    } catch (err) {
      throw new Error('Invalid payment response');
    }
  }
}

module.exports = CMIService;
