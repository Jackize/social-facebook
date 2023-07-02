import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import "./login.scss";
import { Box, Button, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import { URL_BE } from "../../utils/config";
import SEO from "../../components/seo/SEO";
const Login = () => {
    const [values, setValues] = React.useState({
        username: "",
        password: "",
    });
    const [err, setErr] = React.useState(null);
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(values);
            navigate("/");
            // window.location.reload();
        } catch (error) {
            setErr(error.response.data);
        }
    };

    const redirectToGoogleSSO = async () => {
        let timer = null;
        const googleLoginUrl = `${URL_BE}/auth/google`;
        const newWindow = window.open(googleLoginUrl, "_blank", "width=500,height=600");
        if (newWindow) {
            timer = setInterval(() => {
                if (newWindow.closed) {
                    console.log("Yay we're authenticated");
                    login(null, true);
                    if (timer) clearInterval(timer);
                }
            }, 500);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            try {
                await login(values);
                navigate("/");
                // window.location.reload();
            } catch (error) {
                setErr(error.response.data);
            }
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
                        <Button variant="contained" startIcon={<FacebookRoundedIcon sx={{ color: "white" }} />}>
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
                            {err && err}
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
