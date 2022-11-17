import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import AddFriend from './addFriend/AddFriend';
import { BoxStyle, StyledBadge } from './rightBar.style';

const data = [
    {
        id: 1,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 2,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 3,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 4,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 5,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 6,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 7,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
    {
        id: 8,
        url: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        name: 'Card',
    },
];
const RightBar = () => {
    const theme = useTheme();
    return (
        <Box flex={1} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <BoxStyle>
                <AddFriend />

                <Typography color="text.primary" marginTop={2} marginBottom={1}>
                    OnlineFriends
                </Typography>
                <List>
                    {data.map((e) => (
                        <ListItem key={e.id}>
                            <ListItemAvatar>
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                >
                                    <Avatar alt="Remy Sharp" src={e.url} />
                                </StyledBadge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={e.name}
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </ListItem>
                    ))}
                </List>
            </BoxStyle>
        </Box>
    );
};

export default RightBar;
