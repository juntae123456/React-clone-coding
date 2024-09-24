const express = require('express');
const db = require('../db/connection'); // MariaDB 연결 모듈

const router = express.Router();

// 피드 데이터를 가져오는 API
router.get('/', (req, res) => {
  const query = `
    SELECT Feed.id, Feed.feedview, Feed.feedword, Feed.feedgood, Log.name AS userName
    FROM Feed
    JOIN Log ON Feed.feedid = Log.id
  `; // Feed 테이블과 Log 테이블을 조인하여 사용자 이름과 피드 데이터를 가져옴

  db.query(query, (err, results) => {
    if (err) {
      console.error('피드 데이터를 가져오는 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    // 데이터를 JSON으로 반환
    res.status(200).json(results);
  });
});

module.exports = router;
