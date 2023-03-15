import { Add } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { noneAvatar } from "../../../utils/image";
import { ListStyle } from "./addFriend.style";

const AddFriend = () => {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(["not-friends"], () =>
    makeRequest.get("/users/not-friend").then((res) => {
      return res.data;
    }),{
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (userId) => {
      console.log(userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["not-friends", "posts", "friends"]);
      },
    }
  );

  const handleFollow = (userId) => {
    mutation.mutate(userId);
  };
  return (
    <>
      <Typography color="text.primary" gutterBottom>Friends you can know</Typography>
      <ListStyle>
        {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : data.map((e, id) => (
                <ListItem key={id}>
                  <ListItemButton sx={{borderRadius: 2}}>
                    <ListItemAvatar>
                      <Avatar
                        src={e.avatarPic ? e.avatarPic : noneAvatar}
                        sx={{ width: 30, height: 30 }}
                        component={Link}
                        to={`/profile/${e.id}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ color: theme.palette.text.primary }}
                      primary={e.name}
                    />
                    <IconButton onClick={() => handleFollow(e.id)}>
                      <Add color="primary" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
            ))}
      </ListStyle>
    </>
  );
};

export default AddFriend;
