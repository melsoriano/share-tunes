require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const {
  checkIfSignedIn,
  attachCsrfToken,
} = require('./utils/customMiddleware');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bp.json());
app.use(
  bp.urlencoded({
    extended: true,
  })
);
// Support cookie manipulation.
app.use(cookieParser());
// Set csrf token on every request
app.use(
  attachCsrfToken('/', 'csrfToken', crypto.randomBytes(20).toString('hex'))
);
// If a user is signed in, redirect to home page
app.use(checkIfSignedIn('/'));

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Magic happening on ${PORT}`);
});
