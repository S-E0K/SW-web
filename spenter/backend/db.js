// File: backend/db.js
// -----------------------
require('dotenv').config(); // Phải gọi ngay từ dòng đầu để load biến môi trường .env

const mysql = require('mysql2/promise');

// Tạo pool kết nối đến MySQL, lần này không “hardcode” mà dùng process.env
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Ví dụ: '1.253.14.231'
  port: process.env.DB_PORT,       // Ví dụ: 3306 (là số, nhưng process.env trả về chuỗi. mysql2 tự cast được)
  user: process.env.DB_USER,       // Ví dụ: 'spenter'
  password: process.env.DB_PASSWORD, // Ví dụ: '1234'
  database: process.env.DB_NAME,     // Ví dụ: 'spenter'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Nếu server MySQL yêu cầu SSL, bạn có thể thêm ssl: { … } ở đây
});

module.exports = pool;
