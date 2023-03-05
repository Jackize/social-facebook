import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { noneAvatar } from "../../utils/image";

export default function Conversation({ conversation, currentUser, checked }) {
    const theme = useTheme();
    const { darkMode } = React.useContext(DarkModeContext);
    const [user, setUser] = useState(
        currentUser.id === conversation.user1_id ? conversation.user2 : conversation.user1
    );

    return (
        <ListItem>
            <ListItemButton
                sx={{
                    borderRadius: 2,
                    backgroundColor:
                        darkMode && checked
                            ? "rgba(255, 255, 255, 0.08)"
                            : !darkMode && checked
                            ? "rgba(0, 0, 0, 0.06)"
                            : null,
                }}>
                <ListItemAvatar>
                    <Avatar
                        src={user ? user.avatarPic : noneAvatar}
                        sx={{ width: 30, height: 30 }}
                    />
                </ListItemAvatar>
                <ListItemText
                    sx={{ color: theme.palette.text.primary }}
                    primary={user.username}
                />
            </ListItemButton>
        </ListItem>
    );
}
