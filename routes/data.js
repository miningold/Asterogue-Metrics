var _ = require('lodash'),
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient,
    port = process.env.MONGO_PORT || 27017;
    mongoURL = 'mongodb://asterogue:Wreckursion@localhost:' + port + '/asterogue';

MongoClient.connect(mongoURL, function(err, db) {
  var collection;

  if (err) {
    throw err;
  }

  collection = db.collection('level');

  // Empty the collection for debugging
  collection.remove(function(err) {
    db.close();
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
      db.close();
      if (err) {
        console.dir(err);
      }

      res.send(201, result[0]);
    });
  });
};
