import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

export default function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 에러 메시지를 관리하기 위한 상태
  const navigate = useNavigate(); // useNavigate 훅 사용


  // 회원가입 처리 함수
  const handleSignupClick = async () => {
    // 입력값 검증 (name, username, password가 모두 있는지 확인)
    if (!name || !username || !password) {
      setError('모든 필드를 입력해주세요.'); // 에러 메시지 설정
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          logid: username,
          password: password,
        }),
      });

      if (response.ok) {
        alert('회원가입 성공');
        // 회원가입 성공 후 입력값 초기화
        setName('');
        setUsername('');
        setPassword('');
        setError('');
        navigate('/'); // 회원가입 성공 후 로그인 페이지로 이동
      } else {
        setError('회원가입 실패'); // 실패 시 에러 메시지 표시
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      setError('서버 오류');
    }
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
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h3" component="div" gutterBottom align="center" sx={{ fontFamily: 'cursive', fontWeight: 'bold' }}>
            𝓐𝓷𝓲𝓶𝓪𝓵𝓼
          </Typography>
          <TextField
            fullWidth
            label="이름"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              backgroundColor: '#eee',
              borderRadius: '5px',
            }}
          />
          <TextField
            fullWidth
            label="아이디"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              backgroundColor: '#eee',
              borderRadius: '5px',
            }}
          />
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              backgroundColor: '#eee',
              borderRadius: '5px',
            }}
          />
          {/* 에러 메시지 표시 */}
          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              color="secondary"
              onClick={() => navigate('/')} // 로그인 화면으로 이동
            >
              로그인
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignupClick} // 회원가입 버튼 클릭 시 실행
            >
              회원가입
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
