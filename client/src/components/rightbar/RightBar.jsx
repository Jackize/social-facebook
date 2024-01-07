import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";
import { noneAvatar } from "../../utils/image";
import AddFriend from "./addFriend/AddFriend";
import { BoxStyle, StyledBadgeOffline, StyledBadgeOnline } from "./rightBar.style";
import { useSocketContext } from "../../context/socketContext";

const RightBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const socket = useSocketContext()
    const [userOnline, setUserOnline] = useState([])
    const { isLoading, error, data } = useQuery(
        ["friends"],
        () =>
            makeRequest.get("/users/friends").then((res) => {
                socket?.emit('getOnline', res.data)
                return res.data;
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );

    useEffect(() => {
        socket?.on('receiverOnline', async (receiverOnline) => {
            setUserOnline(receiverOnline)
        })
    }, [])

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
                    {error ? (
                        "Something went wrong"
                    ) : isLoading ? (
                        <ListItem>
                            <ListItemButton sx={{ borderRadius: 2 }}>
                                <ListItemAvatar>
                                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
                                </ListItemAvatar>
                                <Skeleton animation="wave" height={10} width="50%" />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        data.map((e, id) => (
                            <ListItem key={e.id}>
                                <ListItemButton sx={{ borderRadius: 2 }} onClick={() => handleCreateConversation(e)}>
                                    <ListItemAvatar>
                                        {userOnline.some(user => user.id === e.id) ? (
                                            <StyledBadgeOnline
                                                overlap="circular"
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "right",
                                                }}
                                                variant="dot">
                                                <Avatar alt={e.name} src={e.avatarPic ? e.avatarPic : noneAvatar} />
                                            </StyledBadgeOnline>
                                        ) : (
                                            <StyledBadgeOffline
                                                overlap="circular"
                                                anchorOrigin={{
                                                    vertical: "bottom",
                                                    horizontal: "right",
                                                }}
                                                variant="dot">
                                                <Avatar alt={e.name} src={e.avatarPic ? e.avatarPic : noneAvatar} />
                                            </StyledBadgeOffline>
                                        )}

                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e.name}
                                        sx={{
                                            color: theme.palette.text.primary,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </BoxStyle>
        </Box>
    );
};

export default RightBar;
