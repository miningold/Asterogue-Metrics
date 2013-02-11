var _ = require('lodash'),
    MongoClient = require('mongodb').MongoClient,
    port = process.env.MONGO_PORT || 27017,
    mongoURL = 'mongodb://asterogue:Wreckursion@localhost:' + port + '/asterogue',
    connect,
    Level;

Level = exports.Level = {};

connect = function(callback) {
  MongoClient.connect(mongoURL, function(err, db) {
    if (err) {
      throw err;
    }

    callback(db);
  });
};

connect(function(db) {
  var collection = db.collection('level');

  collection.remove(function(err) {
    db.close();

    if (err) {
      throw err;
    }
  });
});


Level.create = function(body, next) {
  connect(function(db) {
    var collection = db.collection('level');

    collection.insert(body, {w:1}, function(err, result) {
      db.close();

      next(err, result);
    });
  });
};

Level.readAll = function(next) {
  connect(function(db) {
    var collection = db.collection('level');

    collection.find().toArray(function(err, result) {
      db.close();

      next(err, result);
    });
  });
};
