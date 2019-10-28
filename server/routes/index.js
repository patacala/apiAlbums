const express = require('express');

const app = express();

// declare routes
app.use(require('./upload'));
app.use(require('./photo'));
app.use(require('./album'));

module.exports = app;