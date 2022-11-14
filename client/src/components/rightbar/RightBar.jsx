import { Box } from '@mui/material';
import React from 'react';
import AddFriend from './addFriend/AddFriend';
import OnlineFriends from './onlineFriends/OnlineFriends';

const RightBar = () => {
    return (
        <Box flex={1} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box position="fixed" width="24%">
                <AddFriend />
                <OnlineFriends />
            </Box>
        </Box>
    );
};

export default RightBar;
