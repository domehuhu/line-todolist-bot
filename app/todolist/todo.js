'use strict';

module.exports = class Todo {
    constructor(task, date, text) {
        this.task = task;
        this.date = date;
        this.text = text;
    }
}