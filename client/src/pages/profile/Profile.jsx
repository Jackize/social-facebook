import { Instagram, LinkedIn, Twitter, YouTube } from "@mui/icons-material";
import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Posts from "../../components/posts/Posts";
import { AvatarPic, CoverPic, InfoUser } from "./profile.style";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
const Profile = () => {
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const { currentUser } = React.useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data.map((e) => e.followerUserId);
      })
  );
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
  return (
    <Box flex={2} p={2}>
      <CoverPic>
        <InfoUser display="flex" justifyContent="center" alignItems="center">
          <AvatarPic
            sx={{
              backgroundImage:
                "url(https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            }}
            alt="acb"
          />
          <Typography marginLeft={2} color="text.primary">
            A roboto Curli
          </Typography>
        </InfoUser>
      </CoverPic>
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "50px",
          gap: 5,
          marginBottom: 2,
        }}>
        <Box
          display="flex"
          gap={5}
          flexWrap="wrap"
          ml={{ xs: "3rem", sm: "6rem", lg: "9rem" }}>
          <LinkedIn />
          <Instagram />
          <Twitter />
          <YouTube />
        </Box>
        <Box>
          {rIsLoading ? (
            "loading"
          ) : userId === currentUser.id ? (
            <Button variant="contained" color="error">
              Update
            </Button>
          ) : relationshipData.includes(currentUser.id) ? (
            <Button variant="contained" color="success" onClick={handleFollow}>
              Following
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleFollow}>
              Follow
            </Button>
          )}
        </Box>
      </Paper>
      <Posts userId={userId} />
    </Box>
  );
};

export default Profile;
