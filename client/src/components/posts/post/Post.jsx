import {
  Avatar,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Comment,
  Favorite,
  FavoriteBorder,
  MoreVert,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";
import { CardStyle } from "./post.style";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import { noneAvatar } from "../../../utils/image";
const Post = ({ post }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { currentUser } = React.useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const deletePostMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    likeMutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deletePostMutation.mutate(post.id);
  };
  return (
    <>
      <CardStyle>
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              component={Link}
              to={`/profile/${post.userId}`}
              src={post.user.avatarPic ? post.user.avatarPic : noneAvatar}
            />
          }
          action={
            <IconButton onClick={handleClick}>
              {post.userId === currentUser.id ? <MoreVert /> : null}
            </IconButton>
          }
          title={post.user.name}
          subheader={moment(post.createdAt).fromNow()}
        />
        {post.content && (
          <CardContent>
            <Typography variant="body2" color="text.primary">
              {post.content}
            </Typography>
          </CardContent>
        )}
        {post.img && (
          <CardMedia
            component="img"
            height="20%"
            image={post.img}
            alt={post.img}
          />
        )}
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            {isLoading ? (
              "loading"
            ) : (
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite sx={{ color: "red" }} />}
                checked={data.includes(currentUser.id)}
                onChange={handleLike}
              />
            )}
          </IconButton>
          <IconButton aria-label="comment">
            <Comment />
          </IconButton>
        </CardActions>
      </CardStyle>
      <Menu
        id="setting-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "setting",
        }}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default Post;
