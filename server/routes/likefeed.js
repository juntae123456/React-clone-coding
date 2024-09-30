const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 좋아요 상태를 토글하는 API
router.post('/', (req, res) => {
  const { feedId, userId, liked } = req.body; // 요청에서 피드 ID, 사용자 ID, 좋아요 상태를 받음

  if (!feedId || !userId) {
    return res.status(400).json({ message: 'feedId 또는 userId가 누락되었습니다.' });
  }

  // 먼저 사용자가 해당 게시물에 좋아요를 눌렀는지 확인
  const checkQuery = 'SELECT liked FROM FeedLikes WHERE feedId = ? AND userId = ?';

  db.query(checkQuery, [feedId, userId], (err, results) => {
    if (err) {
      console.error('좋아요 상태 확인 중 오류 발생:', err);
      return res.status(500).json({ message: '서버 오류' });
    }

    if (results.length > 0) {
      // 이미 좋아요 기록이 있는 경우
      const existingLike = results[0].liked;

      if (existingLike === liked) {
        // 이미 동일한 상태의 좋아요가 눌려 있는 경우 (중복 요청)
        return res.status(400).json({ message: liked ? '이미 좋아요를 눌렀습니다.' : '이미 좋아요를 취소했습니다.' });
      }

      // 상태가 다르면 업데이트
      const updateQuery = 'UPDATE FeedLikes SET liked = ? WHERE feedId = ? AND userId = ?';
      db.query(updateQuery, [liked, feedId, userId], (err, result) => {
        if (err) {
          console.error('좋아요 상태 업데이트 중 오류 발생:', err);
          return res.status(500).json({ message: '서버 오류' });
        }

        // Feed 테이블의 좋아요 수 업데이트
        const feedUpdateQuery = liked
          ? 'UPDATE Feed SET feedgood = feedgood + 1 WHERE id = ?'
          : 'UPDATE Feed SET feedgood = feedgood - 1 WHERE id = ?';

        db.query(feedUpdateQuery, [feedId], (err) => {
          if (err) {
            console.error('피드 좋아요 수 업데이트 중 오류 발생:', err);
            return res.status(500).json({ message: '서버 오류' });
          }
          res.status(200).json({ message: liked ? '좋아요 추가됨' : '좋아요 취소됨' });
        });
      });
    } else {
      // 좋아요 기록이 없는 경우 새로운 좋아요 추가
      const insertQuery = 'INSERT INTO FeedLikes (feedId, userId, liked) VALUES (?, ?, ?)';
      db.query(insertQuery, [feedId, userId, liked], (err, result) => {
        if (err) {
          console.error('좋아요 기록 삽입 중 오류 발생:', err);
          return res.status(500).json({ message: '서버 오류' });
        }

        // Feed 테이블의 좋아요 수 업데이트
        const feedUpdateQuery = liked
          ? 'UPDATE Feed SET feedgood = feedgood + 1 WHERE id = ?'
          : 'UPDATE Feed SET feedgood = feedgood - 1 WHERE id = ?';

        db.query(feedUpdateQuery, [feedId], (err) => {
          if (err) {
            console.error('피드 좋아요 수 업데이트 중 오류 발생:', err);
            return res.status(500).json({ message: '서버 오류' });
          }
          res.status(200).json({ message: liked ? '좋아요 추가됨' : '좋아요 취소됨' });
        });
      });
    }
  });
});

module.exports = router;
