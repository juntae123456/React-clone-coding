import React, {useState, useEffect} from 'react';
import {
    Avatar,
    Box,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    IconButton,
    Typography
} from '@mui/material';
import {Favorite, ChatBubble, Send, Bookmark, Delete} from '@mui/icons-material';

export default function PostCard({id, feedid, userName, fileBlob, likesCount, feedword, onDelete}) {
    const [profileImageSrc, setProfileImageSrc] = useState(null); // 각 포스트 작성자의 프로필 이미지
    const [currentLikes, setCurrentLikes] = useState(likesCount); // 좋아요 수 상태 관리
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    const loggedInUserId = Number(localStorage.getItem('userId')); // 로그인한 사용자 ID

    // 각 사용자의 프로필 이미지를 가져오는 함수 (feedid를 사용)
    const fetchProfileImage = () => {
        fetch(`http://10.0.1.38:3001/getprofile?propilid=${feedid}`) // feedid로 해당 포스트 작성자의 프로필 이미지 요청
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
        fetch('http://10.0.1.38:3001/checklike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({feedId: id, userId: loggedInUserId}),
        })
            .then((response) => response.json())
            .then((data) => {
                setLiked(data.liked); // 서버에서 받은 liked 상태로 업데이트
            })
            .catch((error) => {
                console.error('좋아요 상태 확인 중 오류 발생:', error);
            });
    };

    // 컴포넌트가 마운트될 때 해당 작성자의 프로필 이미지 불러오기
    useEffect(() => {
        fetchProfileImage();
        checkIfLiked();
    }, [userName, loggedInUserId]);

    const [imageSrc, setImageSrc] = useState(''); // 파일 이미지를 상태로 저장

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

    const handleLikeClick = () => {
        const newLikedState = !liked;

        // 좋아요 수 업데이트 로직 (클라이언트에서만 일단 상태 업데이트)
        setCurrentLikes((prevLikes) => newLikedState ? prevLikes + 1 : prevLikes - 1);

        // 서버에 좋아요 수 업데이트 요청
        fetch('http://10.0.1.38:3001/likefeed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({feedId: id, userId: loggedInUserId, liked: newLikedState}), // userId 추가
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('좋아요 업데이트 성공:', data);
                setLiked(newLikedState); // 서버 응답 후 liked 상태 업데이트
            })
            .catch((error) => {
                console.error('좋아요 업데이트 중 오류 발생:', error);
            });
    };

    const handleDeleteClick = () => {
        // 서버에 피드 삭제 요청
        fetch(`http://10.0.1.38:3001/deletefeed/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log('피드 삭제 성공');
                    if (onDelete) onDelete(id); // 삭제 후 부모 컴포넌트에게 알림
                }
            })
            .catch((error) => {
                console.error('피드 삭제 중 오류 발생:', error);
            });
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
        <Card style={{marginBottom: '20px'}}>
            <CardHeader
                avatar={
                    <Avatar aria-label="profile" src={profileImageSrc || ''}>
                        {!profileImageSrc && userName[0].toUpperCase()} {/* 프로필 이미지가 없을 경우 이름 첫 글자 표시 */}
                    </Avatar>
                }
                title={userName}
                action={
                    loggedInUserId === feedid && (
                        <IconButton aria-label="delete" onClick={handleDeleteClick}>
                            <Delete/>
                        </IconButton>
                    )
                } // 작성자와 현재 사용자가 같을 때만 삭제 버튼 표시
            />
            {/* 변환된 이미지 데이터를 렌더링 */}
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
                            <Favorite sx={heartIconStyle}/>
                        </IconButton>
                        <IconButton aria-label="comment">
                            <ChatBubble sx={iconStyle}/>
                        </IconButton>
                        <IconButton aria-label="send">
                            <Send sx={iconStyle}/>
                        </IconButton>
                    </Box>
                    <IconButton aria-label="bookmark">
                        <Bookmark sx={iconStyle}/>
                    </IconButton>
                </Box>
                <Typography variant="body2" component="div" fontWeight="bold">
                    좋아요 {currentLikes}개
                </Typography>
                <Typography variant="body2" component="div" color="textSecondary">
                    {feedword}
                </Typography>
            </CardContent>
        </Card>
    );
}
