import { Home, Image, Inbox } from "@mui/icons-material";

export const dataLeftBar = [
    {
        name: "Home",
        to: "/",
        activeIcon: <Home color="primary" />,
        noneActiveIcon: <Home />,
    },
    {
        name: "image Generation",
        to: "/imageGeneration",
        activeIcon: <Image color="primary" />,
        noneActiveIcon: <Image />,
    },
    {
        name: "Inbox",
        to: "/inbox",
        activeIcon: <Inbox color="primary" />,
        noneActiveIcon: <Inbox />,
    },
];
