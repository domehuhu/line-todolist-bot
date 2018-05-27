'use strict';

const moment = require('moment');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Todo = require('../../app/todolist/todo');
const pg = require('../../app/pg');
const TodoRepo = require('../../app/todolist/db');
const expect = chai.expect;

describe('TodoRepo', function () {

    let connection;
    let todoRepo;

    beforeEach( async () => {
        connection = pg({
            url: 'postgres://postgres@localhost/phongsiris',
            ssl: false
        });
        todoRepo = TodoRepo(connection);
        await connection.query('BEGIN');
    });

    afterEach(async () => {
        await connection.query('ROLLBACK');
        await connection.end();
    });

    describe('insert', function () {
        it ('should insert', async () => {
            let todo = new Todo("user1", "task1", moment(), "task1 : date : time", moment(), moment());

            let insertedRows = await todoRepo.insert(todo);
            let id = insertedRows[0].id;
            let todos = await todoRepo.findByTaskAndUserId("task1", "user1");

            expect(todos.length).to.be.greaterThan(0);
            expect(todos[0].task).to.be.equal("task1");

            let todoById = await todoRepo.findByIdAndUserId(id, "user1");

            expect(todoById.task).to.be.equal("task1");
        });
    });
    describe('findAllByUserId', function () {
        it ('should return only for userId', async () => {
            let todos = [
                new Todo("user1", "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo("user1", "task2", moment().subtract(1, 'days'), "task2 : date : time", moment(), moment()),
                new Todo("user2", "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo("user3", "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo("user4", "task1", moment(), "task1 : date : time", moment(), moment()),
            ];

            await Promise.all(todos.map(todo => todoRepo.insert(todo)))
            let userTodos = await todoRepo.findAllByUserIdOrderByDateAsc("user1");

            expect(userTodos).to.have.length(2);
            expect(userTodos[0].task).to.be.equal('task2');
        });
    });
});