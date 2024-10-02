const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 사용자 목록 가져오기
router.get('/', (req, res) => {
  const query = 'SELECT id, name FROM Log';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: '데이터베이스 오류' });
    }
    res.json(results);
  });
});

module.exports = router;
