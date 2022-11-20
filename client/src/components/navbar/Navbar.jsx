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
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { currentUser } = React.useContext(AuthContext);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme();
    const { logout } = React.useContext(AuthContext);
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
                            src={currentUser.avatarPic}
                            id="avatar-menu"
                            aria-controls={open ? 'menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                    </Icons>
                </Right>

                <Mobile>
                    <NavLink
                        to="/"
                        children={({ isActive }) => (
                            <IconButton>
                                {isActive ? <Home color="primary" /> : <Home />}
                            </IconButton>
                        )}
                    />
                    <NavLink
                        to="/watch"
                        children={({ isActive }) => (
                            <IconButton>
                                {isActive ? (
                                    <OndemandVideo color="primary" />
                                ) : (
                                    <OndemandVideo />
                                )}
                            </IconButton>
                        )}
                    />
                    <NavLink
                        to="/store"
                        children={({ isActive }) => (
                            <IconButton>
                                {isActive ? (
                                    <Store color="primary" />
                                ) : (
                                    <Store />
                                )}
                            </IconButton>
                        )}
                    />
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
                <MenuItem onClick={logout} component={Link} to="/login">
                    Logout
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;
