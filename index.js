const express = require('express');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set path for static assets
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

app.use(express.json());
app.use('/api', routes);

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

app.get('*', (req, res) => res.render('lost'))
app.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));

module.exports = app;