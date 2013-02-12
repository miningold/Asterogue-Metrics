var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),

    express = require('express'),
    app = express(),
    auth = express.basicAuth('asterogue', 'Wreckursion'),
    cons = require('consolidate'),

    routes = require('./routes'),

    Data = require('./routes/data'),
    validateCollection;

validateCollection = function(req, res, next) {
  var whitelist = [
    'level'
  ];
  var collection = req.params.collection;

  if (_.contains(whitelist, collection)) {
    return next();
  } else {
    var err = new Error('Collection not allowed');
    err.status = 409;
    return next(err);
  }
};

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

app.post('/api/:collection', auth, validateCollection, function(req, res) {
  Data.create(req.params.collection, req.body, function(err, result) {
    if (err) {
      throw err;
    }
    res.send(201, result);
  });
});

app.get('/api/:collection', validateCollection, function(req, res) {
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
