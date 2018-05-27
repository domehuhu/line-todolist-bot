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
    let todo;
    let userId;

    beforeEach( async () => {
        connection = pg({
            url: 'postgres://postgres@localhost/phongsiris',
            ssl: false
        });
        todoRepo = TodoRepo(connection);
        userId = "user1";
        todo = new Todo(userId, "task1", moment(), "task1 : date : time", moment(), moment());

        await connection.query('BEGIN');

    });

    afterEach(async () => {
        await connection.query('ROLLBACK');
        await connection.end();
    });

    describe('insert', function () {
        it ('should insert', async () => {

            let id = await todoRepo.insert(todo);
            let todos = await todoRepo.findByTaskAndUserId("task1", userId);

            expect(todos.length).to.be.greaterThan(0);
            expect(todos[0].task).to.be.equal("task1");

            let todoById = await todoRepo.findByIdAndUserId(id, userId);

            expect(todoById.task).to.be.equal("task1");
        });
    });
    describe('findAllByUserId', function () {
        it ('should return only for userId', async () => {
            let todos = [
                new Todo(userId, "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo(userId, "task2", moment().subtract(1, 'days'), "task2 : date : time", moment(), moment()),
                new Todo("user2", "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo("user3", "task1", moment(), "task1 : date : time", moment(), moment()),
                new Todo("user4", "task1", moment(), "task1 : date : time", moment(), moment()),
            ];

            await Promise.all(todos.map(todo => todoRepo.insert(todo)))
            let userTodos = await todoRepo.findAllByUserIdOrderByDateAsc(userId);

            expect(userTodos).to.have.length(2);
            expect(userTodos[0].task).to.be.equal('task2');
        });
    });

    describe('setFlags', function () {
        it ('should flag star properly', async () => {
            let id = await todoRepo.insert(todo);

            let userTodo = await todoRepo.findByIdAndUserId(id, userId);
            expect(userTodo.staredAt).to.be.null;

            todoRepo.setFlag(userId, id, "staredAt", moment());
            userTodo = await todoRepo.findByIdAndUserId(id, userId);
            expect(userTodo.staredAt).to.not.be.null;

            todoRepo.setFlag(userId, id, "staredAt", null);
            userTodo = await todoRepo.findByIdAndUserId(id, userId);
            expect(userTodo.staredAt).to.be.null;
        });
    });

});