import { Send } from "@mui/icons-material";
import { Box, FormControl, IconButton, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import React, { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { NotificationContext } from "../../context/notificationContext";

export default function ImageGeneration() {
    const theme = useTheme();
    const [field, setField] = useState({ number: 1, size: "1024x1024", text: "" });
    const [images, setImages] = useState([]);
    const { handleLoading, handeMessage } = useContext(NotificationContext);

    const handleChange = (e) => {
        setField((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        handleLoading(true);
        try {
            const result = await makeRequest.post("/images/createImage", {
                text: field.text,
                number: field.number,
                size: field.size,
            });
            setImages(prev => [...result.data.data, ...prev]);
        } catch (error) {
            console.log(error);
            handeMessage(error, error.response.data);
        } finally {
            handleLoading(false);
        }
        setField((prev) => ({ ...prev, text: "" }));
    };
    return (
        <Box flex={3} display={"flex"} flexDirection={"column"} alignItems={"center"} pt={4}>
            <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
                Image Generation
            </Typography>
            <Box width={"100%"}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                    <TextField fullWidth variant="outlined" maxRows={5} margin={"normal"} name="text" value={field.text} onChange={handleChange} />
                    <IconButton onClick={handleSubmitForm}>
                        <Send />
                    </IconButton>
                </Box>
                <FormControl sx={{ m: 1, minWidth: 80 }} onSubmit={handleSubmitForm}>
                    <InputLabel id="number-image">Number</InputLabel>
                    <Select labelId="number-image" id="number-select" autoWidth value={field.number} name="number" label="Number" onChange={handleChange}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="size-image">Size</InputLabel>
                    <Select labelId="size-image" id="size-select" autoWidth value={field.size} name="size" label="Size" onChange={handleChange}>
                        {["1024x1024", "512x512", "256x256"].map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <ImageList variant="standard" sx={{width: '700px'}}>
                    {images.map((item, index) => (
                        <ImageListItem key={index}>
                            <img src={item.url} alt={`${field.text}-${index}`} loading="lazy" />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        </Box>
    );
}
