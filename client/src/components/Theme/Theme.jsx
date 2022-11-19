import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { DarkModeContext } from '../../context/darkModeContext';

const Theme = ({ children }) => {
    const { darkMode } = React.useContext(DarkModeContext);
    const styles = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            palette: {
                text: {
                    primary: darkMode ? '#000' : '#fff',
                },
            },
            background: {
                paper: darkMode ? '#18191A' : '#F0F2F5',
            },
        },
    });
    return <ThemeProvider theme={styles}>{children}</ThemeProvider>;
};

export default Theme;
