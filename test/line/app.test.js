'use strict';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const lineApp = require('../../app/line/app');

const app = express();

const line = {
    client: {},
    middleware: function (req, res, next) { next(); }
}
const todolist = {
    handleLineWebhook: sinon.stub().returns(Promise.resolve("OK"))
}

app.use(bodyParser.json({ extended: true}));
app.use(require('morgan')('defaults'));
app.use('/line', lineApp(line, todolist));

describe('POST /line/webhook', function () {
    this.timeout(10000);
    it('respond with json', function (done) {

        let event = {
            type: 'message',
            message: {
                type: 'text',
                text: 'hello'
            }
        }

        request(app)
            .post('/line/webhook')
            .send({ events: [event] })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});