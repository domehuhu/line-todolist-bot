'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const lineApp = require('./line/app');
const pg = require('./pg');
const Todolist = require('./todolist/handle');
const TodoRepo = require('./todolist/db');
const config = require('./config')(process.env);

let app = express();

let line = require('./line')(config.line);

let pgConnection = pg(config.pg);
let todoRepo = TodoRepo(pgConnection);
let todolistHandler = Todolist(line, todoRepo);

app.use(errorHandler());
app.use(require('morgan')('defaults'));

app.use('/line', lineApp(line, todolistHandler));

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("hello world.");
});

app.listen(config.server.port, () => console.log(`started. listen on ${config.server.port}`));