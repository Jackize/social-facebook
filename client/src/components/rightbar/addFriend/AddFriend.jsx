import { Add } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { makeRequest } from "../../../axios";
import { ListStyle } from "./addFriend.style";

const AddFriend = () => {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/people").then((res) => {
      return res.data;
    })
  );
  return (
    <>
      <Typography color="text.primary">Friends you can know</Typography>
      <ListStyle>
        {error
          ? "Something went wrong!"
          : isLoading
          ? "loading"
          : data.map((e) => (
              <React.Fragment key={e.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={e.avatarPic} sx={{ width: 30, height: 30 }} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ color: theme.palette.text.primary }}
                    primary={e.name}
                  />
                  <IconButton>
                    <Add color="primary" />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
      </ListStyle>
    </>
  );
};

export default AddFriend;
