const express = require('express');
const db = require('../db/connection'); // DB 연결
const router = express.Router();

// 사용자 검색 API
router.get('/', (req, res) => {
  const searchTerm = req.query.q; // 검색어
  const query = `SELECT id, name FROM Log WHERE name LIKE ?`; // 사용자 이름 검색 쿼리

  db.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('사용자 검색 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    res.json(results); // 검색 결과 반환
  });
});

module.exports = router;
