const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // MySQL 연결

router.get('/users', (req, res) => {
  const searchQuery = req.query.q; // 쿼리 파라미터로 검색어 받기

  if (!searchQuery) {
    return res.status(400).json({ error: '검색어가 필요합니다.' });
  }

  // 검색어와 일치하는 유저 이름을 검색
  const query = 'SELECT name FROM Users WHERE name LIKE ? LIMIT 10'; // 최대 10개 검색 결과
  db.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류' });
    }
    res.json(results.map(user => user.name)); // 유저 이름만 반환
  });
});

module.exports = router;
