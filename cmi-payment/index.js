const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/cmi', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CMI Payment Module running on port ${PORT}`);
});
