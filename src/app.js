var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer=require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//设置跨域访问
// app.all('*', function(req, res, next) {
//      res.header("Access-Control-Allow-Origin", "*");
//      res.header("Access-Control-Allow-Headers", "X-Requested-With");
//      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//      res.header("X-Powered-By",' 3.2.1');
//      res.header("Content-Type", "application/json;charset=utf-8");
//      res.header("Content-Type", "multipart/form-data");
//      res.header("Content-Type", "application/x-www-form-urlencoded");
//   if (req.method == 'OPTIONS') {
//     res.send(200); //让options请求快速返回
//   }
//   else {
//     next();
//   }
//   });
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "multipart/form-data");
  res.header("Content-Type", "application/x-www-form-urlencoded");
  res.header("X-Powered-By", ' 3.2.1')
      //这段仅仅为了方便返回json而已
  res.header("Content-Type", "application/json;charset=utf-8");
  if(req.method == 'OPTIONS') {
      //让options请求快速返回
      res.sendStatus(200); 
  } else { 
      next(); 
  }
});
   
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
  
// parse application/json
app.use(bodyParser.json())
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(multer({dest:'src/public/images/ue/'}).array('image'));
// app.use('/static',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
