import React from 'react';
import LeftBar from '../components/leftbar/LeftBar';
import RightBar from '../components/rightbar/RightBar';
import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const Layout = () => {
    return (
        <Box>
            <Navbar />
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <LeftBar />
                <Outlet />
                <RightBar />
            </Stack>
        </Box>
    );
};

export default Layout;
