import { PhotoCamera } from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    IconButton,
    Modal,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import { style } from './ModalUpPost.style';
import { makeRequest } from '../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ModalUpPost = ({ open, handleClose }) => {
    const theme = useTheme();
    const [file, setFile] = React.useState(null);
    const [context, setContext] = React.useState('');
    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await makeRequest.post('/upload', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (newPost) => makeRequest.post('/posts', newPost),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
            },
        }
    );
    const handleClick = async (e) => {
        e.preventDefault();
        let imgUrl = '';
        if (file) imgUrl = await upload();
        mutation.mutate({ context, img: imgUrl });
        setContext('');
        setFile(null);
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack direction="column">
                    <Box>
                        <Typography
                            variant="h6"
                            textAlign="center"
                            color={theme.palette.text.primary}
                        >
                            Create Post
                        </Typography>
                        <Divider />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            sx={{ margin: '30px 0 30px 0' }}
                            onChange={(e) => setContext(e.target.value)}
                            value={context}
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            onChange={(e) => setFile(e.target.files[0])}
                        >
                            <input hidden accept="image/*" type="file" />
                            <PhotoCamera />
                        </IconButton>
                        <ButtonGroup fullWidth sx={{ marginBottom: '-30px' }}>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleClick}>Post</Button>
                        </ButtonGroup>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalUpPost;
