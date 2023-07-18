import { Avatar, Button, CardHeader } from "@mui/material";
import React from "react";
import { CardStyle } from "../posts/post/post.style";
import { AuthContext } from "../../context/authContext";
import { noneAvatar } from "../../utils/image";

const UpPost = ({ handleOpen }) => {
  const { currentUser } = React.useContext(AuthContext);

  return (
    <CardStyle>
      <CardHeader
        avatar={
          <Avatar
            src={currentUser?.avatarPic ? currentUser.avatarPic : noneAvatar}
            alt={currentUser?.name}
          />
        }
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
