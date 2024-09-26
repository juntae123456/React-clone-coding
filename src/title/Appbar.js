import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import AddFeed from './addfeed'; // AddFeed 컴포넌트
import Contents from './contents'; // Contents 컴포넌트
import AddProfile from './addprofile'; // AddProfile 컴포넌트 추가

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.common.black}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function ButtonAppBar() {
  const [selectedIcon, setSelectedIcon] = useState('home');
  const [openAddFeed, setOpenAddFeed] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Base64 이미지 URL 상태
  const [refresh, setRefresh] = useState(false); // 피드 업데이트 트리거 상태
  const userId = Number(localStorage.getItem('userId')); // 로컬 스토리지에서 사용자 ID 가져오기

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  const getIconStyles = (icon) => {
    return selectedIcon === icon
      ? { color: 'black', stroke: 'black', strokeWidth: 1 }
      : { color: 'white', stroke: 'black', strokeWidth: 1 };
  };

 // 프로필 사진 가져오기
const fetchProfileImage = () => {
  fetch(`http://localhost:3001/getprofile/${userId}`)
    .then((response) => {
      console.log('프로필 API 응답 상태:', response.status); // 응답 상태 확인
      if (!response.ok) {
        throw new Error('프로필 사진을 가져오는 중 오류 발생')
      }
      return response.blob(); // Blob 형태로 데이터를 받음
    })
    .then((blob) => {
      console.log('받은 blob 크기:', blob.size); // 받은 blob의 크기 확인
      if (blob.size > 0) {
        const imageUrl = URL.createObjectURL(blob); // Blob을 URL로 변환
        setImageSrc(imageUrl); // 상태에 이미지 URL을 저장
      } else {
        setImageSrc('/path/to/default/profile/image.png'); // 이미지가 없을 때 기본 이미지 설정
      }
    })
    .catch((error) => {
      console.error('프로필 사진을 가져오는 중 오류 발생(프론트):', error);
      setImageSrc('/path/to/default/profile/image.png'); // 오류 발생 시 기본 이미지 설정
    });
};



  // 페이지 로드 시 프로필 이미지 불러오기
  useEffect(() => {
    fetchProfileImage(); // 컴포넌트 마운트 시 프로필 사진 불러오기
  }, [userId]);

  // 피드 추가가 완료되면 Contents 컴포넌트 업데이트
  const refreshContents = () => {
    setRefresh(!refresh); // refresh 상태 변경을 통해 Contents 컴포넌트 새로고침 트리거
  };

  const handleAddFeedOpen = () => setOpenAddFeed(true);
  const handleAddFeedClose = () => setOpenAddFeed(false);

  const handleProfileDialogOpen = () => {
    setOpenProfileDialog(true);
  };
  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false);
    fetchProfileImage(); // 프로필 사진 업데이트 후 갱신
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h4" component="div">
            𝓐𝓷𝓲𝓶𝓪𝓵𝓼
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Box>
          <IconButton size="large" aria-label="home" onClick={() => handleIconClick('home')}>
            <HomeIcon sx={getIconStyles('home')} />
          </IconButton>
          <IconButton size="large" aria-label="send" onClick={() => handleIconClick('send')}>
            <SendIcon sx={getIconStyles('send')} />
          </IconButton>
          <IconButton size="large" aria-label="explore" onClick={() => handleIconClick('explore')}>
            <ExploreIcon sx={getIconStyles('explore')} />
          </IconButton>
          <IconButton size="large" aria-label="favorite" onClick={() => handleIconClick('favorite')}>
            <FavoriteIcon sx={getIconStyles('favorite')} />
          </IconButton>
          <IconButton size="large" aria-label="add" onClick={handleAddFeedOpen}>
            <AddIcon sx={{ color: 'black' }} />
          </IconButton>
          <IconButton size="large" aria-label="profile" onClick={handleProfileDialogOpen}>
            <Avatar src={imageSrc} sx={{ width: 35, height: 35 }} /> {/* 프로필 사진 미리보기 */}
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Contents 컴포넌트에 refresh 상태를 전달 */}
      <Contents refresh={refresh} />
      {/* AddFeed 다이얼로그 */}
      <AddFeed open={openAddFeed} handleClose={handleAddFeedClose} fetchFeeds={refreshContents} />

      {/* AddProfile 다이얼로그 */}
      <AddProfile open={openProfileDialog} handleClose={handleProfileDialogClose} />
    </Box>
  );
}
