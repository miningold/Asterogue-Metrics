var _ = require('lodash'),
    MongoClient = require('mongodb').MongoClient,
    port = process.env.MONGO_PORT || 27017,
    mongoURL = 'mongodb://asterogue:Wreckursion@localhost:' + port + '/asterogue',
    connect;

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

exports.create = function(collectionName, body, next) {
  connect(function(db) {
    var collection = db.collection(collectionName);

    collection.insert(body, {w:1}, function(err, result) {
      db.close();

      next(err, result);
    });
  });
};

exports.readAll = function(collectionName, next) {
  connect(function(db) {
    var collection = db.collection(collectionName);

    collection.find().toArray(function(err, result) {
      db.close();

      next(err, result);
    });
  });
};
