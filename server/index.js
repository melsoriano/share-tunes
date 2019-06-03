require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bp = require('body-parser');
const SpotifyStrategy = require('passport-spotify').Strategy;
const utils = require('./utils/_firebaseUtils');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      process.nextTick(() => {
        return done(null, { profile, accessToken });
      });
    }
  )
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'spotify_session',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/login', (req, res) => {
  res.json({ data: req.user });
});

app.get('/api/home', ensureAuthenticated, (req, res) => {
  res.json({ data: req.user });
});

app.get(
  '/api/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'user-read-private',
      'user-read-recently-played',
      'playlist-modify-public',
      'playlist-read-collaborative',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
    ],
    showDialog: true,
  })
);

app.get(
  '/api/callback',
  passport.authenticate('spotify', {
    failureRedirect: '/api/login',
    failureMessage: 'Login unsuccessful. Please try again',
  }),
  (req, res) => {
    const { id, emails } = req.user.profile;
    const email = emails[0].value;
    const { accessToken } = req.user;

    utils._createFirebaseAccount(id, email, accessToken).then(firebaseToken => {
      utils._signInWithCustomToken(firebaseToken, res);
    });
  }
);

app.get('/api/logout', ensureAuthenticated, (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/login');
}

app.listen(PORT, () => {
  console.log(`Magic happening on ${PORT}`);
});
