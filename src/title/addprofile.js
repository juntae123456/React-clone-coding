import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function AddProfile({ open, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // 변환된 이미지 URL 상태 저장
  const userId = Number(localStorage.getItem('userId')); // 로컬 스토리지에서 사용자 ID 가져오기

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Base64 URL로 변환된 이미지 저장
      };
      reader.readAsDataURL(file); // 파일을 Base64 형식으로 읽음
    }
  };

  const handleUpload = () => {
    if (!userId || !selectedFile) {
      alert('프로필 사진을 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('propilid', userId); // 프로필 ID로 사용자 ID를 보냄

    fetch('http://127.0.0.1:3001/addprofile', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log('서버 응답 상태 코드:', response.status); // 상태 코드 로그 출력
        if (!response.ok) {
          return response.text().then((text) => {
            console.error('서버 응답:', text); // 서버에서 반환된 에러 메시지 로그
            throw new Error('프로필 사진 업로드 실패');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('프로필 업로드 성공:', data);
        console.log('업로드된 프로필 ID:', data.profileId); // 여기서 propilid가 올바르게 출력되는지 확인
        handleClose(); // 업로드 후 다이얼로그 닫기
      })
      .catch((error) => {
        console.error('프로필 사진 업로드 중 오류 발생:', error);
        alert('프로필 사진 업로드 실패. 다시 시도해주세요.');
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>프로필 사진 변경</DialogTitle>
      <DialogContent>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="미리보기"
            style={{ width: '100%', marginTop: '10px' }}
          />
        )} {/* 선택한 이미지 미리보기 */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">취소</Button>
        <Button onClick={handleUpload} color="primary">업로드</Button>
      </DialogActions>
    </Dialog>
  );
}
