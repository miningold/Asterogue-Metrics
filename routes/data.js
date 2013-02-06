var _ = require('lodash'),
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient,
    mongoURL = 'mongodb://localhost:27017/asterogue';

MongoClient.connect(mongoURL, function(err, db) {
  var collection;

  if (err) {
    console.dir(err);
    return;
  }

  collection = db.collection('level');

  // Empty the collection for debugging
  collection.remove(function(err) {
    if (err) throw err;
  });
});

exports.createRoom = function(req, res, next) {
  MongoClient.connect(mongoURL, function(err, db) {
    var doc;

    if (err) {
      console.dir(err);
      return next(err);
    }

    doc = req.body;

    collection = db.collection('level');

    // console.dir(doc);

    collection.insert(doc, {w:1}, function(err, result) {
      if (err) {
        console.dir(err);
      }

      res.send(201, result[0]);
    });
  });
};
