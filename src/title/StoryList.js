import React, {useState, useEffect} from 'react';
import {Avatar, Box, Typography} from '@mui/material';
import StoryDialog from './StoryDialog'; // StoryDialog 컴포넌트 가져오기
import {Swiper, SwiperSlide} from 'swiper/react'; // Swiper 관련 컴포넌트
import 'swiper/css'; // Swiper 기본 CSS

function StoryList() {
    const [users, setUsers] = useState([]); // 사용자 목록 상태
    const [selectedStoryId, setSelectedStoryId] = useState(null); // 선택된 스토리 ID
    const [open, setOpen] = useState(false); // 다이얼로그 열림/닫힘 상태
    const [profileImages, setProfileImages] = useState({}); // 사용자별 프로필 이미지를 저장하는 상태

    // 스토리가 있는 사용자 목록을 가져오는 함수
    const fetchUsersWithStories = () => {
        fetch('http://10.0.1.38:3001/getusers') // 스토리가 있는 사용자 목록 API 호출
            .then((response) => response.json())
            .then((data) => {
                setUsers(data); // 스토리가 있는 사용자 목록을 상태에 저장
                data.forEach((user) => fetchProfileImage(user.id)); // 각 사용자의 프로필 이미지를 가져옴
            })
            .catch((error) => {
                console.error('사용자 목록을 가져오는 중 오류 발생:', error);
            });
    };

    // 프로필 사진을 가져오는 함수
    const fetchProfileImage = (userId) => {
        fetch(`http://10.0.1.38:3001/getprofile?propilid=${userId}`)
            .then((response) => response.blob())
            .then((blob) => {
                const imageUrl = URL.createObjectURL(blob);
                setProfileImages((prev) => ({
                    ...prev,
                    [userId]: imageUrl, // 사용자 ID에 따른 이미지 저장
                }));
            })
            .catch((error) => {
                console.error(`프로필 사진을 가져오는 중 오류 발생 (ID: ${userId}):`, error);
            });
    };

    // 프로필 클릭 시 스토리 다이얼로그 열기
    const handleProfileClick = (userId) => {
        setSelectedStoryId(userId); // 선택된 사용자 ID 설정
        setOpen(true); // 다이얼로그 열기
    };

    // 다이얼로그 닫기 처리
    const handleClose = () => {
        setOpen(false); // 다이얼로그 닫기
        setSelectedStoryId(null); // 스토리 ID 초기화
    };

    // 컴포넌트가 처음 렌더링될 때 스토리가 있는 사용자 목록을 가져옴
    useEffect(() => {
        fetchUsersWithStories();
    }, []);

    return (
        <Box
            display="flex"
            justifyContent="flex-start" // 프로필을 왼쪽 정렬
            alignItems="center" // 프로필들이 수평으로 정렬되도록 중앙에 정렬
            p={2}
            overflow="auto"
            sx={{
                backgroundColor: 'white',
                borderRadius: '0px',
                border: '1px solid #e0e0e0',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Swiper로 스토리 슬라이더 구현 */}
            <Swiper spaceBetween={20} slidesPerView="auto"> {/* 사용자 간 간격 설정 */}
                {users.map((user) => (
                    <SwiperSlide key={user.id} style={{width: 'auto'}}>
                        <Box mx={1} textAlign="center" display="flex" flexDirection="column" alignItems="center">
                            <Avatar
                                sx={{
                                    width: 50, // 프로필 이미지 크기 지정
                                    height: 50,
                                    bgcolor: '#b39ddb',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleProfileClick(user.id)} // 클릭 시 해당 사용자의 스토리 로드
                                src={profileImages[user.id] || ''} // 프로필 이미지 URL 사용
                            >
                                {!profileImages[user.id] && user.name[0].toUpperCase()} {/* 프로필 이미지가 없을 경우 이름 첫 글자 표시 */}
                            </Avatar>
                            <Typography variant="caption" sx={{textAlign: 'center', mt: 1}}>
                                {user.name}
                            </Typography> {/* 사용자 이름 표시 */}
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 스토리를 보여주는 다이얼로그 */}
            <StoryDialog open={open} handleClose={handleClose} storyId={selectedStoryId}/>
        </Box>
    );
}

export default StoryList;
