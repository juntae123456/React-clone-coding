import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Message = () => {
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 상태
  const [messages, setMessages] = useState([]); // 메시지 상태
  const [inputValue, setInputValue] = useState(''); // 입력 상태
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const loggedInUserId = Number(localStorage.getItem('userId')); // 로컬 스토리지에서 로그인된 사용자 ID 가져오기

  // 메시지 읽음 처리 함수
  const markMessagesAsRead = (messageIds, partnerId) => {
    fetch('http://127.0.0.1:3001/markmessagesread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: loggedInUserId, // 로그인한 사용자 ID
        partnerId: partnerId, // 대화 상대의 ID
        messageIds // 읽음 처리할 메시지의 ID 목록
      }),
    })
      .then(() => {
        // 읽음 처리 후 사용자 목록의 unreadMessages 업데이트
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === partnerId
              ? { ...user, unreadMessages: 0 }
              : user
          )
        );
      })
      .catch(error => console.error('메시지 읽음 처리 중 오류:', error));
  };

  // 사용자 선택 시 해당 사용자와의 대화 내역 가져오기 + 읽음 처리
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetch(`http://127.0.0.1:3001/messages/${loggedInUserId}/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data); // 선택된 사용자와의 메시지 설정

        // 읽지 않은 메시지들에 대해 읽음 처리
        const unreadMessageIds = data.filter((msg) => !msg.is_read).map((msg) => msg.id);
        if (unreadMessageIds.length > 0) {
          markMessagesAsRead(unreadMessageIds, user.id);
        }
      })
      .catch((error) => console.error('메시지 가져오는 중 오류:', error));
  };

  // 메시지 전송
  const handleMessageSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        sender_id: loggedInUserId, // 실제 로그인한 사용자 ID 사용
        receiver_id: selectedUser.id,
        text: inputValue,
      };

      // 메시지 저장 API 호출
      fetch('http://127.0.0.1:3001/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })
        .then((response) => response.json())
        .then((data) => {
          // 메시지 전송 후 UI 업데이트
          setMessages([...messages, { ...newMessage, id: data.messageId }]);
          setInputValue('');
        })
        .catch((error) => console.error('메시지 전송 중 오류:', error));
    }
  };

  // 처음에 사용자 목록 가져오기
  useEffect(() => {
    fetch(`http://127.0.0.1:3001/messageusers?userId=${loggedInUserId}`) // 사용자 목록 가져오는 API 호출
      .then((response) => response.json())
      .then((data) => {
        // 로그인한 사용자 제외한 목록 필터링
        const filteredUsers = data.filter((user) => user.id !== loggedInUserId);
        setUsers(filteredUsers); // 사용자 목록 상태 업데이트
      })
      .catch((error) => console.error('사용자 목록 가져오는 중 오류:', error));
  }, [loggedInUserId]);

  return (
    <Box p={2} maxWidth={1200} margin="0 auto">
      <Box display="flex" height="100vh">
        {/* 왼쪽: 메시지 목록 */}
        <Box width="30%" bgcolor="#F9F9F9" p={2}>
          <Typography variant="h6" gutterBottom>
            전체
          </Typography>
          <List>
            {users.map((user) => (
              <ListItem button key={user.id} onClick={() => handleUserSelect(user)}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary="메시지" />
                {user.unreadMessages > 0 && ( // 읽지 않은 메시지가 있을 경우에만 뱃지 표시
                  <Badge badgeContent={user.unreadMessages} color="error" />
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* 오른쪽: 대화 창 */}
        <Box width="70%" display="flex" flexDirection="column" borderLeft="1px solid #ddd">
          {/* 상단: 사용자 정보 */}
          {selectedUser ? (
            <>
              <Box display="flex" alignItems="center" bgcolor="#F1F1F1" p={2}>
                <IconButton onClick={() => {
                  setSelectedUser(null);
                  setMessages([]); // 메시지 리스트 초기화
                  setInputValue(''); // 입력 필드 초기화
                }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">{selectedUser.name}</Typography>
              </Box>

              {/* 메시지 영역 */}
              <Box flex={1} p={2} bgcolor="#FFF">
                {messages.map((message) => (
                  <Box
                    key={message.id} // 고유한 key 추가
                    display="flex"
                    justifyContent={message.sender_id === loggedInUserId ? 'flex-end' : 'flex-start'} // sender_id로 사용자 구분
                    mb={2}
                  >
                    {message.sender_id !== loggedInUserId && <Avatar sx={{ mr: 1 }} />}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        maxWidth: '60%',
                        bgcolor: message.sender_id === loggedInUserId ? '#2979ff' : '#e0e0e0',
                        color: message.sender_id === loggedInUserId ? 'white' : 'black',
                      }}
                    >
                      {message.text}
                    </Paper>
                  </Box>
                ))}
              </Box>

              {/* 입력창 */}
              <Box p={2} display="flex" bgcolor="#F1F1F1">
                <TextField
                  variant="outlined"
                  placeholder="메시지를 입력하세요"
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleMessageSend();
                  }}
                />
                <Button variant="contained" color="primary" onClick={handleMessageSend} sx={{ ml: 1 }}>
                  전송
                </Button>
              </Box>
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="h6">사용자를 선택하세요</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
