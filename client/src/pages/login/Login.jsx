import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/seo/SEO";
import { loginUser } from "../../redux/userSlice";
import "./login.scss";
const Login = () => {
    const [values, setValues] = React.useState({
        username: "",
        password: "",
    });
    const { user, loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user !== null) {
            navigate('/')
        }
    }, [user])

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginUser(values));
        if (!error && !loading && user) {
            navigate("/");
        }
    };

    const redirectToGoogleSSO = async () => {

    };
    const redirectToFacebookSSO = async () => {
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            dispatch(loginUser(values));
            navigate("/");
        }
    };
    return (
        <>
            <SEO
                description={'Login Page'}
                title={'Login'}
            />
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} bgcolor={"rgb(193, 190, 255)"} height={"100vh"}>
                <Box width={"50%"} display={"flex"} bgcolor={"white"} borderRadius={3} minHeight={"600px"} overflow={"hidden"}>
                    <Box
                        flex={1}
                        p={5}
                        display={"flex"}
                        flexDirection={"column"}
                        gap={4}
                        color={"white"}
                        sx={{
                            background: `linear-gradient(
                    rgba(39, 11, 96, 0.5),
                    rgba(39, 11, 96, 0.5)
                ),
                url('https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600')
                    center`,
                            backgroundSize: "cover",
                        }}>
                        <Typography variant="h2">Another Option</Typography>
                        <Button
                            variant="contained"
                            startIcon={<GoogleIcon color="error" />}
                            fullWidth
                            sx={{
                                backgroundColor: "white",
                                color: "#000",
                                "&:hover": {
                                    backgroundColor: "white",
                                    opacity: 0.9,
                                },
                            }}
                            onClick={redirectToGoogleSSO}>
                            Sign in with Google
                        </Button>
                        <Button variant="contained" startIcon={<FacebookRoundedIcon sx={{ color: "white" }} />} onClick={redirectToFacebookSSO}>
                            Sign in with Facebook
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "white",
                                color: "rebeccapurple",
                                "&:hover": {
                                    backgroundColor: "white",
                                    opacity: 0.9,
                                },
                            }}>
                            <Link to={"/register"} style={{ width: "100%" }}>
                                Register
                            </Link>
                        </Button>
                    </Box>
                    <Box display={"flex"} flex={1} p={5} flexDirection={"column"} gap={5} justifyContent={"center"}>
                        <Typography variant="h1" color={"#555"}>
                            Login
                        </Typography>
                        <form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}>
                            <TextField label="username" type="text" placeholder="Username" name="username" onChange={handleChange} />
                            <TextField label="password" type="password" placeholder="Password" name="password" onChange={handleChange} autoComplete="on" onKeyDown={handleKeyDown} />
                            {error &&
                                <Typography variant="h6" color={"red"}>{error}</Typography>
                            }
                            <Button variant="contained" onClick={handleLogin} sx={{ color: "white", backgroundColor: "#938eef" }}>
                                Login
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Login;
