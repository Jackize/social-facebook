import React from 'react';
import {
    Box,
    Divider,
    FormControlLabel,
    FormGroup,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import { Home, OndemandVideo, Store } from '@mui/icons-material';
import { MaterialUISwitch } from './leftBar.style';
import { DarkModeContext } from '../../context/darkModeContext';
import { NavLink } from 'react-router-dom';
const LeftBar = () => {
    const { toggle, darkMode } = React.useContext(DarkModeContext);
    const theme = useTheme();
    return (
        <Box flex={1} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <Box position="fixed">
                <List>
                    <NavLink
                        to="/"
                        children={({ isActive }) => (
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {isActive ? (
                                            <Home color="primary" />
                                        ) : (
                                            <Home />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Home"
                                        sx={{
                                            color: isActive
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )}
                    />
                    <NavLink
                        to="/watch"
                        children={({ isActive }) => (
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {isActive ? (
                                            <OndemandVideo color="primary" />
                                        ) : (
                                            <OndemandVideo />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Watch"
                                        sx={{
                                            color: isActive
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )}
                    />
                    <NavLink
                        to="/store"
                        children={({ isActive }) => (
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {isActive ? (
                                            <Store color="primary" />
                                        ) : (
                                            <Store />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Store"
                                        sx={{
                                            color: isActive
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )}
                    />
                </List>
                <Divider />
                <FormGroup>
                    <FormControlLabel
                        control={<MaterialUISwitch sx={{ m: 1 }} />}
                        label="Dark mode"
                        sx={{ ml: 2, color: theme.palette.text.primary }}
                        checked={darkMode}
                        onClick={toggle}
                    />
                </FormGroup>
            </Box>
        </Box>
    );
};

export default LeftBar;
