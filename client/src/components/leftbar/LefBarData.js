import { Home, Inbox, OndemandVideo, Store } from '@mui/icons-material';

export const dataLeftBar = [
    {
        name: 'Home',
        to: '/',
        activeIcon: <Home color="primary" />,
        noneActiveIcon: <Home />,
    },
    {
        name: 'Watch',
        to: '/watch',
        activeIcon: <OndemandVideo color="primary" />,
        noneActiveIcon: <OndemandVideo />,
    },
    {
        name: 'Store',
        to: '/store',
        activeIcon: <Store color="primary" />,
        noneActiveIcon: <Store />,
    },
    {
        name: 'Inbox',
        to: '/inbox',
        activeIcon: <Inbox color="primary" />,
        noneActiveIcon: <Inbox />,
    },
];
