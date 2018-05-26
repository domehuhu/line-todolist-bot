'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const line = require('@line/bot-sdk');

const config = {
    server: {
        port: process.env.PORT || 5000
    },
    line: {
        channelAccessToken: process.env.LINE_BOT_CHANNEL_TOKEN,
        channelSecret: process.env.LINE_BOT_CHANNEL_SECRET
    }
}

let app = express();

const client = new line.Client(config.line);
function handleEvent(event) {
    console.log(event);
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

let lineApp = express();
lineApp.post('/webhook', line.middleware(config.line), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

app.use('/line', lineApp);

app.use(errorHandler());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("hello world.");
});

app.listen(config.server.port, () => console.log(`started. listen on ${config.server.port}`));