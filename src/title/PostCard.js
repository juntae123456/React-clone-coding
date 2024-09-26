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

export default function PostCard({ userName, fileBlob, likesCount, feedword }) {
  const [imageSrc, setImageSrc] = useState(''); // 이미지 소스를 상태로 저장

  // 파일 Blob을 이미지로 변환하는 useEffect
  useEffect(() => {
    if (fileBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(fileBlob); // 파일 데이터를 URL로 변환

      reader.onloadend = () => {
        setImageSrc(reader.result); // 변환된 이미지 데이터를 상태에 저장
      };
    }
  }, [fileBlob]); // fileBlob이 변경될 때마다 실행

  const [liked, setLiked] = useState(false); // 좋아요 상태 관리

  const heartIconStyle = {
    color: liked ? 'red' : 'white', // 좋아요 시 빨간색, 기본 흰색
    stroke: liked ? 'none' : 'black', // 좋아요 시 테두리 제거, 기본 검정 테두리
    strokeWidth: 1.5,
  };

  const handleLikeClick = () => {
    setLiked(!liked); // 클릭 시 좋아요 상태를 반전시킴
  };

  const iconStyle = {
    color: 'white',
    stroke: 'black',
    strokeWidth: 1.5,
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardHeader
        avatar={<Avatar aria-label="profile">{userName[0].toUpperCase()}</Avatar>}
        title={userName}
      />
      {/* 변환된 이미지 데이터를 렌더링 */}
      {imageSrc && (
        <CardMedia
          component="img"
          height="800"
          image={imageSrc} // 이미지 소스를 출력
          alt="Post image"
          style={{ backgroundColor: '#6d6d6d' }} // 이미지가 없을 때 배경색 설정
        />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
              <Favorite sx={heartIconStyle} />
            </IconButton>
            <IconButton aria-label="comment">
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
          좋아요 {likesCount}개
        </Typography>
        <Typography variant="body2" component="div" color="textSecondary">
          {feedword} {/* 피드 설명 */}
        </Typography>
      </CardContent>
    </Card>
  );
}
