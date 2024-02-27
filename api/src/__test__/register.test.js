const app = require('../../app.js');
const supertes = require('supertest');
const User = require('../models/users.js');

describe('Auth Register new user', () => {
    it('it should register new user successfully and return 200', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin999', password: '123', name: '123' });
        expect(res.status).toBe(200);
        await User.destroy({
            where: {
                username: 'admin999'
            }
        })
    })

    it('it should register new user fail when not have field username and return 400', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ password: '123', name: '123' });
        expect(res.status).toBe(400);
    })

    it('it should register new user fail when username exist and return 409', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: '123', name: '123' });
        expect(res.status).toBe(409);
    })

    it('it should login fail when query table User error', async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error('Error occurred while querying'));
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: '123', name: '123' });
        expect(res.status).toBe(500);
    })
});