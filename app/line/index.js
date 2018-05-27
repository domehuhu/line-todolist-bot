'use strict';

const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');

module.exports = function(config) {

    return {
        client: new line.Client(config),
        // middleware: config.fakeMiddleware ? bodyParser.json({ extended: true }) : line.middleware(config)
        middleware: line.middleware(config)
    }
}