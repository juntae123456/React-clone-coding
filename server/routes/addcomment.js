const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 댓글 추가 API
router.post('/', (req, res) => {
    const { udid, logid, udcont } = req.body;

    if (!udid || !logid || !udcont) {
        return res.status(400).json({ message: '모든 필드를 입력하세요.' });
    }

    const query = 'INSERT INTO Comment (udid, logid, udcont) VALUES (?, ?, ?)';
    db.query(query, [udid, logid, udcont], (err, result) => {
        if (err) {
            console.error('댓글 삽입 오류:', err);
            return res.status(500).json({ message: '댓글 삽입 중 오류가 발생했습니다.' });
        }
        res.status(200).json({ success: true, commentId: result.insertId });
    });
});

module.exports = router;
