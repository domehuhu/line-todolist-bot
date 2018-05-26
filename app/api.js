'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

let app = express();

app.use(errorHandler());
app.use(bodyParser.json());

const config = {
    line: {
        channelToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        channelSecret: process.env.LINE_BOT_CHANNEL_SECRET    
    }
}

let lineApp = express();

lineApp.all('/webhook', (req, res) => {
    return res.send("hello world. webook.");
});

app.use('/line', lineApp);

app.get('/', (req, res) => {
    res.send("hello world.");
});

app.listen(3000, () => console.log('started.'));