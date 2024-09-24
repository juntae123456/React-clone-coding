const express = require('express');
const { insertUser } = require('../db/queries'); // db 쿼리 함수 가져오기
const router = express.Router();

router.post('/', (req, res) => {
  const { name, logid, password } = req.body;

  if (!name || !logid || !password) {
    return res.status(400).send('모든 필드를 입력해주세요.');
  }

  insertUser(name, logid, password, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('이미 존재하는 아이디입니다.');
      }
      console.error('회원가입 중 오류 발생:', err);
      return res.status(500).send('회원가입 실패');
    }
    res.status(200).send('회원가입 성공');
  });
});

module.exports = router;
