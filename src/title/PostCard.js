import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    IconButton,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { Favorite, ChatBubble, Send, Bookmark, Delete } from '@mui/icons-material';

export default function PostCard({ id, feedid, userName, fileBlob, likesCount, feedword, onDelete }) {
    const [profileImageSrc, setProfileImageSrc] = useState(null); // 각 포스트 작성자의 프로필 이미지
    const [currentLikes, setCurrentLikes] = useState(likesCount); // 좋아요 수 상태 관리
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    const [imageSrc, setImageSrc] = useState(''); // 이미지 상태 추가
    const [commentsOpen, setCommentsOpen] = useState(false); // 댓글창 열림/닫힘 상태
    const [comments, setComments] = useState([]); // 댓글 목록 상태
    const [newComment, setNewComment] = useState(''); // 새로 작성 중인 댓글
    const loggedInUserId = Number(localStorage.getItem('userId'));

    // 각 사용자의 프로필 이미지를 가져오는 함수 (feedid를 사용)
    const fetchProfileImage = () => {
        fetch(`http://127.0.0.1:3001/getprofile?propilid=${feedid}`) // feedid로 해당 포스트 작성자의 프로필 이미지 요청
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    setProfileImageSrc(reader.result); // 프로필 이미지를 상태에 저장
                };
            })
            .catch((error) => {
                console.error(`프로필 이미지를 가져오는 중 오류 발생 (${userName}):`, error);
            });
    };

    // 사용자가 해당 피드에 좋아요를 눌렀는지 확인
    const checkIfLiked = () => {
        fetch('http://127.0.0.1:3001/checklike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feedId: id, userId: loggedInUserId }),
        })
            .then((response) => response.json())
            .then((data) => {
                setLiked(data.liked); // 서버에서 받은 liked 상태로 업데이트
            })
            .catch((error) => {
                console.error('좋아요 상태 확인 중 오류 발생:', error);
            });
    };

    // 댓글 가져오기 함수
    const fetchComments = () => {
        fetch(`http://10.0.1.38:3001/getcomments/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setComments(data); // 댓글 목록 업데이트
            })
            .catch((error) => {
                console.error('댓글을 가져오는 중 오류 발생:', error);
            });
    };

    // 파일 Blob을 이미지로 변환
    useEffect(() => {
        if (fileBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);
            reader.onloadend = () => {
                setImageSrc(reader.result); // 이미지 파일을 상태로 저장
            };
        }
    }, [fileBlob]);

    // 컴포넌트가 마운트될 때 해당 작성자의 프로필 이미지 불러오기
    useEffect(() => {
        fetchProfileImage();
        checkIfLiked();
        fetchComments();
    }, [userName, loggedInUserId]);

    const handleLikeClick = () => {
        const newLikedState = !liked;

        setCurrentLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
        setLiked(newLikedState);

        fetch('http://10.0.1.38:3001/likefeed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedId: id, userId: loggedInUserId, liked: newLikedState }),
        }).catch((error) => console.error('좋아요 업데이트 중 오류 발생:', error));
    };

    const handleDeleteClick = () => {
        fetch(`http://10.0.1.38:3001/deletefeed/${id}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && onDelete) onDelete(id);
            })
            .catch((error) => console.error('피드 삭제 중 오류 발생:', error));
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return;

        const commentData = {
            udid: id,
            logid: loggedInUserId,
            udcont: newComment,
        };

        fetch('http://10.0.1.38:3001/addcomment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    fetchComments(); // 댓글 새로고침
                    setNewComment(''); // 입력창 초기화
                }
            })
            .catch((error) => {
                console.error('댓글 추가 중 오류 발생:', error);
            });
    };

    const handleCommentToggle = () => {
        setCommentsOpen(!commentsOpen);
    };

    const heartIconStyle = {
        color: liked ? 'red' : 'white',
        stroke: liked ? 'none' : 'black',
        strokeWidth: 1.5,
    };

    const iconStyle = {
        color: 'white',
        stroke: 'black',
        strokeWidth: 1.5,
    };

    return (
        <Card style={{ marginBottom: '20px' }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="profile" src={profileImageSrc || ''}>
                        {!profileImageSrc && userName[0].toUpperCase()}
                    </Avatar>
                }
                title={userName}
                action={
                    loggedInUserId === feedid && (
                        <IconButton aria-label="delete" onClick={handleDeleteClick}>
                            <Delete />
                        </IconButton>
                    )
                }
            />
            {imageSrc && (
                <CardMedia
                    component="img"
                    height="800"
                    image={imageSrc}
                    alt="Post image"
                />
            )}
            <CardContent>
                <Box display="flex" justifyContent="space-between">
                    <Box display="flex">
                        <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
                            <Favorite sx={heartIconStyle} />
                        </IconButton>
                        <IconButton aria-label="comment" onClick={handleCommentToggle}>
                            <ChatBubble sx={iconStyle} />
                        </IconButton>
                        <IconButton aria-label="send">
                            <Send sx={iconStyle} />
                        </IconButton>
                    </Box>
                    <IconButton aria-label="bookmark">
                        <Bookmark sx={iconStyle} />
                    </IconButton>
                </Box>
                <Typography variant="body2" component="div" fontWeight="bold">
                    좋아요 {currentLikes}개
                </Typography>
                <Typography variant="body2" component="div" color="textSecondary">
                    {feedword}
                </Typography>

                {/* 댓글 영역 */}
                {commentsOpen && (
                    <Box mt={2}>
                        <Typography variant="body2" fontWeight="bold">
                            댓글
                        </Typography>
                        {comments.map((comment) => (
                            <Box key={comment.id} mt={1}>
                                <Typography variant="body2" fontWeight="bold">
                                    {comment.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {comment.udcont}
                                </Typography>
                            </Box>
                        ))}
                        <Box mt={2}>
                            <TextField
                                fullWidth
                                placeholder="댓글을 입력하세요"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleCommentSubmit} variant="contained" sx={{ mt: 1 }}>
                                댓글 작성
                            </Button>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
