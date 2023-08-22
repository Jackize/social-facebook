const app = require('../../app.js');
const supertes = require('supertest');

describe('Auth', () => {
    it('it should login successfully', async () => {
        const res = await supertes(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: '123' });
        expect(res.status).toBe(200);
    })
});