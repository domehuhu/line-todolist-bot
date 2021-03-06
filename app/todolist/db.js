'use strict';

const moment = require('moment');
const Todo = require('./todo');

class TodoRepo {
    constructor(connection) {
        this.connection = connection;
    }

    mapRow(row) {
        if (!row.userId || !row.task) {
            throw new Error("row is invalid.");
        }
        return new Todo(row.userId, row.task, row.date, row.text,
            row.createdat, row.updatedat, row.completedAt, row.staredAt);
    }

    async setFlag(userId, todoId, fieldName, value) {
        if (!userId) {
            throw new Error('userId cannot be null.');
        }
        if (!todoId) {
            throw new Error('todoId cannot be null.');
        }
        if (!fieldName) {
            throw new Error('fieldName cannot be null.');
        }
        let query = {
            text: `UPDATE todos SET "${fieldName}" = $1 WHERE "userId" = $2 AND "id" = $3`,
            values: [value, userId, todoId]
        }
        let { rows } = await this.connection.query(query);
        return rows;
    }

    async findAllIncompletedByUserIdOrderByDateAsc(userId) {
        if (!userId) {
            throw new Error('userId cannot be null.');
        }
        let query = {
            text: 'SELECT * FROM todos WHERE "userId" = $1 AND "completed" = $1 ORDER BY "stared" DESC, "date" ASC',
            values: [userId]
        }
        let { rows } = await this.connection.query(query);
        return rows.map(row => this.mapRow(row));
    }

    async findAllByUserIdOrderByDateAsc(userId) {
        if (!userId) {
            throw new Error('userId cannot be null.');
        }
        let query = {
            text: 'SELECT * FROM todos WHERE "userId" = $1 ORDER BY "date" ASC',
            values: [userId]
        }
        let { rows } = await this.connection.query(query);
        return rows.map(row => this.mapRow(row));
    }

    async findByIdAndUserId(id, userId) {
        if (!userId) {
            throw new Error('userId cannot be null.');
        }
        let query = {
            text: 'SELECT * FROM todos WHERE id = $1 and "userId" = $2',
            values: [id, userId]
        }
        let { rows } = await this.connection.query(query);
        return this.mapRow(rows[0]);
    }

    async findByTaskAndUserId(task, userId) {
        if (!userId) {
            throw new Error('userId cannot be null.');
        }
        let query = {
            text: 'SELECT * FROM todos WHERE task = $1 AND "userId" = $2',
            values: [task, userId]
        }
        let { rows } = await this.connection.query(query);
        return rows.map(row => {
            return this.mapRow(row);
        });
    }

    async insert(todo) {
        if (!todo.userId) {
            throw new Error('userId cannot be null.');
        }
        if (!todo.task) {
            throw new Error('task cannot be null.');
        }
        let query = {
            text: 'INSERT INTO todos("userId", task, date, text, createdat, updatedat) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [todo.userId, todo.task, todo.date, todo.text, moment(), moment()]
        }
        let { rows } = await this.connection.query(query);
        return rows[0].id;
    }
}

module.exports = function (conn) {
    return new TodoRepo(conn);
}