var session = require('express-session');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');
var helmet = require('helmet');

var config = require('./config');
var staticPath = path.join(__dirname, !config.isDevelopment ? 'dist' : 'src');
var app = express();

if (config.isDevelopment) {
    require('./dev')();
}

app.use(morgan('common'));

app.use(helmet());

app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(session({ resave: false, saveUninitialized: false, secret: 'keyboardCat' }));

app.use(express.static(path.join(staticPath)));

app.get('*', function (req, res) {
    res.sendFile('/index.html', {
        root: staticPath
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
