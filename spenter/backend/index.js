// backend/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const transactionsRouter = require('./routes/transactions');
const incomeRouter       = require('./routes/income');

const app  = express();
const PORT = process.env.PORT || 5000;

// 1) Middlewares trước: CORS + JSON body
app.use(cors());
app.use(express.json());

// 2) Mount các API route
app.use('/api/transactions', transactionsRouter);
app.use('/api/income',       incomeRouter);

// 3) health-check
app.get('/', (req, res) => res.send('Backend API is running.'));

// 4) Start
app.listen(PORT, () => {
  console.log(`Backend API đang chạy trên port ${PORT}`);
});
