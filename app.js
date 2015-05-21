var app = require('express')(),swig = require('swig'),people;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* My Library */
var fun = require('./funclib');
var routes = require('./routes');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

app.get('/', routes.route);
app.get('/post', routes.post);
app.get('/list', routes.list);

// Handle 404
app.use(function(req, res) {
	res.send('404: Page not Found', 404);
});

// Handle 500
app.use(function(error, req, res, next) {
	res.send('500: Internal Server Error', 500);
});

app.listen(3000);
console.log('Application Started');