import { Avatar, Button, CardHeader } from '@mui/material';
import React from 'react';
import { CardStyle } from '../posts/post/post.style';

const UpPost = ({ handleOpen }) => {
    return (
        <CardStyle>
            <CardHeader
                avatar={<Avatar aria-label="recipe">R</Avatar>}
                title={
                    <Button onClick={handleOpen} fullWidth>
                        What are u thinking
                    </Button>
                }
                disableTypography
            />
        </CardStyle>
    );
};

export default UpPost;
