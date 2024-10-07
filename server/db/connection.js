const mysql = require('mysql');

const pool = mysql.createPool({
  host: '127.0.0.1',   // MySQL 서버 IP 주소
  user: 'root',        // MySQL 사용자명
  password: '',        // MySQL 비밀번호
  database: 'animals', // 사용할 데이터베이스 이름
  connectionLimit: 10, // 최대 동시 연결 수
  waitForConnections: true, // 연결이 없을 때 대기
  queueLimit: 0 // 무제한 대기
});

pool.on('connection', (connection) => {
  console.log('MySQL 데이터베이스 연결됨.');
});

pool.on('error', (err) => {
  console.error('MySQL 연결 중 오류 발생:', err);
});

module.exports = pool;
