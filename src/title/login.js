import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    // 간단한 로그인 검증 로직 (비밀번호와 사용자명 검증 가능)
    if (username === 'admin' && password === '1234') {
      onLogin(); // 로그인 성공 시 App.js의 상태를 변경
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Card sx={{ width: 350, height: 500, padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h3" component="div" gutterBottom align="center">
            𝒜𝓃𝒾𝓂𝒶𝒾𝓁𝓈
          </Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginClick} // 로그인 버튼 클릭 시 실행
            >
              Login
            </Button>
          </Box>
        </CardContent>
        {/* 비밀번호를 잊어버리셨습니까 버튼 추가 - 카드 끝자락으로 이동 */}
        <Box sx={{ textAlign: 'center', paddingBottom: 2 }}>
          <Button variant="text" color="primary">
            비밀번호를 잊어버리셨습니까?
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
