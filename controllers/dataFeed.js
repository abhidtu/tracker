var metricsMap = {};
var servicesMap = {};

const db = require('../dao/MongoClient.js');

var timestampConverter = function (dateTime) {
    var datum = Date.parse(dateTime);
    return datum/1000;
};

module.exports = function(app){

    app.post('/devtracker/dataFeed', function(req, res){

        var requestData = req.body;

        db(function (databaseConnection) {

            const findDocuments = function(databaseConnection, callback) {

                const collection = databaseConnection.collection('metrics');

                collection.find().toArray(function(err, docs) {
                    callback(docs);
                });
            };

            const updateDocument = function(databaseConnection,id, newData, callback) {

                const collection = databaseConnection.collection('metrics');

                collection.updateOne({ _id : id }
                    , { $set: { end : newData } }, function(err, result) {
                        console.log("Updated the document with the field a equal to 2");
                        callback(result);
                    });

            };

            const insertDocuments = function(databaseConnection,document, callback) {

                const collection = databaseConnection.collection('metrics');

                collection.insertOne(document, function(err, result) {
                    console.log("Inserted 1 document in collection metrics");
                    callback(result);
                });
            };

            findDocuments(databaseConnection, function (docs) {

                for(var i=0; i < docs.length; i++) {

                    var doc = docs[i];
                    var ticketId = doc.content;

                    metricsMap[ticketId] = doc;
                    servicesMap[doc.projectName] = 1;

                }

                console.log(metricsMap);

                var ticketIdFromRequest = requestData.ticketId;
                var projectNameFromRequest = requestData.projectName;
                var newTime = requestData.timeStamp;

                var newTimeStamp = timestampConverter(newTime);

                var ticketDocFromMap = metricsMap[ticketIdFromRequest];

                console.log(ticketDocFromMap);

                if(ticketDocFromMap !== undefined) {

                    var oldEndTime = ticketDocFromMap['end'];

                    var oldEndTimestamp = timestampConverter(oldEndTime);

                    console.log(oldEndTimestamp);
                    console.log(newTimeStamp);

                    if((newTimeStamp - oldEndTimestamp) < 600 && (newTimeStamp - oldEndTimestamp) > 0) {
                        console.log("passed");
                        //update endTime with new time

                        updateDocument(databaseConnection, ticketDocFromMap['_id'], newTime, function (result) {
                            //console.log(result);
                        })

                    } else if((newTimeStamp - oldEndTimestamp) > 600) {
                        //create a new document for the same ticketId
                        var newDoc = {
                            projectName: projectNameFromRequest,
                            content:ticketIdFromRequest,
                            start:newTime,
                            end:newTime
                        };
                        insertDocuments(databaseConnection, newDoc, function (insertResult) {
                            //console.log(insertResult);
                        });

                    }

                }else {

                    //create a new document for this ticket from scratch with same start and end time
                    var newDocForNewTicketId = {
                        projectName: projectNameFromRequest,
                        content:ticketIdFromRequest,
                        start:newTime,
                        end:newTime
                    };
                    insertDocuments(databaseConnection, newDocForNewTicketId, function (insertResult) {
                        //console.log(insertResult);
                    })
                }

                res.json(docs);
            });

        });

        //console.log(req.body);

        var data = req.body;

        var ticketId = data['ticketId'];
        var timestamp = data['timestamp'];



        //res.send("hello");
    });
    
};