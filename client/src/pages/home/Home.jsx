import { Box, Stack } from '@mui/material';
import React from 'react';
import ModalUpPost from '../../components/modalUpPost/ModalUpPost';
import Posts from '../../components/posts/Posts';
import RightBar from '../../components/rightbar/RightBar';
import UpPost from '../../components/upPost/UpPost';

const Home = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{flex: 4}}
        >
            <Box flex={2} p={2} sx={{ p: { xs: 0 } }} width="100%">
                <UpPost handleOpen={handleOpen} />
                <Posts />
                <ModalUpPost open={open} handleClose={handleClose} />
            </Box>
            <RightBar />
        </Stack>
    );
};

export default Home;
