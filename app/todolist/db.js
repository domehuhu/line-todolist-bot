'use strict';

class TodoRepo {
    constructor(connection) {
        this.connection = connection;
    }

    async insert(todo) {
        let query = {
            text: 'INSERT INTO todos(task, date, text, createdAt, updatedAt) ($1, $2, $3, $4, $5)',
            values: [todo.task, todo.date, todo.text, moment(), moment()]
        }
        let res = await this.connection.query(query);
        return res;
    }
}

module.exports = function (conn) {
    return new TodoRepo(conn);
}