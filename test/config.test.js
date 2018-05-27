'use strict';

const moment = require('moment');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Config = require('../app/config')
const expect = chai.expect;

describe('config', function () {

    describe('toBool', function () {
        it ('should true when null', function () {
            let config = Config({
                LINE_FAKE_MIDDLEWARE: undefined
            });

            expect(config.line.fakeMiddleware).to.be.true;
        });
        it ('should false when false', function () {
            let config = Config({
                LINE_FAKE_MIDDLEWARE: "false"
            });

            expect(config.line.fakeMiddleware).to.be.false;
        });
        it ('should false when really false', function () {
            let config = Config({
                LINE_FAKE_MIDDLEWARE: false
            });

            expect(config.line.fakeMiddleware).to.be.false;
        });
        it ('should true when true', function () {
            let config = Config({
                LINE_FAKE_MIDDLEWARE: "true"
            });

            expect(config.line.fakeMiddleware).to.be.true;
        });
    });
});