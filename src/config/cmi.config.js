module.exports = {
  merchantId: process.env.CMI_MERCHANT_ID || 'YOUR_MERCHANT_ID',
  secretKey: process.env.CMI_SECRET_KEY || 'YOUR_SECRET_KEY',
  callbackUrl: process.env.CMI_CALLBACK_URL || 'https://yourdomain.com/cmi/callback',
  encryptionAlgorithm: 'aes-256-cbc'
};
