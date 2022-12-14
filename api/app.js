const config = require('./src/utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRouter from './src/routes/auth.js';
import userRouter from './src/routes/users.js';
import postRouter from './src/routes/posts.js';
import likeRouter from './src/routes/likes.js';
import storyRouter from './src/routes/stories.js';
import relationshipRouter from './src/routes/relationships.js';
import commentRouter from './src/routes/comments.js';
import { connectToDatabase } from './src/utils/db.js';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(cookieParser());

connectToDatabase();

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/stories', storyRouter);
app.use('/api/relationships', relationshipRouter);

module.exports = app;
