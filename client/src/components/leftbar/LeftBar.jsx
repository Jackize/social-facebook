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
const LeftBar = () => {
    const { toggle, darkMode } = React.useContext(DarkModeContext);
    const theme = useTheme();
    return (
        <Box flex={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box position="fixed">
                <List>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText
                                primary="Home"
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <OndemandVideo />
                            </ListItemIcon>
                            <ListItemText
                                primary="Watch"
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Store />
                            </ListItemIcon>
                            <ListItemText
                                primary="Store"
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </ListItemButton>
                    </ListItem>
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
