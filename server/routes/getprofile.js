const express = require('express');
const { getProfilePicture } = require('../db/queries'); // queries.js에서 함수 가져오기
const router = express.Router();

// 프로필 사진 가져오기
router.get('/getprofile/:propilid', (req, res) => {
  const { propilid } = req.params;

  console.log('Received propilid:', propilid); // 로그 추가

  getProfilePicture(propilid, (err, result) => {
    if (err) {
      console.error('프로필 사진을 가져오는 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (result.length === 0 || !result[0].propileview) {
      console.log('프로필 사진이 없습니다.'); // 로그 추가
      return res.status(404).json({ message: '프로필 사진이 없습니다.' });
    }

    console.log('프로필 사진 가져오기 성공'); // 로그 추가

    res.contentType('image/jpeg'); // 이미지 타입을 설정
    res.send(result[0].propileview); // Blob 데이터를 반환
  });
});


module.exports = router;
