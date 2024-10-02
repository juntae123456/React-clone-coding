const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// 사용자가 특정 피드에 좋아요를 눌렀는지 확인하는 API
router.post('/', (req, res) => {
    const {feedId, userId} = req.body; // 요청에서 피드 ID와 사용자 ID를 받음

    if (!feedId || !userId) {
        return res.status(400).json({message: 'feedId 또는 userId가 누락되었습니다.'});
    }

    const query = 'SELECT liked FROM FeedLikes WHERE feedId = ? AND userId = ?';
    db.query(query, [feedId, userId], (err, results) => {
        if (err) {
            console.error('좋아요 상태 확인 중 오류 발생:', err);
            return res.status(500).json({message: '서버 오류'});
        }

        if (results.length > 0) {
            // 사용자가 이미 좋아요를 눌렀는지 여부를 반환
            const liked = results[0].liked;
            res.status(200).json({liked});
        } else {
            // 좋아요 기록이 없으면 false 반환
            res.status(200).json({liked: false});
        }
    });
});

module.exports = router;
