import React from "react";
import { Box, Divider, FormControlLabel, FormGroup, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { MaterialUISwitch } from "./leftBar.style";
import { DarkModeContext } from "../../context/darkModeContext";
import { NavLink } from "react-router-dom";
import { dataLeftBar } from "./LefBarData";
const LeftBar = () => {
    const { toggle, darkMode } = React.useContext(DarkModeContext);
    const theme = useTheme();
    return (
        <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" }, height: '100vh' }}>
            <Box position="fixed">
                <List>
                    {dataLeftBar.map((e, index) => (
                        <NavLink
                            key={index}
                            to={e.to}
                            children={({ isActive }) => (
                                <ListItem>
                                    <ListItemButton
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: darkMode && isActive ? "rgba(255, 255, 255, 0.08)" : !darkMode && isActive ? "rgba(0, 0, 0, 0.06)" : null,
                                        }}>
                                        <ListItemIcon>{isActive ? e.activeIcon : e.noneActiveIcon}</ListItemIcon>
                                        <ListItemText
                                            primary={e.name}
                                            sx={{
                                                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        />
                    ))}
                </List>
                <Divider />
                <FormGroup>
                    <FormControlLabel control={<MaterialUISwitch sx={{ m: 1 }} />} label="Dark mode" sx={{ ml: 2, color: theme.palette.text.primary }} checked={darkMode} onClick={toggle} />
                </FormGroup>
            </Box>
        </Box>
    );
};

export default LeftBar;
