import { Alert, AlertTitle, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState({
        title: "",
        message: "",
        type: "",
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setloading] = useState(false);

    const handeMessage = (res, mess) => {
        const title = res.response ? res.response.status + "-" + res.response.statusText : res.status + "-" + res.statusText;
        setOpenSnackbar(true);
        if (res.status === 200) {
            setMessage((prev) => ({ ...prev, title: title, message: mess ? mess : res.data, type: "success" }));
        } else {
            setMessage((prev) => ({ ...prev, title: title, message: mess ? mess : res.response.data, type: "error" }));
        }
    };

    const handleNotification = (mess) => {
        setOpenSnackbar(true);
        setMessage((prev) => ({ ...prev, title: "Notification", message: mess, type: "info" }));
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
        setMessage({
            title: "",
            message: "",
            type: "",
        });
    };

    const handleLoading = (progress) => {
        setloading(progress);
    };
    return (
        <NotificationContext.Provider value={{ handeMessage, handleLoading, handleNotification }}>
            {message.message && (
                <Snackbar open={openSnackbar} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "center" }} onClose={handleClose}>
                    {message.type && (
                        <Alert variant="filled" message={message.message} severity={message.type} onClose={handleClose}>
                            <AlertTitle>{message.title}</AlertTitle>
                            {message.message}
                        </Alert>
                    )}
                </Snackbar>
            )}
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.tooltip + 1 }}>
                {loading && <CircularProgress color="inherit" />}
            </Backdrop>
            {children}
        </NotificationContext.Provider>
    );
};
