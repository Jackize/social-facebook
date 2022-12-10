import {
    Avatar,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Checkbox,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Comment,
    Favorite,
    FavoriteBorder,
    MoreVert,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

import React from 'react';
import { CardStyle } from './post.style';

const Post = ({ post }) => {
    return (
        <CardStyle>
            <CardHeader
                avatar={
                    <Avatar
                        aria-label="recipe"
                        component={Link}
                        to={`/profile/1`}
                        src={post.avatarPic}
                    />
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVert />
                    </IconButton>
                }
                title="John Doe"
                subheader="September 14, 2022"
            />
            {post.context && (
                <CardContent>
                    <Typography variant="body2" color="text.primary">
                        {post.context}
                    </Typography>
                </CardContent>
            )}
            {post.image && (
                <CardMedia
                    component="img"
                    height="20%"
                    image={post.image}
                    alt="Paella dish"
                />
            )}
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite sx={{ color: 'red' }} />}
                    />
                </IconButton>
                <IconButton aria-label="comment">
                    <Comment />
                </IconButton>
            </CardActions>
        </CardStyle>
    );
};

export default Post;
