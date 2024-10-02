const express = require('express');
const db = require('../db/connection'); // DB 연결
const router = express.Router();

// 메시지를 읽음 상태로 업데이트
router.post('/', (req, res) => {
  const { userId, partnerId } = req.body; // 현재 로그인한 사용자와 대화 상대 ID

  // userId와 partnerId가 모두 있어야 함
  if (!userId || !partnerId) {
    return res.status(400).json({ error: 'userId와 partnerId가 필요합니다.' });
  }

  // 디버깅용 로그 추가
  console.log(`userId: ${userId}, partnerId: ${partnerId}`);

  // 읽지 않은 메시지가 있는지 먼저 확인
  const checkQuery = `
    SELECT COUNT(*) as unreadCount 
    FROM Messages 
    WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE
  `;

  db.query(checkQuery, [userId, partnerId], (err, result) => {
    if (err) {
      console.error('메시지 조회 중 오류:', err);
      return res.status(500).json({ error: '메시지 조회 중 오류 발생' });
    }

    if (result[0].unreadCount === 0) {
      // 읽지 않은 메시지가 없을 경우
      return res.json({ success: false, message: '읽지 않은 메시지가 없습니다.' });
    }

    // 메시지 상태 업데이트 쿼리
    const updateQuery = `
      UPDATE Messages 
      SET is_read = TRUE 
      WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE
    `;

    db.query(updateQuery, [userId, partnerId], (err, updateResult) => {
      if (err) {
        console.error('메시지 읽음 상태 업데이트 중 오류:', err);
        return res.status(500).json({ error: '메시지 읽음 상태 업데이트 중 오류 발생' });
      }

      res.json({ success: true, updatedRows: updateResult.affectedRows });
    });
  });
});

module.exports = router;
