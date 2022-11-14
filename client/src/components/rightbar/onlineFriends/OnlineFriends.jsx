import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import { StyledBadge } from './onlineFriend.style';

const OnlineFriends = () => {
    return (
        <>
            <Typography color="text.primary" marginTop={2} marginBottom={3}>
                OnlineFriends
            </Typography>
            <Stack direction="row">
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar
                        alt="Remy Sharp"
                        src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    />
                </StyledBadge>
            </Stack>
        </>
    );
};

export default OnlineFriends;
