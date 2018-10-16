const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const tracker = require('./dao/dataTracker.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = 8080;

const timeline = require('./controllers/timeline.js')(app);
const datafeed = require('./controllers/dataFeed.js')(app);


app.use(express.static('view'));


app.listen(port, () => console.log(`Server started on port ${port}`));