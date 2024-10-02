const mysql = require('mysql');

const db = mysql.createConnection({
  host: '0.0.0.0',   // MySQL 서버 주소 (로컬 서버)
  port: '3306',        // MySQL 기본 포트 번호
  user: 'root',        // MySQL 사용자명
  password: '',        // MySQL 비밀번호 (설치 시 설정한 비밀번호)
  database: 'animals', // 사용할 데이터베이스 이름
  reconnect: true
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);  // 오류 발생 시 출력
  } else {
    console.log('MySQL에 연결되었습니다.');  // 연결 성공 시 출력
  }
});

module.exports = db; // MySQL 연결 객체를 모듈로 내보냄
