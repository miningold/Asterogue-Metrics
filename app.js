
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),

    routes = require('./routes'),
    user = require('./routes/user'),
    Level = require('./routes/data').Level;

var app = express();

app.configure(function(){
  app.set('port', 24685);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.post('/level', function(req, res) {
  Level.create(req.body, function(err, result) {
    if (err) {
      throw err;
    }
    res.send(201, result);
  });
});

app.get('/level', function(req, res) {
  Level.readAll(function(err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
