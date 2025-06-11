// backend/routes/transactions.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL 연결

/**
 * GET /api/transactions
 *  - client가 ?id=사용자ID를 전달하면 해당 사용자 거래만 조회
 *  - 그렇지 않으면 모든 거래를 반환
 */
router.get('/', async (req, res) => {
  const userId = req.query.id;
  let sql = 'SELECT * FROM ai_transactional';
  const params = [];

  if (userId) {
    sql += ' WHERE id = ?';
    params.push(userId);
  }

  try {
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('거래 조회 중 오류:', err);
    return res.status(500).json({ error: '서버 오류로 거래를 불러오지 못했습니다.' });
  }
});

/**
 * GET /api/transactions/:AI_id
 *  - AI_id로 특정 거래 조회
 */
router.get('/:AI_id', async (req, res) => {
  const { AI_id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ai_transactional WHERE AI_id = ?',
      [AI_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '거래를 찾을 수 없습니다.' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('거래 세부 조회 중 오류:', err);
    return res.status(500).json({ error: '서버 오류로 거래를 불러오지 못했습니다.' });
  }
});

/**
 * POST /api/transactions
 *  - 새 거래 추가 (항상 지출)
 *  - body에 id, emotion, use_place, use_category, credit, credit_date 필요
 */
router.post('/', async (req, res) => {
  const { id, emotion, use_place, use_category, credit, credit_date } = req.body;
  if (!id || !credit_date) {
    return res.status(400).json({ error: 'id와 credit_date는 필수 입력 사항입니다.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO ai_transactional
         (id, emotion, use_place, use_category, credit, credit_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, emotion, use_place, use_category, credit, credit_date]
    );
    return res
      .status(201)
      .json({ message: '거래 추가 성공.', AI_id: result.insertId });
  } catch (err) {
    console.error('거래 추가 중 오류:', err);
    return res.status(500).json({ error: '서버 오류로 거래를 추가하지 못했습니다.' });
  }
});

/**
 * PUT /api/transactions/:AI_id
 *  - 기존 거래 수정
 *  - body에 emotion, use_place, use_category, credit, credit_date 필요
 */
router.put('/:AI_id', async (req, res) => {
  const { AI_id } = req.params;
  const { emotion, use_place, use_category, credit, credit_date } = req.body;

  if (!credit_date) {
    return res.status(400).json({ error: 'credit_date는 필수 입력 사항입니다.' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE ai_transactional
         SET emotion      = ?,
             use_place    = ?,
             use_category = ?,
             credit       = ?,
             credit_date  = ?
       WHERE AI_id = ?`,
      [emotion, use_place, use_category, credit, credit_date, AI_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '수정할 거래를 찾을 수 없습니다.' });
    }
    return res.json({ message: '거래 수정 성공.' });
  } catch (err) {
    console.error('거래 수정 중 오류:', err);
    return res.status(500).json({ error: '서버 오류로 거래를 수정하지 못했습니다.' });
  }
});

/**
 * DELETE /api/transactions/:AI_id
 *  - 거래 삭제
 */
router.delete('/:AI_id', async (req, res) => {
  const { AI_id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM ai_transactional WHERE AI_id = ?',
      [AI_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '삭제할 거래를 찾을 수 없습니다.' });
    }
    return res.json({ message: '거래 삭제 성공.' });
  } catch (err) {
    console.error('거래 삭제 중 오류:', err);
    return res.status(500).json({ error: '서버 오류로 거래를 삭제하지 못했습니다.' });
  }
});

module.exports = router;
