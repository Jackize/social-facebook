import React from 'react';
import LeftBar from '../components/leftbar/LeftBar';
import RightBar from '../components/rightbar/RightBar';
import { Box, Stack, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const Layout = () => {
    const theme = useTheme();
    return (
        <Box bgcolor={theme.palette.background.paper}>
            <Navbar />
            <Stack
                direction="row"
                spacing={{ xs: 0, lg: 2 }}
                justifyContent="space-between"
            >
                <LeftBar />
                <Outlet />
                <RightBar />
            </Stack>
        </Box>
    );
};

export default Layout;
