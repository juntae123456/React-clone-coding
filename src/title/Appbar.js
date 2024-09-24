import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import Contents from './contents';
import AddFeed from './addfeed'; // 추가한 파일을 임포트

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
  const [openAddFeed, setOpenAddFeed] = useState(false); // AddFeed 다이얼로그 상태

  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  const getIconStyles = (icon) => {
    return selectedIcon === icon
      ? { color: 'black', stroke: 'black', strokeWidth: 1 }
      : { color: 'white', stroke: 'black', strokeWidth: 1 };
  };

  const handleAddFeedOpen = () => {
    setOpenAddFeed(true); // 다이얼로그 열기
  };

  const handleAddFeedClose = () => {
    setOpenAddFeed(false); // 다이얼로그 닫기
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
        </Toolbar>
      </AppBar>
      <Contents />

      {/* AddFeed 다이얼로그 */}
      <AddFeed open={openAddFeed} handleClose={handleAddFeedClose} />
    </Box>
  );
}
