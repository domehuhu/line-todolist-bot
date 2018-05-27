'use strict';

module.exports = class Todo {
    constructor(task, date, text, createdAt, updatedAt) {
        this.task = task;
        this.date = date;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}