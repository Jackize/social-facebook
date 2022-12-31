import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { style } from "../modalUpPost/ModalUpPost.style";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "../../context/authContext";

const ModalUpdate = ({ open, handleClose }) => {
  const theme = useTheme();
  const [file, setFile] = React.useState(null);
  const [content, setContent] = React.useState("");

  const { currentUser } = React.useContext(AuthContext);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
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
    const name = e.target.name.value;
    console.log(name);
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
              {currentUser.name}
            </Typography>
            <Divider />
            <form onSubmit={handleClick}>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                fullWidth
                sx={{
                  marginTop: "20px",
                }}
              />
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                fullWidth
                sx={{
                  marginTop: "20px",
                }}
              />
              <ButtonGroup fullWidth sx={{ margin: "20px 0 -30px 0" }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Post</Button>
              </ButtonGroup>
            </form>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalUpdate;
