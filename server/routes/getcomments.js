const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 특정 피드에 대한 댓글 가져오기 API
router.get('/:udid', (req, res) => {
    const { udid } = req.params;

    const query = `
        SELECT c.id, c.udcont, l.name 
        FROM Comment c 
        JOIN Log l ON c.logid = l.id
        WHERE c.udid = ?
        ORDER BY c.id ASC
    `;

    db.query(query, [udid], (err, results) => {
        if (err) {
            console.error('댓글 가져오는 중 오류 발생:', err);
            return res.status(500).json({ message: '댓글을 가져오는 중 오류가 발생했습니다.' });
        }
        res.json(results);
    });
});

module.exports = router;
