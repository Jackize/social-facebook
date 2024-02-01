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
import { NotificationContext } from "../../context/notificationContext";

const ModalUpdate = ({ open, handleClose }) => {
  const theme = useTheme();
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);
  const { handleLoading, handeMessage } = React.useContext(NotificationContext);

  const { currentUser, handleResetUser } = React.useContext(AuthContext);

  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  const handleCoverChange = (event) => {
    setCoverFile(event.target.files[0]);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (updateUser) => {
      makeRequest.put("/users", updateUser)
        .then((res) => {
          handleResetUser(res.data)
          handeMessage(res, "Change successfully");
        })
        .catch((err) => {
          handeMessage(err, "Change failed");
        })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLoading(true)
    let avatarURL = "",
      coverURL = "";
    if (avatarFile) avatarURL = await uploadImage(avatarFile);
    if (coverFile) coverURL = await uploadImage(coverFile);
    if (e.target.name.value || avatarFile || coverFile) {
      mutation.mutate({
        name: e.target.name.value,
        avatarPic: avatarURL,
        coverPic: coverURL,
      });
    }
    setAvatarFile(null);
    setCoverFile(null);
    handleLoading(false)
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...style, width: 600 }}>
        <Stack direction="column">
          <Box>
            <Typography
              variant="h6"
              textAlign="center"
              color={theme.palette.text.primary}>
              {currentUser.name}
            </Typography>
            <Divider />
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                label="Name"
                name="name"
                fullWidth
                sx={{ marginTop: "20px", }}
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
                  <img src={URL.createObjectURL(avatarFile)} alt={avatarFile.name} type={avatarFile.type} style={styleImage} />
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
                  <img src={URL.createObjectURL(coverFile)} alt={coverFile.name} type={coverFile.type} style={styleImage} />
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
                  Upload Image Cover
                  <input hidden accept="image/*" type="file" />
                </Button>
              )}

              <ModalChangePass />

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

const ModalChangePass = () => {
  const theme = useTheme();
  const [changePassword, setChangePassword] = React.useState(false);
  const [fieldPass, setfieldPass] = React.useState({
    newPassword: "",
    oldPassword: "",
  });
  const { handeMessage, handleLoading } = React.useContext(NotificationContext)

  const mutation = useMutation(
    async (updatePass) => {
      handleLoading(true);
      makeRequest.put("/users/changePass", updatePass)
        .then(res => {
          handeMessage(res)
          handleResetFieldPass()
          handleClose();
        }).catch((err) => {
          handleResetFieldPass()
          handeMessage(err)
        }).finally(() => {
          handleLoading(false);
        })
    }
  );

  const handleChangePass = async (e) => {
    e.preventDefault();
    mutation.mutate({
      newPassword: fieldPass.newPassword,
      oldPassword: fieldPass.oldPassword,
    });
  }

  const handleChangeField = (event) => {
    const { name, value } = event.target;
    setfieldPass((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setChangePassword(false);
  }

  const handleResetFieldPass = () => {
    setfieldPass({ newPassword: "", oldPassword: "" })
  }
  return (
    <>
      <Button
        variant="contained"
        component="label"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
        fullWidth
        onClick={() => setChangePassword(!changePassword)}
      >
        Change Password
      </Button>
      <Modal open={changePassword} onClose={handleClose}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" textAlign="center" color={theme.palette.text.primary}>Change Password</Typography>

          <Divider />

          <TextField variant="outlined" label="Old Password" fullWidth sx={{ marginTop: 3 }} name="oldPassword" value={fieldPass.oldPassword} onChange={handleChangeField} type="password" />
          <TextField variant="outlined" label="New Password" fullWidth sx={{ marginTop: 3 }} name="newPassword" value={fieldPass.newPassword} onChange={handleChangeField} type="password" />

          <ButtonGroup fullWidth sx={{ margin: "20px 0 -30px 0" }}>
            <Button onClick={() => setChangePassword(false)}>Cancel</Button>
            <Button onClick={handleChangePass}>Change</Button>
          </ButtonGroup>
        </Box>
      </Modal>
    </>
  );
}