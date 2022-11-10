import mysql from 'mysql';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social',
});

// import pkg from 'pg';
// const { Pool } = pkg;

// export const db = new Pool({
//     user: 'njxbiypegycnse',
//     host: 'ec2-54-82-205-3.compute-1.amazonaws.com',
//     database: 'd905q9erdlbf90',
//     password:
//         '6ed7a9969b77a90dc58bbe8683533926ec013cff5d05e6121af39e608b1b146f',
//     port: '5432',
// });
