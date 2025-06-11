// backend/routes/income.js

const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /api/income?id=…
router.get('/', async (req, res) => {
  const userId = req.query.id;
  let sql = `
    SELECT transaction_id, id, credit, use_place, use_category, credit_date
      FROM income_transactional`;
  const params = [];
  if (userId) {
    sql += ' WHERE id = ?';
    params.push(userId);
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Lỗi lấy thu nhập:', err);
    res.status(500).json({ error: '서버 오류로 불러오지 못했습니다.' });
  }
});

// POST /api/income
router.post('/', async (req, res) => {
  const { id, credit, use_place, use_category, credit_date } = req.body;
  if (!id || !credit_date) {
    return res.status(400).json({ error: 'id và credit_date là bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO income_transactional
         (id, credit, use_place, use_category, credit_date)
       VALUES (?, ?, ?, ?, ?)`,
      [id, credit, use_place, use_category, credit_date]
    );
    res.status(201).json({
      message: '수입 추가 성공',
      transaction_id: result.insertId
    });
  } catch (err) {
    console.error('Lỗi thêm thu nhập:', err);
    res.status(500).json({ error: '서버 오류로 추가하지 못했습니다.' });
  }
});

// PUT /api/income/:transaction_id
router.put('/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params;
  const { credit, use_place, use_category, credit_date } = req.body;

  if (!credit_date) {
    return res.status(400).json({ error: 'credit_date là bắt buộc.' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE income_transactional
         SET credit = ?, use_place = ?, use_category = ?, credit_date = ?
       WHERE transaction_id = ?`,
      [credit, use_place, use_category, credit_date, transaction_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy giao dịch để cập nhật.' });
    }
    res.json({ message: '수입 수정 성공' });
  } catch (err) {
    console.error('Lỗi sửa thu nhập:', err);
    res.status(500).json({ error: '서버 오류로 sửa không thành công.' });
  }
});

// DELETE /api/income/:transaction_id
router.delete('/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM income_transactional
        WHERE transaction_id = ?`,
      [transaction_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy giao dịch để xóa.' });
    }
    res.json({ message: '수입 삭제 성공' });
  } catch (err) {
    console.error('Lỗi xóa thu nhập:', err);
    res.status(500).json({ error: '서버 오류로 xóa không thành công.' });
  }
});

module.exports = router;
  