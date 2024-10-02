const express = require('express');
const db = require('../db/connection'); // DB 연결
const router = express.Router();

// 사용자 목록 조회
router.get('/', (req, res) => {
    const userId = req.query.userId;

    // userId가 없으면 에러 처리
    if (!userId) {
        console.error('userId가 누락되었습니다.');
        return res.status(400).json({ error: 'userId가 필요합니다.' });
    }

    const query = `
        SELECT u.id,
               u.name,
               COUNT(m.id) AS unreadMessages
        FROM Log u
        LEFT JOIN Messages m ON u.id = m.sender_id AND m.receiver_id = ? AND m.is_read = FALSE
        WHERE u.id != ?
        GROUP BY u.id;
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: '사용자 목록을 가져오는 중 오류 발생' });
        }
        res.json(results);
    });
});

module.exports = router;
