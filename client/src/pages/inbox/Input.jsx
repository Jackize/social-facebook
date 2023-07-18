import { Send } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import React from "react";

function Input({ setSendMessage, sendMessage, handleSendMessage, handleKeyDown }) {
    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
            <TextField
                fullWidth
                multiline
                variant="outlined"
                onChange={(e) => setSendMessage(e.target.value)}
                value={sendMessage}
                maxRows={5}
                margin={"normal"}
                onKeyDown={handleKeyDown}
            />
            <IconButton color={sendMessage.length > 0 ? "primary" : undefined} disabled={sendMessage.length > 0 ? false : true} onClick={handleSendMessage}>
                <Send />
            </IconButton>
        </Box>
    );
}

export default Input;
