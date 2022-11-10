import React from 'react';
import { Box } from '@mui/material';

const LeftBar = () => {
    return (
        <Box
            bgcolor="yellow"
            flex={1}
            p={2}
            sx={{ display: { xs: 'none', sm: 'block' } }}
        >
            LeftBar
        </Box>
    );
};

export default LeftBar;
