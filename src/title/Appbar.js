import React, {useState, useEffect} from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {IconButton, Avatar, Menu, MenuItem} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import AddFeed from './addfeed';
import AddStory from './addstory';
import Contents from './contents'; // Contents 컴포넌트 가져오기
import Message from './Message'; // Message 컴포넌트 가져오기
import AddProfile from './addprofile';

const Search = styled('div')(({theme}) => ({
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

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
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
    const [selectedIcon, setSelectedIcon] = useState('home'); // home, send 등을 저장할 상태
    const [openAddFeed, setOpenAddFeed] = useState(false);
    const [openAddStory, setOpenAddStory] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const userId = Number(localStorage.getItem('userId'));
    const [anchorEl, setAnchorEl] = useState(null);

    const handleIconClick = (icon) => {
        setSelectedIcon(icon); // 클릭한 아이콘을 상태에 저장
    };

    const getIconStyles = (icon) => {
        return selectedIcon === icon
            ? {color: 'black', stroke: 'black', strokeWidth: 1}
            : {color: 'white', stroke: 'black', strokeWidth: 1};
    };

    const fetchProfileImage = () => {
        fetch(`http://10.0.1.38:3001/getprofile?propilid=${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('프로필 사진을 가져오는 중 오류 발생');
                }
                return response.blob();
            })
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    setImageSrc(base64data);
                };
            })
            .catch((error) => {
                console.error('프로필 사진을 가져오는 중 오류 발생:', error);
                setImageSrc('/path/to/default/profile/image.png');
            });
    };

    useEffect(() => {
        fetchProfileImage();
    }, []);

    const refreshContents = () => {
        console.log("refresh triggered");
        setRefresh(!refresh);
    };

    const handleAddFeedOpen = () => setOpenAddFeed(true);
    const handleAddFeedClose = () => setOpenAddFeed(false);

    const handleAddStoryOpen = () => setOpenAddStory(true);
    const handleAddStoryClose = () => setOpenAddStory(false);

    const handleProfileDialogOpen = () => setOpenProfileDialog(true);
    const handleProfileDialogClose = () => {
        setOpenProfileDialog(false);
        fetchProfileImage();
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" color="inherit" sx={{backgroundColor: 'white', color: 'black'}}>
                <Toolbar sx={{justifyContent: 'space-between'}}>
                    <Typography variant="h4" component="div">
                        𝓐𝓷𝓲𝓶𝓪𝓵𝓼
                    </Typography>
                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search…" inputProps={{'aria-label': 'search'}}/>
                        </Search>
                    </Box>
                    <IconButton size="large" aria-label="home" onClick={() => handleIconClick('home')}>
                        <HomeIcon sx={getIconStyles('home')}/>
                    </IconButton>
                    <IconButton size="large" aria-label="send" onClick={() => handleIconClick('send')}>
                        <SendIcon sx={getIconStyles('send')}/>
                    </IconButton>
                    <IconButton size="large" aria-label="explore" onClick={() => handleIconClick('explore')}>
                        <ExploreIcon sx={getIconStyles('explore')}/>
                    </IconButton>
                    <IconButton size="large" aria-label="favorite" onClick={() => handleIconClick('favorite')}>
                        <FavoriteIcon sx={getIconStyles('favorite')}/>
                    </IconButton>
                    <IconButton size="large" aria-label="add" onClick={handleMenuOpen}>
                        <AddIcon sx={{color: 'black'}}/>
                    </IconButton>
                    <IconButton size="large" aria-label="profile" onClick={handleProfileDialogOpen}>
                        <Avatar src={imageSrc || '/path/to/default/profile/image.png'} sx={{width: 35, height: 35}}/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        handleAddFeedOpen();
                        handleMenuClose();
                    }}
                >
                    피드 추가
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleAddStoryOpen();
                        handleMenuClose();
                    }}
                >
                    스토리 추가
                </MenuItem>
            </Menu>

            {/* 여기가 핵심 부분: selectedIcon에 따라 다른 컴포넌트를 렌더링 */}
            {selectedIcon === 'home' && <Contents refresh={refresh}/>}
            {selectedIcon === 'send' && <Message/>} {/* Message 컴포넌트가 send 클릭 시 보임 */}

            <AddFeed open={openAddFeed} handleClose={handleAddFeedClose} fetchFeeds={refreshContents}/>

            <AddStory open={openAddStory} handleClose={handleAddStoryClose} fetchStories={refreshContents}/>

            <AddProfile open={openProfileDialog} handleClose={handleProfileDialogClose}/>
        </Box>
    );
}
