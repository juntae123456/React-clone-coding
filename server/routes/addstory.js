const express = require('express');
const multer = require('multer'); // 파일 업로드를 위한 multer 모듈
const { addStory } = require('../db/queries'); // 분리된 쿼리 모듈 가져오기

const router = express.Router();

// multer 설정: 파일 업로드를 처리
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 스토리 추가 API
router.post('/', upload.single('story'), (req, res) => {
  const { Storyid } = req.body; // 클라이언트에서 받은 storyid
  const file = req.file ? req.file.buffer : null; // 업로드된 파일의 버퍼 (BLOB로 저장)

  console.log("스토리 추가 시도:", Storyid, file); // 로그 추가

  if (!file) {
    return res.status(400).json({ message: '스토리 이미지가 없습니다.' });
  }

  // 스토리 추가 함수 호출
  addStory(Storyid, file, (err, result) => {
    if (err) {
      console.error('스토리를 저장하는 중 오류 발생:', err);
      return res.status(500).json({ message: '스토리 저장 중 서버 오류' });
    }
    console.log('스토리 저장 성공:', result); // 로그 추가
    res.status(200).json({ message: '스토리 저장 성공' });
  });
});

module.exports = router;
