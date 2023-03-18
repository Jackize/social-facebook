import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";
import { noneAvatar } from "../../utils/image";
import AddFriend from "./addFriend/AddFriend";
import { BoxStyle, StyledBadge } from "./rightBar.style";

const RightBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery(
        ["friends"],
        () =>
            makeRequest.get("/users/friends").then((res) => {
                return res.data;
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );

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
                        ))
                    )}
                </List>
            </BoxStyle>
        </Box>
    );
};

export default RightBar;
