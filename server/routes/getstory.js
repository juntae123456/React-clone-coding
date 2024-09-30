// getstory.js (특정 사용자의 여러 스토리 가져오기)
const express = require('express');
const db = require('../db/connection'); // MariaDB 연결 설정
const router = express.Router();

// 스토리를 가져오는 API
router.get('/:storyid', (req, res) => {
  const storyid = req.params.storyid;
  const query = `
    SELECT storyview 
    FROM Story 
    WHERE Storyid = ?`; // 특정 사용자의 모든 스토리 가져오기

  db.query(query, [storyid], (err, results) => {
    if (err) {
      console.error('스토리를 가져오는 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length > 0) {
      const stories = results.map(result => {
        const base64Image = result.storyview.toString('base64'); // BLOB 데이터를 Base64로 변환
        return `data:image/jpeg;base64,${base64Image}`; // Base64 이미지 URL 생성
      });
      res.status(200).json(stories); // 클라이언트에 여러 스토리 URL 반환
    } else {
      res.status(404).json({ message: '해당 사용자의 스토리를 찾을 수 없습니다.' });
    }
  });
});

module.exports = router;
