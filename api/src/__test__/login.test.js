const app = require('../../app.js');
const supertes = require('supertest');
const User = require('../models/users.js');

describe('Auth Login with username and password', () => {
    it('it should login successfully and return 200', async () => {
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '123' });
        expect(res.status).toBe(200);
    })

    it('it should login fail when missing field username and password and return 400', async () => {
        const res = await supertes(app)
            .post('/api/auth/login')
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Username and password are required' })
    })

    it('it should login fail when username is not found and return 404', async () => {
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: '9999', password: '123' });
        expect(res.status).toBe(404);
        expect(res.body).toEqual('User not found');
    })

    it('it should login fail when wrong password and return 400', async () => {
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '1111' });
        expect(res.status).toBe(400);
        expect(res.body).toEqual('Wrong username or password');
    })

    it('it should login fail when query table User error and return 500', async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error('Error occurred while querying'));
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin999', password: '123' });
        expect(res.status).toBe(500);
        jest.clearAllMocks()
    })
});