import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import {
    Icons,
    Left,
    Middle,
    Mobile,
    Right,
    Search,
    SearchIconWrapper,
    StyledInputBase,
    StyledToolBar,
} from './Navbar.style';
import {
    Home,
    Mail,
    Notifications,
    OndemandVideo,
    Store,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme();
    return (
        <AppBar
            position="sticky"
            sx={{
                background: theme.palette.background.default,
                color: theme.palette.primary.main,
            }}
        >
            <StyledToolBar>
                <Left>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h4"
                        fontWeight={600}
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        facebook
                    </Typography>
                </Left>
                <Middle>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search" />
                    </Search>
                </Middle>
                <Right>
                    <Icons>
                        <IconButton sx={{ color: theme.palette.text.primary }}>
                            <Badge badgeContent={4} color="error">
                                <Mail />
                            </Badge>
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.text.primary }}>
                            <Badge badgeContent={2} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Avatar
                            sx={{ width: 30, height: 30 }}
                            src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            id="avatar-menu"
                            aria-controls={open ? 'menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                    </Icons>
                </Right>

                <Mobile>
                    <IconButton>
                        <Home />
                    </IconButton>
                    <IconButton>
                        <OndemandVideo />
                    </IconButton>
                    <IconButton>
                        <Store />
                    </IconButton>
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                </Mobile>
            </StyledToolBar>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'avatar-menu',
                }}
            >
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;
