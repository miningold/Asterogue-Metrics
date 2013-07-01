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

  app.use(function(req, res, next) {
    res.send(404, 'Sorry, page not found');
  });
});

app.configure('development', function() {
  app.use(express.errorHandler());
});


app.get('/', routes.index);

app.post('/api/:collection', auth, function(req, res, next) {
  var collection = req.params.collection,
      err;

  if (!_.contains(Data.whitelist, collection)) {
    res.send(403, 'Collection "' + collection + '" not allowed');
  }

  Data.create(collection, req.body, function(err, result) {
    if (err) {
      return next(err);
    }
    res.send(201, result);
  });
});

app.get('/api/:collection', function(req, res, next) {
  var collection = req.params.collection,
      err;

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  if (!_.contains(Data.whitelist, collection)) {
    res.send(404, 'Could not find collection "' + collection + '"');
  }

  Data.readAll(req.params.collection, function(err, result) {
    if (err) {
      return next(err);
    }
    res.send(result);
  });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
