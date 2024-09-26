const express = require('express');
const multer = require('multer');
const { updateProfilePicture } = require('../db/queries'); // updateProfilePicture 함수 가져오기

const router = express.Router();

// 파일 메모리 저장 설정 (BLOB 형태로 MariaDB에 저장하기 위해)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 프로필 사진 업로드 처리
router.post('/', upload.single('file'), (req, res) => {
  const { propilid } = req.body; // 클라이언트에서 전달된 사용자 ID (propilid)
  const profileImage = req.file ? req.file.buffer : null; // 업로드된 파일의 버퍼 (BLOB로 저장)

  if (!propilid) {
    return res.status(400).json({ message: '사용자 ID가 전달되지 않았습니다. 로그인 상태를 확인하세요.' });
  }

  if (!profileImage) {
    return res.status(400).json({ message: '프로필 사진이 업로드되지 않았습니다.' });
  }

  // 데이터베이스에 프로필 사진을 삽입 또는 업데이트 (BLOB 저장)
  updateProfilePicture(propilid, profileImage, (err, result) => {
    if (err) {
      console.error('프로필 사진 업로드 중 오류 발생:', err);
      return res.status(500).json({ message: '프로필 사진 업로드 중 오류가 발생했습니다.' });
    }

    res.status(200).json({
      message: '프로필 사진이 성공적으로 저장되었습니다.',
    });
  });
});

module.exports = router;
