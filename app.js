var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),

    express = require('express'),
    app = express(),
    auth = express.basicAuth('asterogue', 'Wreckursion'),
    cons = require('consolidate'),

    routes = require('./routes'),

    Data = require('./routes/data');

app.configure(function(){
  app.set('port', 24685);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', cons.hogan);
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

app.post('/api/:collection', auth, function(req, res, next) {
  var collection = req.params.collection,
      err;

  if (!_.contains(Data.whitelist, collection)) {
    err = new Error('Collection ' + collection + ' not allowed');
    err.status = 409;
    return next(err);
  }

  Data.create(collection, req.body, function(err, result) {
    if (err) {
      throw err;
    }
    res.send(201, result);
  });
});

app.get('/api/:collection', function(req, res, next) {
  var collection = req.params.collection,
      err;

  if (!_.contains(Data.whitelist, collection)) {
    err = new Error('Collection "' + collection + '" not found.');
    err.status = 404;
    return next(err);
  }

  Data.readAll(req.params.collection, function(err, result) {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
