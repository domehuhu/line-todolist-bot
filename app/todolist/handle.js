'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const moment = require('moment');
const _ = require('lodash');

const Todo = require('./todo');

class Todolist {
    constructor(line, todoRepo) {
        this.lineClient = line.client;
        this.todoRepo = todoRepo;
    }

    async addTodo(userId, text) {
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

        let todo = new Todo(userId, task, date, text);

        await this.todoRepo.insert(todo);

        return todo;
    }

    editLink(userId) {
        return {
            type: "text",
            text: "editLink."
        };
    }

    async listTodo(userId) {
        let todos = await this.todoRepo.findAllByUserIdOrderByDateAsc(userId);
        return {
            type: 'text',
            text: todos.map(todo => todo.text).join('\n')
        };
    }

    async processText(userId, text) {
        switch (text) {
            case "edit":
                return this.editLink(userId);
            case "list":
                return this.listTodo(userId);
            default:
                let todo = await this.addTodo(userId, text);
                return {
                    type: 'text',
                    text: `added ${text}`
                };
        }
    }

    async handleLineWebhook(event) {
        console.log(event);
        if (!event.source || event.source.type !== 'user' || !event.source.userId) {
            throw new Error('unkonwn event source type.');
        }
        if (event.type !== 'message' || event.message.type !== 'text') {
            throw new Error('unkonwn event message type.');
        }
        let result;
        try {
            result = await this.processText(event.source.userId, event.message.text.trim());
        }
        catch (err) {
            console.error(err);
            result = {
                type: 'text',
                text: "error found. " + err.message
            }
        }
        finally {
            if (result) {
                return this.lineClient.replyMessage(event.replyToken, _.pick(result, ['type', 'text']));
            }
            return null;
        }
    }
}

module.exports = function (lineClient, pgClient) {
    return new Todolist(lineClient, pgClient);
};