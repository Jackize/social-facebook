import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { SOCKET_SERVER } from "../../utils/config";
import { noneAvatar } from "../../utils/image";
import AddFriend from "./addFriend/AddFriend";
import { BoxStyle, StyledBadge } from "./rightBar.style";

const RightBar = () => {
    const theme = useTheme();
    const socket = useRef(io(SOCKET_SERVER));
    const { currentUser } = React.useContext(AuthContext);
    const [onlineFriend, setOnlineFriend] = useState([]);
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.current = io(SOCKET_SERVER);
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", currentUser.id);
        socket.current.on("getUsers", (users) => {
            setOnlineFriend(friends.filter((f) => users.some((u) => u.userId === f.id)));
        });
    }, [currentUser, friends]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const { data } = await makeRequest.get("/users/friends");
                setFriends(data);
            } catch (error) {
                console.log(error);
            }
        };
        getFriends();
    }, [currentUser]);

    const handleCreateConversation = async (e) => {
        const res = await makeRequest.post("/conversations", { userId: e.id });
        if (res.data.id) {
            navigate("/inbox");
        }
    };
    return (
        <Box flex={0.9} p={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <BoxStyle>
                <AddFriend />

                <Typography color="text.primary" marginTop={2} marginBottom={1}>
                    OnlineFriends
                </Typography>
                <List>
                    {onlineFriend &&
                        onlineFriend.map((e) => (
                            <ListItem key={e.id}>
                                <ListItemButton sx={{ borderRadius: 2 }} onClick={() => handleCreateConversation(e)}>
                                    <ListItemAvatar>
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                            }}
                                            variant="dot">
                                            <Avatar alt={e.name} src={e.avatarPic ? e.avatarPic : noneAvatar} />
                                        </StyledBadge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e.name}
                                        sx={{
                                            color: theme.palette.text.primary,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            </BoxStyle>
        </Box>
    );
};

export default RightBar;
