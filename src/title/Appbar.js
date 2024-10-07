import React, { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Autocomplete, TextField } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import AddFeed from './addfeed';
import AddStory from './addstory';
import Contents from './contents';
import Message from './Message';
import AddProfile from './addprofile';

export default function ButtonAppBar() {
    const [selectedIcon, setSelectedIcon] = useState('home');
    const [openAddFeed, setOpenAddFeed] = useState(false);
    const [openAddStory, setOpenAddStory] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const userId = Number(localStorage.getItem('userId'));
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [profileImages, setProfileImages] = useState({}); // 사용자별 프로필 이미지 상태

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
    };

    const getIconStyles = (icon) => {
        return selectedIcon === icon
            ? { color: 'black', stroke: 'black', strokeWidth: 1 }
            : { color: 'white', stroke: 'black', strokeWidth: 1 };
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
        setRefresh(!refresh);
    };

    // 사용자별 프로필 이미지를 가져오는 함수
    const fetchProfileImages = (users) => {
        const updatedProfileImages = {};
        users.forEach((user) => {
            fetch(`http://10.0.1.38:3001/getprofile?propilid=${user.id}`)
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        updatedProfileImages[user.id] = reader.result;
                        setProfileImages((prevImages) => ({
                            ...prevImages,
                            [user.id]: reader.result,
                        }));
                    };
                })
                .catch((error) => {
                    console.error(`프로필 이미지를 가져오는 중 오류 발생 (${user.name}):`, error);
                });
        });
    };

    // 검색 API 호출
    const handleSearchChange = (event, value) => {
        if (value) {
            fetch(`http://10.0.1.38:3001/search?q=${value}`)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResults(data);
                    fetchProfileImages(data); // 검색된 사용자들의 프로필 이미지를 가져옴
                })
                .catch((error) => {
                    console.error('검색 중 오류 발생:', error);
                });
        } else {
            setSearchResults([]);
        }
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

    const handleTitleClick = () => {
        setSelectedIcon('home');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="inherit" sx={{ backgroundColor: 'white', color: 'black' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h4"
                        component="div"
                        onClick={handleTitleClick}
                        sx={{ cursor: 'pointer' }}
                    >
                        𝓐𝓷𝓲𝓶𝓪𝓵𝓼
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                        <Autocomplete
                            freeSolo
                            options={searchResults}
                            getOptionLabel={(option) => option.name}
                            onInputChange={handleSearchChange}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} display="flex" alignItems="center">
                                    <Avatar
                                        src={profileImages[option.id] || '/path/to/default/profile/image.png'}
                                        sx={{ marginRight: 1, width: 40, height: 40 }}
                                    />
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search…"
                                    variant="outlined"
                                    sx={{
                                        width: '300px',
                                        backgroundColor: 'white',
                                    }}
                                />
                            )}
                        />
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
                    <IconButton size="large" aria-label="add" onClick={handleMenuOpen}>
                        <AddIcon sx={{ color: 'black' }} />
                    </IconButton>
                    <IconButton size="large" aria-label="profile" onClick={handleProfileDialogOpen}>
                        <Avatar src={imageSrc || '/path/to/default/profile/image.png'} sx={{ width: 35, height: 35 }} />
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
            {selectedIcon === 'home' && <Contents refresh={refresh} />}
            {selectedIcon === 'send' && <Message />}

            <AddFeed open={openAddFeed} handleClose={handleAddFeedClose} fetchFeeds={refreshContents} />

            <AddStory open={openAddStory} handleClose={handleAddStoryClose} fetchStories={refreshContents} />

            <AddProfile open={openProfileDialog} handleClose={handleProfileDialogClose} />
        </Box>
    );
}
