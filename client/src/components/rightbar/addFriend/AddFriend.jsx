import { Add } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
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

  const { isLoading, error, data } = useQuery(["relationship"], () =>
    makeRequest.get("/users/people").then((res) => {
      return res.data;
    })
  );
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (userId) => {
      console.log(userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = (userId) => {
    console.log(userId);
    mutation.mutate(userId);
  };
  return (
    <>
      <Typography color="text.primary">Friends you can know</Typography>
      <ListStyle>
        {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : data.map((e, id) => (
              <ListItem key={id}>
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
                <Divider />
              </ListItem>
            ))}
      </ListStyle>
    </>
  );
};

export default AddFriend;
