import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function AddStory({ open, handleClose, fetchStories }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userId'); // localStorage에서 userId 가져옴

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleAddStory = () => {
    if (!selectedImage) {
      alert('스토리에 추가할 이미지를 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('story', selectedImage);
    formData.append('Storyid', userId); // 로그인된 사용자 ID

    fetch('http://10.0.1.38:3001/addstory', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('스토리 업로드 성공:', data);
        fetchStories(); // 스토리 목록 갱신 - 확인 포인트!
        setSelectedImage(null); // 이미지 선택 필드 초기화
        handleClose(); // 다이얼로그 닫기
      })
      .catch((error) => {
        console.error('스토리를 추가하는 중 오류 발생:', error);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>스토리 추가</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange} // 이미지 선택 시 호출
        />
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="스토리 미리보기"
            style={{ width: '100%', marginTop: '10px' }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          취소
        </Button>
        <Button onClick={handleAddStory} color="primary">
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
