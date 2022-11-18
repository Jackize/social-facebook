import React from 'react';
import { Box } from '@mui/material';
import Post from './post/Post';
import UpPost from '../upPost/UpPost';
import ModalUpPost from '../modalUpPost/ModalUpPost';

const Posts = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Box
                flex={2}
                p={2}
                sx={{ p: { xs: 0 }, marginLeft: '0 !important' }}
            >
                <UpPost handleOpen={handleOpen} />
                <Post />
                <Post />
                <Post />
                <Post />
            </Box>
            <ModalUpPost open={open} handleClose={handleClose} />
        </>
    );
};

export default Posts;
