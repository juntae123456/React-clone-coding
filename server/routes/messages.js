const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 메시지 저장 API
router.post('/', (req, res) => {
  const { sender_id, receiver_id, text } = req.body;
  const query = 'INSERT INTO Messages (sender_id, receiver_id, text) VALUES (?, ?, ?)';

  console.log('쿼리 실행: ', query); // 쿼리 로그 출력
  console.log('데이터: ', sender_id, receiver_id, text); // 데이터 로그 출력

  db.query(query, [sender_id, receiver_id, text], (err, result) => {
    if (err) {
      console.error('쿼리 오류: ', err); // 쿼리 오류 출력
      return res.status(500).json({ error: '메시지 저장 오류', details: err });
    }
    res.json({ success: true, messageId: result.insertId });
  });
});

// 특정 사용자와의 메시지 기록 조회 API
router.get('/:userId/:partnerId', (req, res) => {
  const { userId, partnerId } = req.params;

  const query = `
    SELECT * FROM Messages
    WHERE (sender_id = ? AND receiver_id = ?)
    OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp ASC
  `;

  db.query(query, [userId, partnerId, partnerId, userId], (err, results) => {
    if (err) {
      console.error('메시지 조회 오류:', err);
      return res.status(500).json({ error: '메시지 조회 오류' });
    }
    res.json(results);
  });
});

module.exports = router;
