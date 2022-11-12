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
} from '@mui/material';
import { Home, OndemandVideo, Store } from '@mui/icons-material';
import { MaterialUISwitch } from './leftBar.style';
const LeftBar = () => {
    return (
        <Box flex={1} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box position="fixed">
                <List>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <OndemandVideo />
                            </ListItemIcon>
                            <ListItemText primary="Watch" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <Store />
                            </ListItemIcon>
                            <ListItemText primary="Store" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <FormGroup>
                    <FormControlLabel
                        control={
                            <MaterialUISwitch sx={{ m: 1 }} defaultChecked />
                        }
                        label="Dark mode"
                        sx={{ ml: 2 }}
                    />
                </FormGroup>
            </Box>
        </Box>
    );
};

export default LeftBar;
