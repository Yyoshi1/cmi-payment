const axios = require('axios');

async function triggerWebhook(url, payload) {
  try {
    await axios.post(url, payload, { timeout: 5000 });
    console.log(`Webhook triggered to ${url}`);
  } catch (err) {
    console.error(`Webhook failed for ${url}`, err.message);
  }
}

module.exports = { triggerWebhook };
