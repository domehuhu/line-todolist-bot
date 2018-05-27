'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const moment = require('moment');

const Todo = require('./todo');

class Todolist {
    constructor(line, todoRepo) {
        this.lineClient = line.client;
        this.todoRepo = todoRepo;
    }

    async addTodo(text) {
        let token = text.split(' : ').map(s => s.trim());
        if (token.length < 2 || token.length > 3) {
            throw new Error(`command not found. text=${text}, token=${token}`);
        }
        let task = token[0];
        let dateStr = token[1];
        let timeStr = token.length === 3 ? token[2] : '12:00';

        if (dateStr === 'today') {
            dateStr = moment().format("DD/MM/YY");
        }
        else if (dateStr === 'tomorrow') {
            dateStr = moment().add(1, 'days').format("DD/MM/YY");
        }
        let date = moment(`${dateStr} ${timeStr}`, "DD/MM/YY HH:mm").utc();

        let todo = new Todo(task, date, text);

        await this.todoRepo.insert(todo);

        return todo;
    }

    editLink() {
        return "editLink";
    }

    async processText(text) {
        if (text === 'edit') {
            return this.editLink();
        }

        let todo = await this.addTodo(text);
        return `added ${text}`;
    }

    async handleLineWebhook(event) {
        console.log(event);
        if (event.type !== 'message' || event.message.type !== 'text') {
            throw new Error('unkonwn message type: ' + event.type);
        }
        let respText;
        try {
            respText = await this.processText(event.message.text.trim());
        }
        catch (err) {
            console.error(err);
            respText = "error found. " + err.message;
        }
        finally {
            if (respText) {
                return this.lineClient.replyMessage(event.replyToken, {
                    type: 'text',
                    text: respText
                });
            }
            return null;
        }
    }
}

module.exports = function (lineClient, pgClient) {
    return new Todolist(lineClient, pgClient);
};