import {
    Avatar,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { makeRequest } from '../../axios';
import { noneAvatar } from '../../utils/image';
import AddFriend from './addFriend/AddFriend';
import { BoxStyle, StyledBadge } from './rightBar.style';


const RightBar = () => {
    const theme = useTheme();
    const { isLoading, data } = useQuery(["friends"], () =>
        makeRequest.get("/users/friends").then((res) => {
        return res.data;
        })
    );
    return (
        <Box
            flex={0.9}
            p={2}
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        >
            <BoxStyle>
                <AddFriend />

                <Typography color="text.primary" marginTop={2} marginBottom={1}>
                    OnlineFriends
                </Typography>
                <List>
                    {   
                        isLoading ? <CircularProgress/>:
                        data.map((e) => (
                        <ListItem key={e.id}>
                            <ListItemButton sx={{borderRadius: 2}}>
                                <ListItemAvatar>
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        variant="dot"
                                    >
                                        <Avatar alt={e.name} src={e.avatarPic? e.avatarPic: noneAvatar} />
                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={e.name}
                                    sx={{ color: theme.palette.text.primary }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </BoxStyle>
        </Box>
    );
};

export default RightBar;
