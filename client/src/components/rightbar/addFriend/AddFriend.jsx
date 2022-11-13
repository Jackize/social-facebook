import {
    Avatar,
    Button,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import { ListStyle } from './addFriend.style';

const AddFriend = () => {
    const theme = useTheme();
    return (
        <>
            <Typography color="text.primary">Friends you can know</Typography>
            <ListStyle>
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>

                <Divider />
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>

                <Divider />
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>

                <Divider />
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>

                <Divider />
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>

                <Divider />
                <ListItem secondaryAction={<Button>Add Friend</Button>}>
                    <ListItemAvatar>
                        <Avatar
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            sx={{ width: 30, height: 30 }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ color: theme.palette.text.primary }}
                        primary="NTH"
                        secondary="9 mutual"
                    />
                </ListItem>
            </ListStyle>
        </>
    );
};

export default AddFriend;
