import { Close, PhotoCamera } from "@mui/icons-material";
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
} from "@mui/material";
import React from "react";
import { closeBtn, style } from "./ModalUpPost.style";
import { makeRequest, uploadImage } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ModalUpPost = ({ open, handleClose }) => {
  const theme = useTheme();
  const [file, setFile] = React.useState(null);
  const [content, setContent] = React.useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => makeRequest.post("/posts", newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await uploadImage(file);
    mutation.mutate({ content, img: imgUrl });
    setContent("");
    setFile(null);
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack direction="column">
          <Box>
            <Typography
              variant="h6"
              textAlign="center"
              color={theme.palette.text.primary}>
              Create Post
            </Typography>
            <Divider />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="filled"
              sx={{ margin: "30px 0 30px 0" }}
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                type={file.type}
                style={{ width: "320px", height: "250px", objectFit: "cover" }}
              />
            )}
            {!file ? (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}>
                <input hidden accept="image/*" type="file" />
                <PhotoCamera />
              </IconButton>
            ) : (
              <IconButton onClick={() => setFile(null)} sx={closeBtn}>
                <Close />
              </IconButton>
            )}
            <ButtonGroup
              fullWidth
              sx={{ marginBottom: "-30px", marginTop: "10px" }}>
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
