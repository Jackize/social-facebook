import { Home, Inbox, Mail, Notifications, OndemandVideo, Store } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Avatar, Badge, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { addNotification } from "../../redux/notificationSlice";
import { socket } from "../../redux/socketSlice";
import { logoutUser } from "../../redux/userSlice";
import { noneAvatar } from "../../utils/image";
import { Icons, Left, Middle, Mobile, Right, Search, SearchIconWrapper, StyledInputBase, StyledToolBar } from "./Navbar.style";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, error } = useSelector((state) => state.user);
    console.log("🚀 ~ Navbar ~ user:", user)
    const notification = useSelector((state) => state.notification);
    console.log("🚀 ~ Navbar ~ notifications:", notification)
    const dispatch = useDispatch();

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("notification", (data) => {
            dispatch(addNotification({ ...data, currentUserId: user?.id }));
        })
    }, [socket])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme();

    const handleLogout = () => {
        dispatch(logoutUser(user))
        navigate("/login");
    }
    return (
        <AppBar
            position="sticky"
            sx={{
                background: theme.palette.background.default,
                color: theme.palette.primary.main,
            }}>
            <StyledToolBar>
                <Left>
                    <Typography component={Link} to="/" variant="h4" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
                        facebooks
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
                        <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => navigate('/inbox')}>
                            <Badge badgeContent={4} color="error">
                                <Mail />
                            </Badge>
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.text.primary }}>
                            {/* {notification.length > 0 && <Badge badgeContent={notification.length} color="error">
                                <Notifications />
                            </Badge>
                            } */}
                            <Badge badgeContent={notification.length} color={notification.length > 0 ? 'error' : 'default'}>
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Avatar
                            sx={{ width: 30, height: 30 }}
                            src={user?.avatarPic ? user.avatarPic : noneAvatar}
                            id="avatar-menu"
                            alt={user?.name || 'noneAvatar'}
                            aria-controls={open ? "menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        />
                    </Icons>
                </Right>

                <Mobile>
                    <NavLink to="/" children={({ isActive }) => <IconButton>{isActive ? <Home color="primary" /> : <Home />}</IconButton>} />
                    <NavLink to="/watch" children={({ isActive }) => <IconButton>{isActive ? <OndemandVideo color="primary" /> : <OndemandVideo />}</IconButton>} />
                    <NavLink to="/store" children={({ isActive }) => <IconButton>{isActive ? <Store color="primary" /> : <Store />}</IconButton>} />
                    <NavLink to="/inbox" children={({ isActive }) => <IconButton>{isActive ? <Inbox color="primary" /> : <Inbox />}</IconButton>} />
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
                    "aria-labelledby": "avatar-menu",
                }}>
                <MenuItem>{user?.name}</MenuItem>
                <MenuItem component={Link} to={`/profile/${user?.id}`}>
                    My account
                </MenuItem>
                {/* <MenuItem onClick={handleLogout} component={Link} to="/login"> */}
                <MenuItem onClick={() => handleLogout()} >
                    Logout
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;
