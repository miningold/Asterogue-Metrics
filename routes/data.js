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

  collection = db.collection('player');

  // Empty the collection for debugging
  collection.remove(function(err) {
    if (err) throw err;
  });
});
