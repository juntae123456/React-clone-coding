const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 좋아요 상태를 토글하는 API
router.post('/', (req, res) => {
  const { feedId, liked } = req.body; // 요청에서 피드 게시물 ID와 좋아요 상태를 받음

  if (!feedId) {
    return res.status(400).json({ message: 'feedId가 누락되었습니다.' });
  }

  const query = liked
    ? 'UPDATE Feed SET feedgood = feedgood - 1 WHERE id = ? AND feedgood > 0' // 좋아요 취소
    : 'UPDATE Feed SET feedgood = feedgood + 1 WHERE id = ?'; // 좋아요 추가

  db.query(query, [feedId], (err, result) => {
    if (err) {
      console.error('좋아요 상태 업데이트 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 피드를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: liked ? '좋아요 취소됨' : '좋아요 추가됨' });
  });
});

module.exports = router;
