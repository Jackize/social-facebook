import { Home, Image, Inbox, AutoAwesomeMotion } from "@mui/icons-material";

export const dataLeftBar = [
    {
        name: "Home",
        to: "/",
        activeIcon: <Home color="primary" />,
        noneActiveIcon: <Home />,
    },
    {
        name: "Inbox",
        to: "/inbox",
        activeIcon: <Inbox color="primary" />,
        noneActiveIcon: <Inbox />,
    },
    {
        name: "Saving",
        to: "/saving",
        activeIcon: <AutoAwesomeMotion color="primary" />,
        noneActiveIcon: <AutoAwesomeMotion />,
    },
];
