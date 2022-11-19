import React from 'react';
import Post from './post/Post';

const data = [
    {
        id: 1,
        avatarPic:
            'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        context: 'Lorem ipsum dolor sit amet, consectetur adip',
        image: 'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
        id: 2,
        avatarPic:
            'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        context: 'Lorem ipsum dolor sit amet, consectetur adip',
        image: 'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
        id: 3,
        avatarPic:
            'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        context: 'Lorem ipsum dolor sit amet, consectetur adip',
        image: 'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
        id: 4,
        avatarPic:
            'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        context: 'Lorem ipsum dolor sit amet, consectetur adip',
        image: 'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
];

const Posts = () => {
    return (
        <>
            {data.map((e) => (
                <Post key={e.id} post={e} />
            ))}
        </>
    );
};

export default Posts;
