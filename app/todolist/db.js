'use strict';

const moment = require('moment');
const Todo = require('./todo');

class TodoRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async findById(id) {
        let query = {
            text: 'SELECT * FROM todos WHERE id = $1',
            values: [id]
        }
        let { rows } = await this.connection.query(query);
        let row = rows[0];
        return new Todo(row.task, row.date, row.text, row.createdat, row.updatedat);
    }

    async findByTask(task) {
        let query = {
            text: 'SELECT * FROM todos WHERE task = $1',
            values: [task]
        }
        let { rows } = await this.connection.query(query);
        return rows.map(row => {
            return new Todo(row.task, row.date, row.text, row.createdat, row.updatedat);
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