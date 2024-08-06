import { Comment, Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material";
import { Avatar, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, Menu, MenuItem, Skeleton, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { CardStyle } from "./post.style";

import { useSelector } from "react-redux";
import { makeRequest } from "../../../axios";
import { socket } from "../../../redux/socketSlice";
import { noneAvatar } from "../../../utils/image";
const Post = ({ post, loading }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { user: currentUser } = useSelector((state) => state.user);
    const { isLoading, error, data } = useQuery(
        ["likes", post?.id],
        () =>
            makeRequest.get("/likes?postId=" + post.id).then((res) => {
                return res.data;
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            enabled: post !== undefined,
        }
    );

    const queryClient = useQueryClient();

    const likeMutation = useMutation(
        async (liked) => {
            if (liked) return makeRequest.delete("/likes?postId=" + post.id);
            const res = await makeRequest.post("/likes", { postId: post.id });
            if (res.status === 200) {
                socket.emit("likePost", { postId: post?.id, postOwnerId: post?.userId, userId: currentUser?.id });
            }
            return res.data;
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
        // console.log(postId, postOwnerId, currentUser?.id);
        // socket.emit("likePost", { postId, postOwnerId, userId: currentUser?.id });
        likeMutation.mutate(data.includes(currentUser?.id));
    };

    const handleDelete = () => {
        deletePostMutation.mutate(post.id);
    };
    return (
        <>
            <CardStyle>
                <CardHeader
                    avatar={
                        loading ? (
                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        ) : (
                            post && <Avatar aria-label="recipe" component={Link} to={`/profile/${post.userId}`} src={post.user.avatarPic ? post.user.avatarPic : noneAvatar} />
                        )
                    }
                    action={post && <IconButton onClick={handleClick}>{post.userId === currentUser?.id ? <MoreVert /> : null}</IconButton>}
                    title={loading ? <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} /> : post?.user.name}
                    subheader={loading ? <Skeleton animation="wave" height={10} width="40%" /> : moment(post?.createdAt).fromNow()}
                />
                {loading && (
                    <React.Fragment>
                        <Skeleton animation="wave" height={15} sx={{ margin: "0 10px" }} />
                        <Skeleton animation="wave" height={15} width="80%" sx={{ margin: "0 10px", marginBottom: 2 }} />
                    </React.Fragment>
                )}
                {loading && <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />}
                {post?.content && (
                    <CardContent>
                        <Typography variant="body2" color="text.primary">
                            {post.content}
                        </Typography>
                    </CardContent>
                )}

                {post?.img && <CardMedia component="img" height="20%" image={post.img} alt={post.img} />}
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        {isLoading ? null : <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: "red" }} />} checked={data.includes(currentUser?.id)} onChange={handleLike} />}
                    </IconButton>
                    <IconButton aria-label="comment">{isLoading ? null : <Comment />}</IconButton>
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
