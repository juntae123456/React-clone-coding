const express = require('express');
const { getUserByUsername } = require('../db/queries'); // 사용자 조회 함수 가져오기
const router = express.Router();

router.post('/', (req, res) => {
  const { username, password } = req.body;

  // 데이터베이스에서 사용자 조회
  getUserByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).send('서버 오류');
    }

    if (!user) {
      return res.status(400).send('사용자가 존재하지 않습니다.');
    }

    // 비밀번호가 일치하는지 확인
    if (password === user.password) {
      // 로그인 성공 시 사용자 ID와 이름 함께 반환
      return res.status(200).json({
        message: '로그인 성공',
        id: user.id,      // 사용자 ID 반환
        name: user.name,  // 사용자 이름 반환
      });
    } else {
      return res.status(400).send('비밀번호가 일치하지 않습니다.');
    }
  });
});

module.exports = router;
