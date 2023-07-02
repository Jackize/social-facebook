import { Call, Send, Videocam } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useMatch, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ReactComponent as LogoGPT } from '../../assets/logoGPT/logo.svg'
import { makeRequest } from "../../axios";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/messages/Messages";
import { AuthContext } from "../../context/authContext";
import { SOCKET_SERVER } from "../../utils/config";
import SEO from "../../components/seo/SEO";
import { noneAvatar } from "../../utils/image";

export default function Inbox() {
    const { currentUser } = React.useContext(AuthContext);
    const [getMessages, setGetMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState("");
    const [dataConversations, setDataConversations] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [conversationId, setConversationId] = useState();
    const socketRef = useRef();
    const scrollRef = useRef();
    const navigate = useNavigate();
    const gptURL = useMatch("/inbox/gpt");
    const conversation_id = parseInt(useLocation().pathname.split("/")[2]);

    // Initialize socket
    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER, {
            withCredentials: true,
            transports: ["websocket"],
            extraHeaders: {
                "Content-Type": "application/json",
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            forceNew: false,
            timeout: 20000,
        });

        socketRef.current.on("user joined", (userId, roomId) => {
            console.log(`${userId} joined room ${roomId}`);
        });

        socketRef.current.on("user left", (userId, roomId) => {
            console.log(`${userId} left room ${roomId}`);
        });

        socketRef.current.on("new message", (senderId, message) => {
            setGetMessages((prev) => [...prev, { sender_id: senderId, content: message, updatedAt: new Date() }]);
        });
        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Get all history conservation
        const getConversation = async () => {
            try {
                const res = await makeRequest.get("/conversations");
                const dataConversations = res.data;
                if (dataConversations.length > 0 && conversation_id) {
                    const dataConversation = dataConversations.find((conversation) => conversation.id === conversation_id);
                    const infoReceiver = dataConversation?.user1_id === currentUser.id ? dataConversation?.user2 : dataConversation?.user1;
                    infoReceiver && setUserInfo(infoReceiver);
                }
                setDataConversations(res.data);
            } catch (error) {
                console.log(error);
                if (error.response.status === 403) {
                    localStorage.removeItem('user')
                    navigate("/login");
                }
            }
        };
        getConversation();
        // Get messages when users click on conversation
        const getMessages = async (roomId) => {
            try {
                const mess = await makeRequest.get(`/messages/${roomId}`);
                setGetMessages(mess.data);
                setConversationId(roomId);
            } catch (error) {
                console.log(error);
            }
        };
        if (conversation_id) {
            socketRef.current.emit("joinRoom", conversation_id, currentUser.id);
            getMessages(conversation_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation_id, currentUser.id]);

    // Get messages when users click on conversation
    const handleSetUserJoinRoom = async (roomId) => {
        if (!conversationId && !gptURL) {
            socketRef.current.emit("joinRoom", roomId, currentUser.id);
            await getMessages();
        } else if (roomId !== conversationId) {
            socketRef.current.emit("leaveRoom", conversationId, currentUser.id);
            await getMessages();
        }
        setGetMessages([]);

        async function getMessages() {
            try {
                const mess = await makeRequest.get(`/messages/${roomId}`);
                setGetMessages(mess.data);
                setConversationId(roomId);
                setSendMessage("");
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Handle send message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        const newMessage = {
            content: sendMessage,
            conversation_id,
        };
        if (!gptURL) {
            try {
                const res = await makeRequest.post("/messages", newMessage);
                setGetMessages([...getMessages, res.data]);
            } catch (error) {
                console.log(error);
            }

            socketRef.current.emit("sendMessage", {
                roomId: conversation_id,
                senderId: currentUser.id,
                message: sendMessage,
            });
            setSendMessage("");
        } else {
            try {
                delete newMessage.conversation_id;
                const timestamp = Date.now();
                const randomNumber = Math.random();
                const hexadecimalNumber = randomNumber.toString(16);
                setGetMessages((prev) => [...prev, { sender_id: currentUser.id, content: newMessage.content, id: `id-${timestamp}-${hexadecimalNumber}`, updatedAt: new Date() }]);
                setSendMessage("");

                const res = await makeRequest.post("/messages/gpt", newMessage);
                if (res.data) {
                    setGetMessages((prev) => [...prev, { sender_id: 0, content: res.data.bot, id: res.data.id, updatedAt: new Date() }]);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [getMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };

    const handleNavigateProfilePage = () => {
        const infoConversation = dataConversations.filter((conversation) => conversation.id === conversation_id)[0];
        const profileUserId = infoConversation.user1_id === currentUser.id ? infoConversation.user2_id : infoConversation.user1_id;
        navigate(`/profile/${profileUserId}`);
    }

    return (
        <>
            <SEO
                description={'Chat box'}
                title={'Inbox'}
            />
            <Stack direction="row" sx={{ flex: 3, height: "100vh", p: 2 }}>
                <Paper variant="elevation" elevation={24} sx={{ display: "flex", flex: "3", height: "700px" }}>
                    {/* Conservation contex */}
                    <Box flex={1}>
                        <TextField fullWidth label="Search" type="search" variant="filled" sx={{ textAlign: "center" }} />
                        <List sx={{ height: "100%", overflowY: "scroll" }}>
                            <NavLink to={"/inbox/gpt"} children={({ isActive }) => <Conversation currentUser={currentUser} gpt checked={isActive} />} onClick={handleSetUserJoinRoom} />
                            {/* List conservation */}
                            {dataConversations &&
                                dataConversations.map((e, i) => (
                                    <NavLink
                                        key={e.id}
                                        to={`/inbox/${e.id}`}
                                        children={({ isActive }) => <Conversation key={e.id} currentUser={currentUser} conversation={e} checked={isActive} />}
                                        onClick={() => handleSetUserJoinRoom(e.id)}
                                    />
                                ))}
                        </List>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    {/* Message contex */}
                    <Box display={"flex"} flex={3} p={2} flexDirection={"column"}>
                        {gptURL || conversation_id ? (
                            <>
                                {/* Header */}
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
                                            <ListItemButton sx={{ borderRadius: 2 }}>
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
                                <Divider flexItem />
                                {/* Message */}
                                <Box sx={{ height: "100%", overflowY: "scroll" }}>
                                    {getMessages &&
                                        getMessages.map((mess) => (
                                            <div key={mess.id} ref={scrollRef}>
                                                <Message
                                                    key={mess.id}
                                                    message={mess.content}
                                                    own={mess.sender_id === currentUser.id}
                                                    timeZone={mess.updatedAt}
                                                    userInfo={gptURL ? { avatarPic: <LogoGPT /> } : userInfo}
                                                />
                                            </div>
                                        ))}
                                </Box>
                                {/* Input */}
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
                            </>
                        ) : (
                            <Typography variant="h4" sx={{ p: 2, margin: "0 auto" }} textAlign>
                                Open a conversation to start a chat.
                            </Typography>
                        )}
                    </Box>
                </Paper>
                <Box flex={1}></Box>
            </Stack >
        </>
    );
}
