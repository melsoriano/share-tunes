const { verifySession } = require('../firebase/firebaseApi');

// Attaches a CSRF token to the request
function attachCsrfToken(url, cookie, value) {
  return (req, res, next) => {
    if (req.url == url) {
      res.cookie(cookie, value);
    }
    next();
  };
}

// Checks if a user is already signed in and if so, redirect to home page
function checkIfSignedIn(url) {
  return (req, res, next) => {
    if (req.url == url) {
      let sessionCookie = req.cookies.session || '';
      verifySession(sessionCookie)
        .then(decodedClaims => {
          res.redirect(process.env.CLIENT_URL);
        })
        .catch(error => {
          next();
        });
    } else {
      next();
    }
  };
}

module.exports = {
  attachCsrfToken,
  checkIfSignedIn,
};
