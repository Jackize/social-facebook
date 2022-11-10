import {
    AppBar,
    Avatar,
    Badge,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import React from 'react';
import { Icons, Search, StyledToolBar, UserBox } from './Navbar.style';
import { FacebookOutlined, Mail, Notifications } from '@mui/icons-material';
const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <AppBar position="sticky">
            <StyledToolBar>
                <Typography
                    variant="h6"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    Facebook
                </Typography>
                <FacebookOutlined
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                />
                <Search>
                    <InputBase placeholder="Search ..." />
                </Search>
                <Icons>
                    <IconButton>
                        <Badge badgeContent={4} color="error">
                            <Mail />
                        </Badge>
                    </IconButton>
                    <IconButton>
                        <Badge badgeContent={2} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <Avatar
                        sx={{ width: 30, height: 30 }}
                        src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        onClick={(e) => setOpen(true)}
                    />
                </Icons>
                <UserBox onClick={(e) => setOpen(true)}>
                    <Avatar
                        sx={{ width: 30, height: 30 }}
                        src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    />
                    <Typography variant="span">John</Typography>
                </UserBox>
            </StyledToolBar>
            <Menu open={open} onClose={(e) => setOpen(false)}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;
