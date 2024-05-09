const app = require('../../app.js');
const supertes = require('supertest');
const User = require('../models/users.js');

describe('Auth Authtenticate with accesstoken', () => {
    it('it should authenticate token valid and return 200', async () => {
        const response = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '123' });
        expect(response.headers['set-cookie']).toBeDefined();

        // Parse the cookies from the response headers
        const cookies = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]);

        // Find the access_token cookie
        const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));

        const res = await supertes(app)
            .post('/api/auth/authenticateToken')
            .set("Cookie", [accessTokenCookie])
        expect(res.body).toStrictEqual({})
    })

    it('it should authenticate not token and return 403', async () => {
        const res = await supertes(app)
            .post('/api/auth/authenticateToken')
        expect(res.status).toBe(403);
        expect(res.body).toEqual('Require access token');
    })
    
    it('it should authenticate token invalid and return 403', async () => {
        const res = await supertes(app)
        .post('/api/auth/authenticateToken')
        .set("Cookie", ['access_token=invalid_token'])
        expect(res.status).toBe(500);
        expect(res.body).toEqual('Verify token error');
    })
});

describe('Auth Logout remove access_token in cookie', () => {
    it('it should remove token in header and return 200', async () => {
        const response = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '123' });
        expect(response.headers['set-cookie']).toBeDefined();

        // Parse the cookies from the response headers
        let cookies = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]);

        // Find the access_token cookie
        let accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));

        const res = await supertes(app)
            .post('/api/auth/logout')
            .set("Cookie", [accessTokenCookie])
        expect(res.status).toBe(200);
        // Parse the cookies from the res headers
        cookies = res.headers['set-cookie'].map(cookie => cookie.split(';')[0]);

        // Find the access_token cookie
        accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
        expect(accessTokenCookie).toEqual('access_token=')
    })

    it('it should return 200 when not have access_token', async () => {
        const response = await supertes(app)
            .post('/api/auth/logout')

        expect(response.status).toBe(200)
    })
});

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

});

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
        expect(res.body.errors).not.toBeNull()
    })

    it('it should register new user fail when not have field password and return 400', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin999', name: '123' });
        expect(res.status).toBe(400);
        expect(res.body.errors).not.toBeNull()
    })

    it('it should register new user fail when not have field name and return 400', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin999', password: '123' });
        expect(res.status).toBe(400);
        expect(res.body.errors).not.toBeNull()
    })

    it('it should register new user fail when username already exist and return 409', async () => {
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: '123', name: '123' });
        expect(res.status).toBe(409);
    })

});

describe('Mock error', () => {
    it('it should login fail when query table User error and return 500', async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error('Error occurred while querying'));
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin999', password: '123' });
        expect(res.status).toBe(500);
        User.findOne.mockClear()
    })

    it('it should regist new user fail when query table User error', async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error('Error occurred while querying'));
        const res = await supertes(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: '123', name: '123' });
        expect(res.status).toBe(500);
    })
})