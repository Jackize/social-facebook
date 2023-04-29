import { Box } from "@mui/material";
import React, { useEffect } from "react";

export default function LoginSuccess() {
    useEffect(() => {
        setTimeout(() => {
            window.close();
        }, 1000);
    }, []);
    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            Thanks for loggin in!
        </Box>
    );
}
