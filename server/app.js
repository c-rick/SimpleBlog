var express = require('express');
var path = require('path');
var http = require('http'); // 使用nodemone
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var session = require('express-session');
// var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var app = express();


// 环境变量
app.set('port', process.env.PORT || 3000);

// // 设置 Cookie
// app.use(cookieParser());

// session
app.use(session({
  secret: 'blog',
  name: 'userid',
  cookie: { secure: false, maxAge: 80000 },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/test'
  })
}))

// // view engine setup
app.set('views', path.join(__dirname, 'views'));

// // 让Ejs支持 html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// 配置路由
routes(app)// 路由管理从 app.js 迁移

// 404错误修改
app.use(function (req, res, next) {
  var err = new Error('你迷路了，啊');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next){
  // set locals, only providing error in development
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// 错误输出
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe' + port
    : 'Port' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
// 成功监听
function onListening () {
  console.log('Express server listening on port' + app.get('port'));
}
// 开启服务监听
let server = http.createServer(app);
server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);


