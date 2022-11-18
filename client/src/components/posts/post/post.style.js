import { Card, styled } from '@mui/material';

export const CardStyle = styled(Card)(({ theme }) => ({
    marginBottom: 10,
    background: theme.palette.background.default,
    borderRadius: '15px',
}));
