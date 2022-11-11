import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

const Theme = ({ children }) => {
    const styles = createTheme({
        palette: {
            background: {
                paper: '#F0F2F5',
            },
        },
    });
    return <ThemeProvider theme={styles}>{children}</ThemeProvider>;
};

export default Theme;
