const app = require('../../app.js');
const supertest = require('supertest');
const Post = require('../models/posts.js');

describe('Route posts', () => {
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

    it('it should get all posts of user we followed by access_token and return 200', async () => {
        const res = await supertest(app)
            .get('/api/posts')
            .set("Cookie", [accessTokenCookie])
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0)
    })

    it('it should not get all posts without access_token and return 403', async () => {
        const res = await supertest(app)
            .get('/api/posts')
        expect(res.status).toBe(403);
    })

    it('it should get all posts of specific user by access_token and return 200', async () => {
        const res = await supertest(app)
            .get('/api/posts')
            .set("Cookie", [accessTokenCookie])
            .query({ userId: 2 })

        expect(res.status).toBe(200);
    })

    it('it should get all posts of user when him have not relationship by access_token and return 200', async () => {
        // regist new user
        await supertest(app)
            .post('/api/auth/register')
            .send({ username: 'user1', password: '123', name: '123' });

        // get access token of new user
        const loginNewUser = await supertest(app)
            .post('/api/auth/login')
            .send({ username: 'user1', password: '123' });

        // Parse the cookies from the response headers
        const cookiesNewUser = loginNewUser.headers['set-cookie'].map(cookie => cookie.split(';')[0]);

        // Find the access_token cookie
        let accessTokenCookieNewUser = cookiesNewUser.find(cookie => cookie.startsWith('access_token='));

        const res = await supertest(app)
            .get('/api/posts')
            .set("Cookie", [accessTokenCookieNewUser])

        expect(res.status).toBe(200);
    })

    it('it should create new post and return 200', async () => {
        const res = await supertest(app)
            .post('/api/posts')
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'admin' })

        await Post.destroy({
            where: { id: res.body.id }
        })
        expect(res.status).toBe(200);
    })

    it('it should delete new post and return 200', async () => {
        const newPost = await supertest(app)
            .post('/api/posts')
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'admin'})
        expect(newPost.status).toBe(200)
        
        const res = await supertest(app)
            .delete(`/api/posts/${newPost.body.id}`)
            .set("Cookie", [accessTokenCookie])

        expect(res.status).toBe(200);
    })

    it('it should not delete a post not exist and return 404', async () => {
        const res = await supertest(app)
            .delete(`/api/posts/9999`)
            .set("Cookie", [accessTokenCookie])

        expect(res.status).toBe(404);
    })

    it('it should update the content of post and return 200', async () => {
        const newPost = await supertest(app)
            .post('/api/posts')
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'admin' })
        expect(newPost.status).toBe(200)

        const res = await supertest(app)
            .put(`/api/posts/${newPost.body.id}`)
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'abc' })

        await Post.destroy({
            where: {
                id: newPost.body.id
            }
        })
        expect(res.status).toBe(200);
    })

    it('it should not update the post not found and return 404', async () => {
        const res = await supertest(app)
            .put(`/api/posts/9999`)
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'abc' })

        expect(res.status).toBe(404);
    })

    it('it should throw error when get post and return 500', async () => {
        Post.findAll = jest.fn().mockRejectedValue(new Error('Error occurred while querying'));

        const res = await supertest(app)
            .get('/api/posts')
            .set("Cookie", [accessTokenCookie])

        expect(res.status).toBe(500);
        jest.clearAllMocks()
    })

    it('it should throw error when create new post and return 200', async () => {
        Post.create = jest.fn().mockRejectedValue(new Error('Error occurred while creating'));

        const res = await supertest(app)
            .post('/api/posts')
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'admin' })

        expect(res.status).toBe(500);
        jest.clearAllMocks()
    })

    it('it should throw error when delete a post and return 200', async () => {
        Post.findOne = jest.fn().mockRejectedValue(new Error('Error occurred while deleting'));

        const res = await supertest(app)
            .delete('/api/posts/1')
            .set("Cookie", [accessTokenCookie])

        expect(res.status).toBe(500);
        jest.clearAllMocks()
    })

    it('it should throw error when delete a post and return 200', async () => {
        Post.update = jest.fn().mockRejectedValue(new Error('Error occurred while deleting'));

        const res = await supertest(app)
            .put(`/api/posts/9999`)
            .set("Cookie", [accessTokenCookie])
            .send({ content: 'abc' })

        expect(res.status).toBe(500);
        jest.clearAllMocks()
    })
});