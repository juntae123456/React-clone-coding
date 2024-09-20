import React, { useState } from 'react';
import AppBar from './title/Appbar'; // AppBar 컴포넌트 (ButtonAppBar.js 파일에서 가져옴)
import Login from './title/login'; // Login 컴포넌트 (login.js 파일에서 가져옴)

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 성공 시 호출되는 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <AppBar /> // 로그인하면 AppBar로 이동
      ) : (
        <Login onLogin={handleLogin} /> // 로그인 전에는 Login 화면을 보여줌
      )}
    </div>
  );
}
