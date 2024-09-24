import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppBar from './title/Appbar'; // AppBar 컴포넌트
import Login from './title/login'; // Login 컴포넌트
import Signup from './title/new'; // Signup 컴포넌트

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 성공 시 호출되는 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
    // localStorage.setItem('isLoggedIn', 'true'); // localStorage에 로그인 상태 저장하지 않음
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
    // localStorage.removeItem('isLoggedIn'); // localStorage에서 로그인 상태 삭제
  };

  // 컴포넌트가 처음 로드될 때 항상 로그아웃 상태로 설정
  useEffect(() => {
    // 페이지가 로드되면 로그인 상태를 항상 false로 초기화
    setIsLoggedIn(false);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/appbar" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="/signup" element={<Signup />} /> {/* 회원가입 경로 */}
        <Route
          path="/appbar"
          element={
            isLoggedIn ? <AppBar onLogout={handleLogout} /> : <Navigate to="/" />
          }
        /> {/* 로그인 후 이동할 AppBar 경로 */}
      </Routes>
    </Router>
  );
}
