import { AppBar, Avatar, Badge, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import React from "react";
import { Icons, Left, Middle, Mobile, Right, Search, SearchIconWrapper, StyledInputBase, StyledToolBar } from "./Navbar.style";
import { Home, Inbox, Mail, Notifications, OndemandVideo, Store } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { noneAvatar } from "../../utils/image";
import { useSocketContext } from "../../context/socketContext";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { currentUser, logout } = React.useContext(AuthContext);
    const { socket } = useSocketContext()
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const theme = useTheme();

    const handleLogout = () => {
        socket?.emit("userLogout", currentUser)
        logout()
        socket?.close()
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
                            <Badge badgeContent={2} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Avatar
                            sx={{ width: 30, height: 30 }}
                            src={currentUser?.avatarPic ? currentUser.avatarPic : noneAvatar}
                            id="avatar-menu"
                            alt={currentUser?.name || 'noneAvatar'}
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
                <MenuItem>{currentUser?.name}</MenuItem>
                <MenuItem component={Link} to={`/profile/${currentUser?.id}`}>
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
