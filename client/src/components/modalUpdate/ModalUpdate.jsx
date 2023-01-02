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
import { makeRequest, uploadImage } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthContext } from "../../context/authContext";
import { styleImage } from "./modalUpdate.style";

const ModalUpdate = ({ open, handleClose }) => {
  const theme = useTheme();
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);

  const { currentUser } = React.useContext(AuthContext);

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleCoverChange = (event) => {
    setCoverFile(event.target.files[0]);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updateUser) => makeRequest.put("/users", updateUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
    let avatarURL = "",
      coverURL = "";
    if (avatarFile) avatarURL = await uploadImage(avatarFile);
    if (coverFile) coverURL = await uploadImage(coverFile);
    mutation.mutate({
      name: e.target.name.value,
      avatarPic: avatarURL,
      coverPic: coverURL,
    });
    setAvatarFile(null);
    setCoverFile(null);
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

              {avatarFile ? (
                <>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ marginTop: "20px", marginBottom: "20px" }}
                    color="error"
                    fullWidth
                    onClick={() => setAvatarFile(null)}>
                    Close
                  </Button>
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt={avatarFile.name}
                    type={avatarFile.type}
                    style={styleImage}
                  />
                </>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  sx={{ marginTop: "20px", marginBottom: "20px" }}
                  fullWidth
                  onChange={handleAvatarChange}>
                  Upload Image Avatar
                  <input hidden accept="image/*" type="file" />
                </Button>
              )}

              {coverFile ? (
                <>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ marginTop: "20px", marginBottom: "20px" }}
                    color="error"
                    fullWidth
                    onClick={() => setCoverFile(null)}>
                    Close
                  </Button>
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt={coverFile.name}
                    type={coverFile.type}
                    style={styleImage}
                  />
                </>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  fullWidth
                  onChange={handleCoverChange}>
                  Upload Image Profile
                  <input hidden accept="image/*" type="file" />
                </Button>
              )}
              <ButtonGroup fullWidth sx={{ margin: "20px 0 -30px 0" }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Change</Button>
              </ButtonGroup>
            </form>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalUpdate;
