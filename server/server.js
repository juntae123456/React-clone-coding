const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup'); // 회원가입 라우트 추가
const loginRoute = require('./routes/login'); // 로그인 라우트 추가
const searchRoute = require('./routes/search'); //검색 라우트 추가
const addfeedRouter = require('./routes/addfeed'); // addfeed 라우트 추가
const getFeedRouter = require('./routes/getfeed'); // 피드 데이터 가져오는 API 추가
const addprofileRouter = require('./routes/addprofile');
const getprofilesRouter = require('./routes/getprofile');

const app = express();
const port = 3001;

app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 파싱
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 등록
app.use('/signup', signupRoute); // 회원가입 라우트 추가
app.use('/login', loginRoute); // 로그인 라우트 추가

// 검색 API 등록
app.use('/search', searchRoute);

// 파일 업로드 경로 제공 (정적 파일 제공) -> 피드 업로드 경로
app.use('/addfeed', addfeedRouter);

app.use('/getfeed', getFeedRouter);// 피드 데이터를 가져오는 라우트 추가

app.use('/addprofile', addprofileRouter);

app.use('/getprofile', getprofilesRouter);


app.listen(port, () => {
  console.log('서버가 http://localhost:${port}에서 실행 중입니다.');
});