import { alpha, Box, InputBase, styled, Toolbar } from '@mui/material';

export const StyledToolBar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
}));

export const Left = styled(Box)(({ theme }) => ({
    flex: 1,
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

export const Middle = styled(Box)(({ theme }) => ({
    flex: 2,
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));
export const Right = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: '30px',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));
export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 5,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    marginLeft: 0,
    marginRight: '40px',
    // display: { xs: 'none', sm: 'block' },
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

export const Icons = styled(Box)(({ theme }) => ({
    display: 'none',
    alignItems: 'center',
    gap: '20px',
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
    },
}));

export const Mobile = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
}));
