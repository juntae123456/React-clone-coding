const express = require('express');
const db = require('../db/connection'); // MariaDB 연결 설정
const router = express.Router();

// 스토리가 있는 사용자만 가져오는 API
router.get('/', (req, res) => {
  const query = `
    SELECT DISTINCT Log.id, Log.name 
    FROM Story 
    JOIN Log ON Story.Storyid = Log.id`; // Storyid와 Log.id를 조인하여 스토리가 있는 사용자만 가져옴

  db.query(query, (err, results) => {
    if (err) {
      console.error('사용자 목록을 가져오는 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    res.status(200).json(results); // 스토리가 있는 사용자 목록 반환
  });
});

module.exports = router;