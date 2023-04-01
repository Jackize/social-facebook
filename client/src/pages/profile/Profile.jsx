import { Instagram, LinkedIn, Twitter, YouTube } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Posts from "../../components/posts/Posts";
import { AvatarPic, CoverPic, InfoUser } from "./profile.style";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import ModalUpdate from "../../components/modalUpdate/ModalUpdate";
import { noneAvatar, noneCoverPic } from "../../utils/image";
import SEO from "../../components/seo/SEO";

const Profile = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { currentUser } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const userId = parseInt(useLocation().pathname.split("/")[2]);

    const { isLoading, error, data } = useQuery(
        ["user"],
        () =>
            makeRequest.get("/users/find/" + userId).then((res) => {
                return res.data;
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );

    const { isLoading: rIsLoading, data: relationshipData } = useQuery(
        ["relationship"],
        () =>
            makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
                return res.data.map((e) => e.followerUserId);
            }),
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
    const queryClient = useQueryClient();

    const mutation = useMutation(
        (following) => {
            if (following) return makeRequest.delete("/relationships?userId=" + userId);
            return makeRequest.post("/relationships", { userId });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["relationship"]);
            },
        }
    );

    const handleFollow = () => {
        mutation.mutate(relationshipData.includes(currentUser.id));
    };

    const handleCreateConversation = async () => {
        const res = await makeRequest.post("/conversations", { userId });
        if (res.data.id) {
            navigate("/inbox");
        }
    };
    return (
        <>
            <SEO 
            description={data?.name + " profile"}
            title={data?.name}            
        />
            <Box flex={4} p={10}>
                {error ? (
                    "Something went wrong!"
                ) : isLoading ? (
                    "Loading"
                ) : (
                    <CoverPic
                        key={data.id}
                        sx={{
                            backgroundImage: data.coverPic ? `url(${data.coverPic})` : `url(${noneCoverPic})`,
                        }}>
                        <InfoUser display="flex" justifyContent="center" alignItems="center">
                            <AvatarPic
                                sx={{
                                    backgroundImage: data.avatarPic ? `url(${data.avatarPic})` : `url(${noneAvatar})`,
                                }}
                                alt={data.name}
                            />
                            <Typography marginLeft={2} color="text.primary" variant="h4">
                                {data.name}
                            </Typography>
                        </InfoUser>
                    </CoverPic>
                )}
                <Paper
                    elevation={5}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "50px",
                        gap: 5,
                        marginBottom: 2,
                    }}>
                    <Box display="flex" gap={5} flexWrap="wrap" ml={{ xs: "3rem", sm: "6rem", lg: "14rem" }}>
                        <LinkedIn />
                        <Instagram />
                        <Twitter />
                        <YouTube />
                    </Box>
                    <Box>
                        {rIsLoading ? (
                            "loading"
                        ) : userId === currentUser.id ? (
                            <Button variant="contained" color="error" onClick={handleOpen}>
                                Update
                            </Button>
                        ) : relationshipData.includes(currentUser.id) ? (
                            <>
                                <Button variant="contained" color="primary" onClick={handleCreateConversation} sx={{ mr: 2 }}>
                                    Message
                                </Button>
                                <Button variant="contained" color="success" onClick={handleFollow}>
                                    Following
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="contained" color="primary" onClick={handleCreateConversation} sx={{ mr: 2 }}>
                                    Message
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleFollow}>
                                    Follow
                                </Button>
                            </>
                        )}
                    </Box>
                </Paper>
                <Posts userId={userId} />
                <ModalUpdate open={open} handleClose={handleClose} />
            </Box>
        </>
    );
};

export default Profile;
