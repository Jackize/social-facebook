import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { Call, Videocam } from "@mui/icons-material";
import { noneAvatar } from "../../utils/image";
import { useSocketContext } from "../../context/socketContext";
import { useLocation } from "react-router-dom";

function Header({ userInfo, handleNavigateProfilePage }) {
    const conversation_id = parseInt(useLocation().pathname.split("/")[2]);
    const { createOffer } = useSocketContext()

    return (
        <Box display={"flex"} alignItems={'center'} justifyContent={"space-between"} paddingRight={1}>
            <List>
                <ListItemButton sx={{ borderRadius: 2 }} onClick={handleNavigateProfilePage}>
                    <ListItemAvatar>
                        <Avatar src={userInfo?.avatarPic ? userInfo.avatarPic : noneAvatar} />
                    </ListItemAvatar>
                    <ListItemText primary={userInfo?.username} />
                </ListItemButton>
            </List>

            {/* Button call voice, video */}
            <List sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <ListItem>
                    <ListItemButton sx={{ borderRadius: 2 }} onClick={() => createOffer(conversation_id)}>
                        <ListItemIcon>
                            <Call fontSize="large" />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton sx={{ borderRadius: 2 }}>
                        <ListItemIcon>
                            <Videocam fontSize="large" />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}

export default Header;
