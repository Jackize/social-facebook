import { Instagram, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import { Avatar, Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import Posts from '../../components/posts/Posts';
import { AvatarPic, CoverPic, InfoUser } from './profile.style';

const Profile = () => {
    return (
        <Box flex={2} p={2}>
            <CoverPic>
                <InfoUser
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <AvatarPic
                        sx={{
                            backgroundImage:
                                'url(https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
                        }}
                        alt="acb"
                    />
                    <Typography marginLeft={2} color="text.primary">
                        A roboto Curli
                    </Typography>
                </InfoUser>
            </CoverPic>
            <Paper
                elevation={5}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '50px',
                    gap: 5,
                    marginBottom: 2,
                }}
            >
                <Box
                    display="flex"
                    gap={5}
                    flexWrap="wrap"
                    ml={{ xs: '3rem', sm: '6rem', lg: '9rem' }}
                >
                    <LinkedIn />
                    <Instagram />
                    <Twitter />
                    <YouTube />
                </Box>
                <Box>
                    <Button variant="contained">Add Friend</Button>
                </Box>
            </Paper>
            <Posts />
        </Box>
    );
};

export default Profile;
