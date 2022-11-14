import {
    Avatar,
    Button,
    Card,
    CardHeader,
    IconButton,
    useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';

const UpPost = ({ handleOpen }) => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                margin: 5,
                background: theme.palette.background.default,
                borderRadius: '15px',
            }}
        >
            <CardHeader
                avatar={<Avatar aria-label="recipe">R</Avatar>}
                title={
                    <Button onClick={handleOpen} fullWidth>
                        What are u thinking
                    </Button>
                }
                disableTypography
            />
        </Card>
    );
};

export default UpPost;
