var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session= require('express-session');

var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var mysql = require('mysql');
var app = express();
var config = require('./config')


//db세팅
// DATABASE SETTING
//var connection = mysql.createConnection(config);
//connection.connect()


//Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var facebookRouter = require('./routes/auth/facebook');
var welcome=require('./routes/welcome')
var phone_Auth_Router=require('./routes/auth/phone_Auth')
var image_process=require('./routes/img/img_process');

//세션 사용 설정
app.use(session({
  secret: 'keyboard cat',
  resave : false,
  saveUninitialized:true,
  store:new MySQLStore(config),
	timeout:12000//1000ms =1s
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//패스포트 세팅.
app.use(passport.initialize());
app.use(passport.session());




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth/facebook',facebookRouter);
app.use('/welcome',welcome);
app.use('/image_process',image_process);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
