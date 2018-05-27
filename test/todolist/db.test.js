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
            let todo = new Todo("task1", moment(), "task1 : date : time", moment(), moment());

            let insertedRows = await todoRepo.insert(todo);
            let id = insertedRows[0].id;
            let todos = await todoRepo.findByTask("task1");

            expect(todos.length).to.be.greaterThan(0);
            expect(todos[0].task).to.be.equal("task1");

            let todoById = await todoRepo.findById(id);

            expect(todoById.task).to.be.equal("task1");
        });
    });
});