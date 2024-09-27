import React, { useState, useEffect } from 'react';
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
import { Favorite, ChatBubble, Send, Bookmark } from '@mui/icons-material';

export default function PostCard({feedid,userName, fileBlob, likesCount, feedword }) {
  const [profileImageSrc, setProfileImageSrc] = useState(null); // 각 포스트 작성자의 프로필 이미지

  // 각 사용자의 프로필 이미지를 가져오는 함수
  const fetchProfileImage = () => {
    fetch(`http://localhost:3001/getprofile?propilid=${feedid}`) // 해당 포스트 작성자의 프로필 이미지 요청
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

  // 컴포넌트가 마운트될 때 해당 작성자의 프로필 이미지 불러오기
  useEffect(() => {
    fetchProfileImage();
  }, [userName]);

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

  const [liked, setLiked] = useState(false); // 좋아요 상태 관리

  const handleLikeClick = () => {
    setLiked(!liked); // 좋아요 상태 토글
  };

  const heartIconStyle = {
    color: liked ? 'red' : 'white',
    stroke: liked ? 'none' : 'black',
    strokeWidth: 1.5,
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardHeader
        avatar={
          <Avatar aria-label="profile" src={profileImageSrc || ''}>
            {!profileImageSrc && userName[0].toUpperCase()} {/* 프로필 이미지가 없을 경우 이름 첫 글자 표시 */}
          </Avatar>
        }
        title={userName}
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
              <Favorite sx={heartIconStyle} />
            </IconButton>
            <IconButton aria-label="comment">
              <ChatBubble sx={{ color: 'black' }} />
            </IconButton>
            <IconButton aria-label="send">
              <Send sx={{ color: 'black' }} />
            </IconButton>
          </Box>
          <IconButton aria-label="bookmark">
            <Bookmark sx={{ color: 'black' }} />
          </IconButton>
        </Box>
        <Typography variant="body2" component="div" fontWeight="bold">
          좋아요 {likesCount}개
        </Typography>
        <Typography variant="body2" component="div" color="textSecondary">
          {feedword}
        </Typography>
      </CardContent>
    </Card>
  );
}
