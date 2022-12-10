import React from 'react';
import Post from './post/Post';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';

const Posts = () => {
    const { isLoading, error, data } = useQuery(['posts'], () => {
        makeRequest.get('/posts').then((res) => console.log(res.data));
    });
    console.log(data);
    return (
        <>
            {/* {data.map((e) => (
                <Post key={e.id} post={e} />
            ))} */}
        </>
    );
};

export default Posts;
