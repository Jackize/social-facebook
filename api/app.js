const config = require('./src/utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';

// import authRouter from './src/routes/auth.js';
// import userRouter from './src/routes/users.js';
// import postRouter from './src/routes/posts.js';
// import likeRouter from './src/routes/likes.js';
// import storyRouter from './src/routes/stories.js';
// import relationshipRouter from './src/routes/relationships.js';
// import commentRouter from './src/routes/comments.js';
import { connectToDatabase } from './src/utils/db.js';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(cookieParser());

connectToDatabase();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    console.log(file);
    res.status(200).json(file.filename);
});

// app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
// app.use('/api/posts', postRouter);
// app.use('/api/comments', commentRouter);
// app.use('/api/likes', likeRouter);
// app.use('/api/stories', storyRouter);
// app.use('/api/relationships', relationshipRouter);

module.exports = app;
