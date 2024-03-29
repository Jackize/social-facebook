import { Add } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { noneAvatar } from "../../../utils/image";
import { ListStyle } from "./addFriend.style";
import { NotificationContext } from "../../../context/notificationContext";

const AddFriend = () => {
    const theme = useTheme();
    const { handeMessage } = useContext(NotificationContext);

    const { isLoading, error, data } = useQuery(
        ["not-friends"],
        () =>
            makeRequest.get("/users/not-friend").then((res) => {
                return res.data;
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
    const queryClient = useQueryClient();

    const mutation = useMutation(
        async (userId) => {
            try {
                const res = await makeRequest.post("/relationships", { userId });
                handeMessage(res);
            } catch (err) {
                handeMessage(err);
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("posts");
            },
        }
    );

    const handleFollow = (userId) => {
        mutation.mutate(userId);
    };
    return (
        <>
            <Typography color="text.primary" gutterBottom>
                Friends you can know
            </Typography>
            <ListStyle>
                {error ? (
                    "Something went wrong!"
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
                        <ListItem key={id}>
                            <ListItemButton sx={{ borderRadius: 2 }}>
                                <ListItemAvatar>
                                    <Avatar src={e.avatarPic ? e.avatarPic : noneAvatar} alt={e.name} sx={{ width: 30, height: 30 }} component={Link} to={`/profile/${e.id}`} aria-label={e.name} />
                                </ListItemAvatar>
                                <ListItemText sx={{ color: theme.palette.text.primary }} primary={e.name} />
                                <IconButton onClick={() => handleFollow(e.id)}>
                                    <Add color="primary" />
                                </IconButton>
                            </ListItemButton>
                        </ListItem>
                    ))
                )}
            </ListStyle>
        </>
    );
};

export default AddFriend;
