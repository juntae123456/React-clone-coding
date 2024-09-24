import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export default function AddFeed({ open, handleClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedword, setFeedword] = useState('');
  const userId = localStorage.getItem('userId'); // localStorage에서 userId 가져옴

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!userId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (selectedFile && feedword) {
      const formData = new FormData();
      formData.append('file', selectedFile); // 파일 데이터
      formData.append('feedword', feedword); // 피드 설명
      formData.append('feedid', userId); // 로그인된 사용자 ID (feedid)

      fetch('http://localhost:3001/addfeed', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('피드 업로드 성공:', data);
          handleClose();
        })
        .catch((error) => {
          console.error('피드 업로드 오류:', error);
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>피드 추가</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="피드 설명" variant="outlined" margin="normal" value={feedword} onChange={(e) => setFeedword(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">취소</Button>
        <Button onClick={handleUpload} color="primary" disabled={!selectedFile || !feedword}>업로드</Button>
      </DialogActions>
    </Dialog>
  );
}
