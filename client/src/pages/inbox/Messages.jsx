import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { noneAvatar } from "../../utils/image";
import moment from "moment";
import { useAuthContext } from "../../context/authContext";
import LogoGPT from "../../assets/logoGPT/LogoGPT";

export default function Messages({ message, own, timeZone, gptURL, userInfo, getMessages }) {
    const theme = useTheme();
    const { currentUser } = useAuthContext()
    const { darkMode } = React.useContext(DarkModeContext);
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [getMessages]);
    return (
        <Box sx={{ height: "100%", overflowY: "scroll" }}>
            {getMessages &&
                getMessages.map((mess) => (
                    <ListItem key={mess.id} ref={scrollRef} sx={{ justifyContent: mess.senderId === currentUser?.id ? "flex-end" : "flex-start" }}>
                        <ListItemAvatar
                            sx={{
                                display: "flex",
                                flexDirection: mess.senderId === currentUser?.id ? "row-reverse" : null,
                                width: "100%",
                            }}>
                            {<Avatar src={mess.senderId === currentUser?.id ? currentUser?.avatarPic : userInfo.avatarPic ? userInfo.avatarPic : noneAvatar} sx={{ width: 30, height: 30 }} />}
                            <Box display={"flex"} flexDirection={"column"}>
                                <ListItemText
                                    sx={{
                                        color: theme.palette.text.primary,
                                        margin: "0 10px",
                                        padding: "5px 10px",
                                        borderRadius: "10px",
                                        backgroundColor: darkMode && mess.senderId === currentUser?.id ? "#0e4985" : !darkMode && mess.senderId === currentUser?.id ? "#5b99d9" : !darkMode && !mess.senderId === currentUser?.id ? "#bac0c4" : "#7a7f83",
                                    }}
                                    primary={mess.content}
                                />
                                <ListItemText
                                    sx={{
                                        color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
                                        display: "flex",
                                        justifyContent: mess.senderId === currentUser?.id ? "flex-end" : "flex-start",
                                    }}
                                    primary={moment(mess.updatedAt).fromNow()}
                                />
                            </Box>
                        </ListItemAvatar>
                    </ListItem>
                ))}
        </Box>
    );
}
