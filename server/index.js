const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bp = require("body-parser");
const SpotifyStrategy = require("passport-spotify").Strategy;
const PORT = process.env.PORT || 8080;
const app = express();
require("dotenv").config();

app.use(bp.json({ extended: true }));
app.use(
  bp.urlencoded({
    extended: true
  })
);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to serialize users into and deserialize users out of the session. Typically, this will be as simple as storing the user ID when serializing, and finding the user by ID when deserializing. However, since this example does not have a database of user records, the complete spotify profile is serialized and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a function which accept credentials (in this case, an accessToken, refreshToken, expires_in and spotify profile) and invoke a callback with a user object.
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/callback"
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      // asynchronous verification, for effect...
      process.nextTick(() => {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in the database,
        // and return that user instead.

        // TODO: Add database to store user information
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "spotify_session"
  })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get("/api", (req, res) => {
  console.log("req.user: ", req.user);
  res.json({
    user: req.user
  });
});

app.get("/api/account", ensureAuthenticated, (req, res) => {
  // res.json({ hello: "poppit" });
  res.json({ user: req.user });
});

app.get("/api/login", (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify
app.get(
  "/api/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true
  })
);

// GET /api/callback
//   Use passport.authenticate() as route middleware to authenticate the request. If authentication fails, the user will be redirected back to the login page. Otherwise, the primary route function function will be called, which, in this example, will redirect the user to the home page.
app.get(
  "/api/callback",
  passport.authenticate("spotify", { failureRedirect: "/api/login" }),
  (req, res) => {
    // res.redirect("/api");
    // needed to hardcode front end url...need to put in .env?
    res.redirect("http://localhost:3000/home");
  }
);

app.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/api");
});

// Route middleware to ensure user is authenticated. Use this route middleware on any resource that needs to be protected. If the request is authenticated (typically via a persistent login session), the request will proceed. Otherwise, the user will be redirected to the login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/login");
}

app.listen(PORT, () => {
  console.log(`Magic happening on ${PORT}`);
});
