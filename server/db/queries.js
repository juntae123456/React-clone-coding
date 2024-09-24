const db = require('./connection'); // MariaDB 연결 설정 가져오기

// 사용자를 삽입하는 함수
const insertUser = (name, logid, password, callback) => {
  const query = 'INSERT INTO Log (name, logid, password) VALUES (?, ?, ?)';
  db.query(query, [name, logid, password], callback);  // 콜백 함수로 결과 처리
};

// 사용자를 아이디로 조회하는 함수
const getUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM Log WHERE logid = ?'; // logid 필드를 기준으로 사용자 조회
  db.query(query, [username], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null); // 사용자가 없으면 null 반환
    }
    return callback(null, results[0]); // 첫 번째 사용자 정보 반환
  });
};

// 피드를 삽입하는 함수
const insertFeed = (feedid, feedview, feedword, feedgood, callback) => {
  const query = 'INSERT INTO Feed (feedid, feedview, feedword, feedgood) VALUES (?, ?, ?, ?)';
  db.query(query, [feedid, feedview, feedword, feedgood], callback);
};

// 두 함수 모두 내보내기
module.exports = {
  insertUser,
  getUserByUsername,
  insertFeed
};
