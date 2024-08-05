import { Avatar, Button, CardHeader } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { noneAvatar } from "../../utils/image";
import { CardStyle } from "../posts/post/post.style";

const UpPost = ({ handleOpen }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <CardStyle>
      <CardHeader
        avatar={
          <Avatar
            src={user?.avatarPic ? user.avatarPic : noneAvatar}
            alt={user?.name}
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
