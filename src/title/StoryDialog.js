import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper 기본 CSS
import 'swiper/css/navigation'; // 네비게이션을 위한 CSS (필요 시)
import 'swiper/css/pagination'; // 페이지네이션을 위한 CSS (필요 시)

export default function StoryDialog({ open, handleClose, storyId }) {
  const [stories, setStories] = useState([]); // 여러 스토리 상태

  // 스토리 이미지를 가져오는 함수
  const fetchStory = () => {
    fetch(`http://localhost:3001/getstory/${storyId}`)
      .then((response) => response.json())
      .then((data) => {
        setStories(data); // 여러 스토리 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('스토리 데이터를 가져오는 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    if (storyId && open) {
      fetchStory(); // 스토리 ID가 있을 때만 데이터를 가져옴
    }
  }, [storyId, open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>스토리 보기</DialogTitle>
      <DialogContent>
        {stories.length > 0 ? (
          <Swiper spaceBetween={10} slidesPerView={1}>
            {stories.map((storyImage, index) => (
              <SwiperSlide key={index}>
                <img src={storyImage} alt={`스토리 ${index + 1}`} style={{ width: '100%' }} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>스토리를 불러오는 중입니다...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
