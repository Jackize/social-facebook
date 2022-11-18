import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Checkbox,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import { Favorite, FavoriteBorder, MoreVert, Share } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import React from 'react';
import { CardStyle } from './post.style';

const Post = () => {
    return (
        <CardStyle>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: 'red' }}
                        aria-label="recipe"
                        component={Link}
                        to={`/profile/1`}
                    >
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVert />
                    </IconButton>
                }
                title="John Doe"
                subheader="September 14, 2022"
            />
            <CardContent>
                <Typography variant="body2" color="text.primary">
                    This impressive paella is a perfect party dish and a fun
                    meal to cook together with your guests. Add 1 cup of frozen
                    peas along with the mussels, if you like.
                </Typography>
            </CardContent>
            <CardMedia
                component="img"
                height="20%"
                image="https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Paella dish"
            />

            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite sx={{ color: 'red' }} />}
                    />
                </IconButton>
                <IconButton aria-label="share">
                    <Share />
                </IconButton>
            </CardActions>
        </CardStyle>
    );
};

export default Post;
