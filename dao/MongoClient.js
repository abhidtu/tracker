const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'devinsights';

var db, callback;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to the Mongo server");

    db = client.db(dbName);

    if( typeof callback === 'function' ){
        callback(db);
    }

});

module.exports = function(cb){
    if(typeof db !== 'undefined'){
        cb(db);
    } else {
        callback = cb;
    }
};