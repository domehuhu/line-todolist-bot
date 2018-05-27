'use strict';

module.exports = class Todo {
    constructor(userId, task, date, text, createdAt, updatedAt, completedAt, staredAt) {
        this.userId = userId;
        this.task = task;
        this.date = date;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completedAt = completedAt;
        this.staredAt = staredAt;
    }
}