import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

const handleLoginClick = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('userId', result.id); // 서버에서 받은 사용자 ID 저장
      localStorage.setItem('name', result.name); // 사용자 이름도 저장
      console.log('저장된 userId:', localStorage.getItem('userId')); // localStorage에 저장된 userId 출력
      console.log('저장된 name:', localStorage.getItem('name')); // localStorage에 저장된 name 출력

      onLogin();
      navigate('/appbar'); // 로그인 성공 후 Appbar로 이동
    } else {
      const errorMessage = await response.text();
      setError(errorMessage); // 에러 메시지 표시
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    setError('서버 오류');
  }
};

  const handleSignupClick = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card sx={{ width: 350, height: 500, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
          <Typography variant="h3" component="div" gutterBottom align="center" sx={{ fontFamily: 'cursive', fontWeight: 'bold' }}>
            𝓐𝓷𝓲𝓶𝓪𝓵𝓼
          </Typography>
          <TextField
            fullWidth
            label="아이디"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginClick} // 로그인 버튼 클릭 시 실행
            >
              로그인
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={handleSignupClick} // 회원가입 버튼 클릭 시 실행
              sx={{ mt: 1 }}
            >
              회원가입
            </Button>
          </Box>
        </CardContent>
        <Box sx={{ textAlign: 'center', paddingBottom: 2 }}>
          <Button variant="text" color="primary">
            비밀번호를 잊어버리셨습니까?
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
