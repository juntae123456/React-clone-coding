const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); // http 모듈 추가
const path = require('path'); // path 모듈 추가
const signupRoute = require('./routes/signup'); // 회원가입 라우트 추가
const loginRoute = require('./routes/login'); // 로그인 라우트 추가
const searchRoute = require('./routes/search'); // 검색 라우트 추가
const addfeedRouter = require('./routes/addfeed'); // addfeed 라우트 추가
const getFeedRouter = require('./routes/getfeed'); // 피드 데이터 가져오는 API 추가
const addprofileRouter = require('./routes/addprofile');
const getprofilesRouter = require('./routes/getprofile');
const addStoryRouter = require('./routes/addstory');
const getStoryRouter = require('./routes/getstory');
const getUsersRouter = require('./routes/getusers');
const likeFeedRouter = require('./routes/likefeed'); // 경로에서 라우트 가져오기
const checklikeRouter = require('./routes/checklike');
const initializeSocket = require('./routes/socket'); // 소켓 초기화 함수
const usersRoute = require('./routes/users');
const messagesRouter = require('./routes/messages');
const deleteFeedRouter = require('./routes/deletefeed'); // 추가한 피드 삭제 라우트
const markMessagesReadRouter = require('./routes/markmessagesread');
const messageusersRouter = require('./routes/messageusers');
const addcommentRouter = require('./routes/addcomment'); // Corrected relative path
const getcommentsRouter = require('./routes/getcomments'); // Corrected relative path

const app = express();
const server = http.createServer(app); // http.Server 객체로 app을 감쌉니다.
const port = 3001;

app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 파싱
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 등록
app.use('/signup', signupRoute); // 회원가입 라우트 추가
app.use('/login', loginRoute); // 로그인 라우트 추가
app.use('/search', searchRoute); // 검색 API 등록
app.use('/addfeed', addfeedRouter); // 파일 업로드 경로 제공 (정적 파일 제공) -> 피드 업로드 경로
app.use('/getfeed', getFeedRouter); // 피드 데이터를 가져오는 라우트 추가
app.use('/addprofile', addprofileRouter);
app.use('/getprofile', getprofilesRouter);
app.use('/addstory', addStoryRouter); // '/addstory' 경로로 라우터 등록
app.use('/getstory', getStoryRouter);
app.use('/getusers', getUsersRouter);
app.use('/likefeed', likeFeedRouter); // '/likefeed' 경로에 라우트 추가
app.use('/checklike', checklikeRouter);
app.use('/users', usersRoute); // 사용자 목록 라우트
app.use('/messages', messagesRouter); // 메시지 라우트
app.use('/deletefeed', deleteFeedRouter); // 피드 삭제 라우트 추가
app.use('/markmessagesread', markMessagesReadRouter); // 미들웨어로 라우트 연결
app.use('/messageusers',messageusersRouter);
app.use('/addcomment',addcommentRouter);
app.use('/getcomments',getcommentsRouter);
// 소켓 초기화
const io = initializeSocket(server);

io.on('connection', (socket) => {
  console.log('사용자가 연결되었습니다.');

  // 메시지를 수신하고, 다른 사용자에게 전송
  socket.on('sendMessage', (message) => {
    // 모든 클라이언트에게 메시지 전송
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('사용자가 연결을 끊었습니다.');
  });
});

// 정적 파일 제공 (배포 시 사용)
app.use(express.static(path.join(__dirname, 'public')));

// 서버 실행
server.listen(port, () => {
    console.log(`서버가 http://10.0.1.38:${port}에서 실행 중입니다.`);
});
