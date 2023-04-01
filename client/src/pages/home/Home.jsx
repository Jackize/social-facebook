import { Box, Stack } from '@mui/material';
import React from 'react';
import ModalUpPost from '../../components/modalUpPost/ModalUpPost';
import Posts from '../../components/posts/Posts';
import RightBar from '../../components/rightbar/RightBar';
import UpPost from '../../components/upPost/UpPost';
import SEO from '../../components/seo/SEO';
const Home = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
        <SEO 
            description={'Home'}
            title={'Home'}            
        />
        <Stack
            direction="row"
            justifyContent="space-between"
            gap={3}
            sx={{flex: 3}}
        >
            <Box flex={1.5} sx={{ p: 2 }} width="100%">
                <UpPost handleOpen={handleOpen} />
                <Posts />
                <ModalUpPost open={open} handleClose={handleClose} />
            </Box>
            <RightBar />
        </Stack>
        </>
    );
};

export default Home;
