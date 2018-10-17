const db = require('../dao/MongoClient.js');
String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
module.exports = function(app){

    app.get('/devtracker/timeline', function(req, res){

        db(function (databaseConnection) {

            const findDocuments = function (databaseConnection, callback) {

                const collection = databaseConnection.collection('metrics');

                collection.find({}).project({ _id: 0 }).toArray(function (err, docs) {
                    callback(docs);
                });
            };

            findDocuments(databaseConnection, function (docs) {

                for(var i=0; i < docs.length; i++) {
                    docs[i]['id'] = i+1;
                    docs[i]['group'] = Math.abs(docs[i].content.hashCode());
                }

                res.json(docs);
            });

        });

    });

};
