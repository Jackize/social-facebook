import { Send } from "@mui/icons-material";
import { Box, Divider, IconButton, List, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { makeRequest } from "../../axios";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/messages/Messages";
import { AuthContext } from "../../context/authContext";
import { SOCKET_SERVER } from "../../utils/config";

export default function Inbox() {
    const { currentUser } = React.useContext(AuthContext);
    const [getMessages, setgetMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState("");
    const [dataConversations, setDataConversations] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [conversationId, setconversationId] = useState();
    const socketRef = useRef();
    const scrollRef = useRef();

    const conversation_id = parseInt(useLocation().pathname.split("/")[2]);

    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER);

        socketRef.current.on("user joined", (userId, roomId) => {
            console.log(`${userId} joined room ${roomId}`);
        });

        socketRef.current.on("user left", (userId, roomId) => {
            console.log(`${userId} left room ${roomId}`);
        });

        socketRef.current.on("new message", (senderId, message) => {
            setgetMessages((prev) => [...prev, { sender_id: senderId, content: message, updatedAt: new Date() }]);
        });
        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await makeRequest.get("/conversations");
                const dataConversations = res.data;
                if (dataConversations.length > 0) {
                    const dataConversation = dataConversations.find((conversation) => conversation.id === conversation_id);
                    const infoReceiver = dataConversation?.user1_id === currentUser.id ? dataConversation?.user2 : dataConversation?.user1;
                    infoReceiver && setUserInfo(infoReceiver);
                }
                setDataConversations(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getConversation();
        const getMessages = async (roomId) => {
            try {
                const mess = await makeRequest.get(`/messages/${roomId}`);
                setgetMessages(mess.data);
                setconversationId(roomId);
            } catch (error) {
                console.log(error);
            }
        };
        if (conversation_id) {
            socketRef.current.emit("joinRoom", conversation_id, currentUser.id);
            getMessages(conversation_id);
        }
    }, [conversation_id, currentUser.id]);

    const handleSetUserJoinRoom = async (roomId) => {
        if (!conversationId) {
            socketRef.current.emit("joinRoom", roomId, currentUser.id);
            await getMessages();
        } else if (roomId !== conversationId) {
            socketRef.current.emit("leaveRoom", conversationId, currentUser.id);
            socketRef.current.emit("joinRoom", roomId, currentUser.id);
            await getMessages();
        }

        async function getMessages() {
            try {
                const mess = await makeRequest.get(`/messages/${roomId}`);
                setgetMessages(mess.data);
                setconversationId(roomId);
                setSendMessage("");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const newMessage = {
            content: sendMessage,
            conversation_id,
        };

        try {
            const res = await makeRequest.post("/messages", newMessage);
            setgetMessages([...getMessages, res.data]);
            setSendMessage("");
        } catch (error) {
            console.log(error);
        }

        socketRef.current.emit("sendMessage", {
            roomId: conversation_id,
            senderId: currentUser.id,
            message: sendMessage,
        });
        setSendMessage("");
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [getMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };
    return (
        <Stack direction="row" sx={{ flex: 3, height: "100vh", p: 2 }}>
            <Paper variant="elevation" elevation={24} sx={{ display: "flex", flex: "3", height: "700px" }}>
                <Box flex={1.5}>
                    <TextField fullWidth label="Search" type="search" variant="filled" sx={{ textAlign: "center" }} />
                    <List sx={{ height: "100%", overflowY: "scroll" }}>
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
                <Box display={"flex"} flex={3} p={2} flexDirection={"column"}>
                    {conversation_id ? (
                        <>
                            <Box sx={{ height: "100%", overflowY: "scroll" }}>
                                {getMessages &&
                                    getMessages.map((mess) => (
                                        <div key={mess.id} ref={scrollRef}>
                                            <Message key={mess.id} message={mess.content} own={mess.sender_id === currentUser.id} timeZone={mess.updatedAt} userInfo={userInfo} />
                                        </div>
                                    ))}
                            </Box>
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
        </Stack>
    );
}
