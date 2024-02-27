const app = require('../../app.js');
const supertes = require('supertest');

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
        expect(res.status).toBe(200);
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