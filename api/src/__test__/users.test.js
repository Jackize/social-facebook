const app = require('../../app.js');
const supertest = require('supertest');
const User = require('../models/users.js');
const { client } = require('../utils/redis.js');

describe('Route users', () => {
    let accessTokenCookie
    beforeAll(async () => {
        const response = await supertest(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '123' });

        // Parse the cookies from the response headers
        const cookies = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]);

        // Find the access_token cookie
        accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
    })

    it('should retrieve all users and return 200', async () => {
        const res = await supertest(app)
            .get('/api/users')
            .set('Cookie', [accessTokenCookie]);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'John Doe' })
        ]));
    });

    it('should return empty if an invalid query key is provided', async () => {
        const res = await supertest(app)
            .get('/api/users')
            .query({ invalidKey: 'value' })
            .set('Cookie', [accessTokenCookie]);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });

    it('should return 500 if an error occurs while retrieving the users', async () => {
        await client.del('allUsers')
        // Mocking the error by throwing an exception
        jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Database error'));

        const res = await supertest(app)
            .get('/api/users')
            .set('Cookie', [accessTokenCookie]);

        expect(res.status).toBe(500);
    });
});