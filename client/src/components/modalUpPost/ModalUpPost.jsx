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
} from '@mui/material';
import React from 'react';
import { style } from './ModalUpPost.style';

const ModalUpPost = ({ open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Stack direction="column">
                    <Box>
                        <Typography variant="h6" textAlign="center">
                            Create Post
                        </Typography>
                        <Divider />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            sx={{ margin: '30px 0 30px 0' }}
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input hidden accept="image/*" type="file" />
                            <PhotoCamera />
                        </IconButton>
                        <ButtonGroup fullWidth sx={{ marginBottom: '-30px' }}>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button>Post</Button>
                        </ButtonGroup>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalUpPost;
