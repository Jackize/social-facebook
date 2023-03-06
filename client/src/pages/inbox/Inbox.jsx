import { Send } from "@mui/icons-material";
import { Box, CircularProgress, Divider, IconButton, List, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { makeRequest } from "../../axios";
import Conversation from "../../components/conversation/Conversation";
import Messages from "../../components/messages/Messages";
import { AuthContext } from "../../context/authContext";
import { io } from "socket.io-client";
import { SOCKET_SERVER } from "../../utils/config";

export default function Inbox() {
    const { currentUser } = React.useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [dataConversation, setDataConversation] = useState([]);
    const [sendMessage, setSendMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();
    const socket = useRef(io(SOCKET_SERVER));

    useEffect(() => {
        socket.current = io(SOCKET_SERVER);
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                content: data.content,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage && (currentChat?.user1_id === arrivalMessage.sender || currentChat?.user2_id === arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", currentUser.id);
        // socket.current.on("getUsers", (users) => {
        //     console.log(users);
        // });
    }, [currentUser]);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const res = await makeRequest.get("/conversations");
                setDataConversation(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getConversation();
    }, [currentUser]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = currentChat?.id > 0 ? await makeRequest.get(`/messages/${currentChat.id}`) : [];
                setMessages(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getMessages();
    }, [currentChat]);

    const receiverId = !currentChat ? null : currentChat.user1_id === currentUser.id ? currentChat.user2_id : currentChat.user1_id;

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const newMessage = {
            content: sendMessage,
            conversation_id: currentChat.id,
        };

        socket.current.emit("sendMessage", {
            senderId: currentUser.id,
            receiverId,
            content: sendMessage,
        });

        try {
            const res = await makeRequest.post("/messages", newMessage);
            setMessages([...messages, res.data]);
            setSendMessage("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Stack direction="row" sx={{ flex: 3, height: "100vh", p: 2 }}>
            <Paper variant="elevation" elevation={24} sx={{ display: "flex", flex: "3", height: "700px" }}>
                <Box flex={1.5}>
                    <TextField fullWidth label="Search" type="search" variant="filled" sx={{ textAlign: "center" }} />
                    <List sx={{ height: "100%", overflowY: "scroll" }}>
                        {dataConversation &&
                            dataConversation.map((e, i) => (
                                <div key={e.id} onClick={() => setCurrentChat(e)}>
                                    <Conversation key={e.id} currentUser={currentUser} conversation={e} checked={currentChat && e.id === currentChat.id ? true : false} />
                                </div>
                            ))}
                    </List>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box display={"flex"} flex={3} p={2} flexDirection={"column"}>
                    {currentChat?.id ? (
                        <>
                            <Box sx={{ height: "100%", overflowY: "scroll" }}>
                                {messages &&
                                    messages.map((mess) => (
                                        <div key={mess.id} ref={scrollRef}>
                                            <Messages message={mess.content} own={mess.sender_id === currentUser.id ? true : false} timeZone={mess.updatedAt} />
                                        </div>
                                    ))}
                            </Box>
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                <TextField fullWidth multiline variant="outlined" onChange={(e) => setSendMessage(e.target.value)} value={sendMessage} maxRows={5} margin={"normal"} />
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
