const app = require('../../app.js');
const supertes = require('supertest');

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