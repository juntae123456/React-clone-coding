const socketIO = require('socket.io');
const db = require('../db/connection');

function initializeSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('사용자 접속:', socket.id);

    // 메시지 수신 시 저장하고 상대방에게 전송
    socket.on('sendMessage', ({ sender_id, receiver_id, text }) => {
      const query = 'INSERT INTO Messages (sender_id, receiver_id, text) VALUES (?, ?, ?)';
      db.query(query, [sender_id, receiver_id, text], (err, result) => {
        if (err) {
          console.error('메시지 저장 오류:', err);
        } else {
          // 상대방에게 메시지 전송
          io.to(receiver_id).emit('receiveMessage', { sender_id, receiver_id, text, id: result.insertId });
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('사용자 접속 해제:', socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
