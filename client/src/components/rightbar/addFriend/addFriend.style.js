import { List, styled } from '@mui/material';

export const ListStyle = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '211px',
    overflowY: 'scroll',
}));
