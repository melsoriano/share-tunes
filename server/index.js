require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const bp = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const utils = require('./utils/_firebaseUtils');
const { CORS_WHITELIST, SPOTIFY_OAUTH_SCOPES } = require('./config');

const PORT = process.env.PORT || 8080;
const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);

app.use(
  cookieSession({
    name: 'fbase_session',
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    signed: true,
    maxAge: 7776000, // 90 days
  })
);

const Spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.get('/redirect', (req, res) => {
  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');

    res.cookie('state', state.toString(), {
      maxAge: 7776000,
      httpOnly: true,
    });

    const authorizeURL = Spotify.createAuthorizeURL(
      SPOTIFY_OAUTH_SCOPES,
      state
    );
    res.redirect(authorizeURL);
  });
});

app.get('/token', (req, res) => {
  try {
    cookieParser()(req, res, () => {
      if (!req.cookies.state) {
        res
          .status(400)
          .send(
            'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
          );
      } else if (req.cookies.state !== req.query.state) {
        res.status(400).send('State validation failed');
      }
      Spotify.authorizationCodeGrant(req.query.code, (error, data) => {
        if (error) {
          return error;
        }
        Spotify.setAccessToken(data.body.access_token);

        Spotify.getMe(async (error, userResults) => {
          if (error) {
            return error;
          }
          const accessToken = data.body.access_token;
          const spotifyUserID = userResults.body.id;
          const uid = `spotify:${spotifyUserID}`;
          const email = userResults.body.email;

          const firebaseToken = await utils._createFirebaseAccount(
            spotifyUserID,
            email,
            accessToken
          );

          req.session.cookie = { firebaseToken, accessToken, uid, email };
          // res.setHeader('X-Auth-Token', firebaseToken);
          res.redirect('/login');
        });
      });
    });
  } catch (error) {
    return res.json({ error: error.toString });
  }
  return null;
});

app.get('/login', (req, res) => {
  // console.log(req.sessionCookies);
  // res.setHeader('Authorization: Bearer', req.header);
  if (!req.session.cookie) {
    res.json({ errorMessage: 'unable to login, please try again' });
  } else {
    res.json({ data: req.session.cookie });
  }
});

app.listen(PORT, () => {
  console.log(`Magic happening on ${PORT}`);
});
