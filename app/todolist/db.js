'use strict';

const moment = require('moment');
const Todo = require('./todo');

class TodoRepo {
    constructor(connection) {
        this.connection = connection;
    }

    mapRow(row) {
        return new Todo(row.task, row.date, row.text, row.createdat, row.updatedat)
    }

    async findAllByMid() {
        let query = {
            text: 'SELECT * FROM todos WHERE mid = $1',
            values: [id]
        }
        let { rows } = await this.connection.query(query);
        return this.mapRow(rows[0]);
    }

    async findById(id) {
        let query = {
            text: 'SELECT * FROM todos WHERE id = $1',
            values: [id]
        }
        let { rows } = await this.connection.query(query);
        return this.mapRow(rows[0]);
    }

    async findByTask(task) {
        let query = {
            text: 'SELECT * FROM todos WHERE task = $1',
            values: [task]
        }
        let { rows } = await this.connection.query(query);
        return rows.map(row => {
            return this.mapRow(row);
        });
    }

    async insert(todo) {
        let query = {
            text: 'INSERT INTO todos(task, date, text, createdat, updatedat) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [todo.task, todo.date, todo.text, moment(), moment()]
        }
        let { rows } = await this.connection.query(query);
        return rows;
    }
}

module.exports = function (conn) {
    return new TodoRepo(conn);
}