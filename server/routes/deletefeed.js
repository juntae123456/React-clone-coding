const express = require('express');
const db = require('../db/connection'); // MySQL 연결 모듈
const router = express.Router();

router.delete('/:id', (req, res) => {
  const feedId = req.params.id;
  const userId = req.body.userId; // 삭제를 요청한 사용자의 ID

  // 먼저 피드 작성자를 조회
  const checkAuthorQuery = 'SELECT feedid FROM Feed WHERE id = ?';

  db.query(checkAuthorQuery, [feedId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: '피드 작성자 조회 중 오류 발생' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: '피드를 찾을 수 없습니다.' });
    }

    const feedAuthorId = result[0].userId;

    // 작성자와 삭제 요청자가 동일한지 확인
    if (feedAuthorId !== userId) {
      return res.status(403).json({ error: '이 피드를 삭제할 권한이 없습니다.' });
    }

    // 피드 삭제 쿼리
    const deleteFeedQuery = 'DELETE FROM Feed WHERE id = ?';
    db.query(deleteFeedQuery, [feedId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: '피드 삭제 중 오류 발생' });
      }
      res.json({ success: true, message: '피드가 성공적으로 삭제되었습니다.' });
    });
  });
});

module.exports = router;
