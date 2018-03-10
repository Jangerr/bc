
// NPM Modules
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression'),
    helmet = require('helmet');

// Custom Modules
var mongodb = require('./modules/mongodb');
var load_news = require('./modules/autoload');

// Routes
var index = require('./routes/index');
var news = require('./routes/news');
var add = require('./routes/add');
var debug = require('./routes/debug');
var admin = require('./routes/admin');
var login = require('./routes/login');
var logout = require('./routes/logout');
var user = require('./routes/user');

// Begin App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Start Session
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Compress Routes
app.use(compression()); //Compress all routes

// Web security
app.use(helmet());

// Set Routes
app.use('/', index);
app.use('/news', news);
app.use('/add', add);
app.use('/debug', debug);
app.use('/admin', admin);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
