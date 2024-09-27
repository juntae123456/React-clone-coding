const express = require('express');
const db = require('../db/connection'); // queries.js에서 함수 가져오기
const router = express.Router();

// 프로필 사진 가져오기
router.get('/', (req, res) => {
  const query = 'SELECT Propile.propileview FROM Propile WHERE propilid = ?';

  db.query(query, [req.query.propilid], (err, result) => { // 요청에서 propilid 받기
    if (err) {
      console.error('프로필 사진을 가져오는 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: '프로필 사진을 찾을 수 없습니다.' });
    }

    const imageBuffer = result[0].propileview; // 데이터베이스에서 받은 이미지 Blob
    if (!imageBuffer) {
      return res.status(404).json({ message: '프로필 사진이 없습니다.' });
    }

    // 이미지가 존재하는 경우 바이너리 데이터로 응답
    res.set('Content-Type', 'image/jpeg'); // 이미지 유형에 맞게 MIME 타입 설정 (예: JPEG)
    res.send(imageBuffer); // 이미지 데이터를 바이너리로 전송
  });
});

module.exports = router;