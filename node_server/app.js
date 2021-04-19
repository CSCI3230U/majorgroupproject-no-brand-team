const express = require('express');
const router = require('express').Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
var cors = require('cors')

// options = {
//   origin: true,
//   credentials: true,
//   allowedHeaders: ['Authorization', 'Content-Type'],
//   preflightContinue: true
// }

app.use(cors())
app.options('*', cors())


require('./config/passport');

const v1 = require('./routes/v1');
const v1NoAuth = require('./routes/v1_no_auth');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize());

app.use('/v1', v1NoAuth);

app.all('*', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (info && info.message && info.message === 'jwt expired') {
      err = { message: 'expired' };
    }
    if (err || !user) {
      const error = !err ? {} : err;
      return res.status(error.status ? error.status : 401).json({
        code: error.status ? error.status : 401,
        message: !error.message ? 'unauthorized' : error.message,
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
});

app.use('/v1', v1);

module.exports = app;