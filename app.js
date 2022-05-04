var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var app = express();
// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err);
	process.exit(1);
});
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
  
mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

// 404 錯誤
app.use(function(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: "無此路由資訊",
  });
});

// express 錯誤處理
app.use(function(err,req,res,next){
  res.status(500).json({
      "err": err.message
  })
})
// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});
module.exports = app;
