require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bp.json());
app.use(
	bp.urlencoded({
		extended: true,
	})
);

app.use('/auth', authRoutes);

app.listen(PORT, () => {
	console.log(`Magic happening on ${PORT}`);
});
