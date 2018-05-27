'use strict';

const express = require('express');

module.exports = function (line, todolist) {

    let app = express();
    app.post('/webhook', line.middleware, (req, res) => {
        Promise
            .all(req.body.events.map(event => {
                return todolist.handleLineWebhook(event);
            }))
            .then(result => {
                console.log(result);
                return res.json(result);
            })
            .catch(err => {
                console.error(err);
                return res.json({  });
            });
    });

    return app;
};