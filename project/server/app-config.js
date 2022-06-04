let http = require('http'),
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  mongoose = require('mongoose'),
  secret = require('./config').secret,
  createLocaleMiddleware = require('express-locale'),
  startPolyglot = require('./utilities/startPolyglot'),
  httpResponse = require('express-http-response');
let isProduction = process.env.NODE_ENV === 'production';
module.exports = (app) => {



  var allowedOrigins = [
    "http://localhost:4200",
    "http://localhost:4300",
    "http://localhost:3000",
    "http://ec2-3-137-141-174.us-east-2.compute.amazonaws.com",
    "http://ec2-3-140-248-210.us-east-2.compute.amazonaws.com",
    "http://ec2-3-14-80-25.us-east-2.compute.amazonaws.com",
    "https://52.194.58.233/",



  ];
  app.use(
    cors({
      credentials: false,
      origin: "*",
    })
  );


  // Normal express config defaults
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
  app.use(bodyParser.json({ limit: '500mb' }));
  // Get the user's locale, and set a default in case there's none
  app.use(createLocaleMiddleware({
    "priority": ["accept-language", "default"],
    "default": "en_US", // ko_KR
  }))

  // Start polyglot and set the language in the req with the phrases to be used
  app.use(startPolyglot)

  app.use(require('method-override')());
  app.use(express.static(path.join(__dirname, '/public')));

  app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

  if (!isProduction) {
    app.use(errorhandler());
  }

  if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });

  } else {
    mongoose.connect('mongodb://localhost/lolSilver?retryWrites=false', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    mongoose.set('debug', true);
  }



  require('./models/User');
  require('./models/Chat');
  require('./models/Notification');
  require('./models/SiteSettings');
  require('./models/SystemAsset');
  require('./models/SystemTransaction');
  require('./models/P2PTrade');
  require('./models/Match');
  require('./models/Tournament');
  require('./models/SoloMatchRequest');
  require('./models/5V5MatchRequest');
  require('./models/Voucher');
  require('./models/Level');
  require('./models/UserLogs');
  require('./models/Game');
  require('./models/LOLChallenge');
  require('./models/LaplataSetting');
  require('./models/Withdraws');
  require('./models/MiningSeries');
  require('./utilities/passport');
  require('./models/Announcement');

  app.use(require('./routes'));


  if (isProduction) {
    app.use("/", express.static(path.join(__dirname, "dist")));
    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  //  catch 404 and forward to error handler
  app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use(httpResponse.Middleware);

  /// error handlers

  // development error handler
  // will print stacktrace
  if (!isProduction) {
    app.use(function (err, req, res, next) {
      console.log(err.stack);

      res.status(err.status || 500);

      res.json({
        'errors': {
          message: err.message,
          error: err
        }
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: {}
      }
    });
  });

}
