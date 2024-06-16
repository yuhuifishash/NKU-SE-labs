var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS'){
    res.sendStatus(200);
  }else{
    next();
  }
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loginRouter = require('./routes/user/login');
var registerRouter = require('./routes/user/register');
var aquadata_get = require('./routes/user/aquadata_get');
var fishdata_get = require('./routes/user/fishdata_get');
var fishcountdata_get = require('./routes/user/fishcountdata_get');

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/aquadata_get', aquadata_get);
app.use('/fishdata_get',fishdata_get);
app.use('/fishcountdata_get',fishcountdata_get);

var notice_receiver = require('./routes/user/notice_receiver');
app.use('/notice_receiver',notice_receiver);

var notice_sender = require('./routes/user/notice_sender');
app.use('/notice_sender',notice_sender);

var notice_history = require('./routes/user/notice_history');
app.use('/notice_history',notice_history); 

const tokenhandler = require("./utils/token");
app.use('/', tokenhandler.verify);
app.use('/home/*', tokenhandler.verify);
app.use('/token',tokenhandler.parse);

var admin = require('./routes/admin/admin');
app.use('/admin',admin);


var dataAdmin = require('./routes/admin/data');
app.use('/data',dataAdmin);

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
