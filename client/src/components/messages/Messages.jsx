import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, useTheme } from "@mui/material";
import React from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { noneAvatar } from "../../utils/image";
import moment from "moment";
import { AuthContext } from "../../context/authContext";

export default function Messages({ message, own, timeZone, userInfo }) {
    const theme = useTheme();
    const { darkMode } = React.useContext(DarkModeContext);
    const { currentUser } = React.useContext(AuthContext);

    return (
        <ListItem sx={{ justifyContent: own ? "flex-end" : "flex-start" }}>
            <ListItemAvatar
                sx={{
                    display: "flex",
                    flexDirection: own ? "row-reverse" : null,
                    width: "50%",
                }}>
                <Avatar src={own ? currentUser?.avatarPic : userInfo.avatarPic ? userInfo.avatarPic : noneAvatar} sx={{ width: 30, height: 30 }} />
                <Box display={"flex"} flexDirection={"column"}>
                    <ListItemText
                        sx={{
                            color: theme.palette.text.primary,
                            margin: "0 10px",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            backgroundColor: darkMode && own ? "#0e4985" : !darkMode && own ? "#5b99d9" : !darkMode && !own ? "#bac0c4" : "#7a7f83",
                        }}
                        primary={message}
                    />
                    <ListItemText
                        sx={{
                            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                            display: "flex",
                            justifyContent: own ? "flex-end" : "flex-start",
                        }}
                        primary={moment(timeZone).fromNow()}
                    />
                </Box>
            </ListItemAvatar>
        </ListItem>
    );
}
