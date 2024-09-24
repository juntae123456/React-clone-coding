const express = require('express');
const multer = require('multer');
const { insertFeed } = require('../db/queries'); // insertFeed 함수 가져오기

const router = express.Router();

// 파일 메모리 저장 설정 (BLOB 형태로 MariaDB에 저장하기 위해)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 피드 업로드 처리
router.post('/', upload.single('file'), (req, res) => {
  const { feedword, feedid } = req.body; // 클라이언트에서 전달된 feedid와 feedword
  const feedview = req.file.buffer; // 업로드된 파일의 버퍼 (BLOB 저장)
  const feedgood = 0; // 초기 좋아요 수

  if (!feedid) {
    return res.status(400).json({ message: 'feedid가 전달되지 않았습니다. 로그인 상태를 확인하세요.' });
  }

  insertFeed(feedid, feedview, feedword, feedgood, (err, result) => {
    if (err) {
      console.error('피드 삽입 오류:', err);
      return res.status(500).json({ message: '피드 삽입 중 오류가 발생했습니다.' });
    }

    res.status(200).json({
      message: '피드가 성공적으로 저장되었습니다.',
      feedId: result.insertId,
    });
  });
});

module.exports = router;
