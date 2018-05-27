'use strict';

const moment = require('moment');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const TodoList = require('../../app/todolist/handle')
const expect = chai.expect;

chai.use(sinonChai);

describe('Todolist', function () {
    let todolist;
    let line;
    let repo;
    let userId;

    beforeEach(function () {
        userId = "user1";
        repo = {
            insert: sinon.stub().resolves("OK")
        };
        line = {
            client: {
                replyMessage: sinon.stub().resolves("OK")
            }
        }

        todolist = TodoList(line, repo);
    });

    describe('handle', function () {

        it('should reply error message if not support.', async () => {
            let event = {
                source: { userId: 'user1', type: 'user' },
                type: 'message',
                message: {
                    type: 'text',
                    text: 'hello'
                }
            }

            const resp = await todolist.handleLineWebhook(event);

            expect(line.client.replyMessage).to.have.been.calledOnce;
        })
    });
    describe('processText', function () {

        let addTodoSpy;

        beforeEach(function () {
            addTodoSpy = sinon.spy(todolist, "addTodo");
        });

        it('edit', async () => {
            const result = await todolist.processText(userId, "edit");

            expect(result.type).to.be.equals('text');
            expect(result.text).to.not.be.undefined;
        });

        it('list', async () => {
            repo.findAllByUserIdOrderByDateAsc = sinon.stub().returns(
                [
                    { userId: 'user1', task: 'task1', text: 'text1' },
                    { userId: 'user1', task: 'task2', text: 'text2' }
                ]
            );
            const result = await todolist.processText(userId, "list");

            expect(result).to.be.deep.equal({ type: 'text', text: "text1\ntext2"});
        });

        it('should handle task : date/month/year : time', async () => {
            let text = 'Buy milk : 3/5/18 : 13:00';

            const result = await todolist.processText(userId, text);
            let todo = await addTodoSpy.returnValues[0];
            console.log(todo);

            expect(result).to.deep.equal({ type: 'text', text: `added ${text}`});
            expect(todo.task == 'Buy milk');
            expect(todo.date.format('D/M/YY HH:mm') == '3/5/18 13:00');
            expect(todo.text == text);
        });

        it('should handle task : today : time', async () => {
            let text = 'Finsh writing shopping list : today : 15:30';
            let today = moment('HH:mm', '15:30');

            const result = await todolist.processText(userId, text);
            let todo = await addTodoSpy.returnValues[0];

            expect(result).to.deep.equal({ type: 'text', text: `added ${text}`});
            expect(todo.task == 'Buy milk');
            expect(todo.date.format('D/M/YY HH:mm') == today.format('D/M/YY HH:mm'));
            expect(todo.text == text);
        });
        it('should handle task : tomorrow : time', async () => {
            let text = 'Watch movie : tommorrow : 18:00';
            let tomorrow = moment('HH:mm', '18:00').add(1, 'days');

            const result = await todolist.processText(userId, text);
            let todo = await addTodoSpy.returnValues[0];

            expect(result).to.deep.equal({ type: 'text', text: `added ${text}`});
            expect(todo.task == 'Watch movie');
            expect(todo.date.format('D/M/YY HH:mm') == tomorrow.format('D/M/YY HH:mm'));
            expect(todo.text == text);
        });

        it('should use default time as 12:00 pm', async () => {
            let text = 'Buy milk : 3/5/18';

            const result = await todolist.processText(userId, text);
            let todo = await addTodoSpy.returnValues[0];

            expect(result).to.deep.equal({ type: 'text', text: `added ${text}`});
            expect(todo.task == 'Buy milk');
            expect(todo.date.format('D/M/YY HH:mm') == '3/5/18 12:00');
            expect(todo.text == text);
        });
    });
});

