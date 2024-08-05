import { Avatar, Box, Divider, List, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LogoPhoneCall from '../../assets/phoneCall/telephone-call.png';
import { makeRequest } from "../../axios";
import Conversation from "../../components/conversation/Conversation";
import SEO from "../../components/seo/SEO";
import { useSocketContext } from "../../context/socketContext";
import { socket } from "../../redux/socketSlice";
import Header from "./Header";
import Input from "./Input";
import Message from "./Messages";

export default function Inbox() {
    const { user } = useSelector((state) => state.user);
    const [getMessages, setGetMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState("");
    const [dataConversations, setDataConversations] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const conversation_id = parseInt(useLocation().pathname.split("/")[2]);
    const { calling, setRinging, setOffer, setCalling, myVideo, userVideo, createAnswer, rejectMeeting, endMeeting, ringing, setConversationId, conversationId, pc, audio } = useSocketContext()

    useEffect(() => {

        socket?.on("new message", async (message) => {
            setGetMessages((prev) => [...prev, message]);
        });

        socket?.on('answer', async (answer) => {
            try {
                let rtc_session_description = new RTCSessionDescription(answer);
                await pc.setRemoteDescription(rtc_session_description);
            } catch (error) {
                console.log('Error setting remote description:', error);
            }
        })

        const onCall = () => {
            setRinging(true)
            audio.play()
        }

        socket?.on('offer', async (offer) => {
            setOffer(offer)
            onCall()
        })

        socket?.on('reject', async (isCancle) => {
            setRejected(isTrue)
            myVideo.current.srcObject.getTracks().forEach(track => track.stop());
            userVideo.current.srcObject.getTracks().forEach(track => track.stop());

            myVideo.current.srcObject = null;
            userVideo.current.srcObject = null;

            pc.setLocalDescription(null)
        })

        socket?.on('endMeeting', async (isEnd) => {
            setOffer(null);
            setConnected(!isEnd);

            myVideo.current.srcObject.getTracks().forEach(track => track.stop());
            userVideo.current.srcObject.getTracks().forEach(track => track.stop());

            myVideo.current.srcObject = null;
            userVideo.current.srcObject = null;

            pc.setLocalDescription(null)
            pc.setRemoteDescription(null)
        });

        pc.ontrack = (event) => {
            if (event.streams[0]) {
                userVideo.current.srcObject = event.streams[0]
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('ice-candidate', conversationId, event?.candidate)
            }
        }

        // Get all history conservation
        const getConversation = async () => {
            try {
                const res = await makeRequest.get("/conversations");
                const convers = res.data
                setDataConversations(convers);
                // handle setUserInfo again when user reload page /inbox/{id}
                if (convers.length > 0 && conversation_id > 0) {
                    const room = convers.filter(con => con.id === conversation_id)
                    const myFriend = room[0].user1Id === user.id ? room[0].user2 : room[0].user1
                    setUserInfo(myFriend)
                }
            } catch (error) {
                console.log(error);
                if (error.response?.status === 403) {
                    localStorage.removeItem('user')
                    navigate("/login");
                }
            }
        };
        getConversation();
        return () => {
            socket?.off('offer')
            socket?.off('reject')
            socket?.off('endMeeting')
            socket?.off("new message")
            socket?.off("user joined")
            socket?.off("user left")
        };
    }, []);

    // handle when state [conversation_id, user?.id] change
    useEffect(() => {
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
        if (conversation_id > 0) {
            getMessages(conversation_id);
            socket?.emit("joinRoom", conversation_id, user?.id);
        }
        if (dataConversations.length > 0 && conversation_id) {
            const convertionId = dataConversations.find((conversation) => conversation.id === conversation_id);
            const infoReceiver = convertionId?.user1Id === user.id ? convertionId?.user2 : convertionId?.user1;
            infoReceiver && setUserInfo(infoReceiver);
        }
    }, [conversation_id, user?.id]);

    // Get messages when users click on conversation
    const handleSetUserJoinRoom = async (roomId) => {
        if (roomId !== 0) {
            if (!conversationId) {
                setConversationId(roomId);
                setSendMessage("");
            } else if (roomId !== conversationId && roomId > 0) {
                socket?.emit("leaveRoom", conversationId, user.id);
                await getMessages();
            }
        } else {
            setGetMessages([]);
            setSendMessage("");
            setUserInfo({})
        }

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
        try {
            const newMessage = {
                content: sendMessage,
                conversation_id,
            };
            try {
                const res = await makeRequest.post("/messages", newMessage);
                setGetMessages([...getMessages, res.data]);
                socket?.emit("sendMessage", res.data);
                setSendMessage("");
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && sendMessage.trim() !== "") {
            handleSendMessage(e);
        }
    };

    const handleNavigateProfilePage = () => {
        const infoConversation = dataConversations.filter((conversation) => conversation.id === conversation_id)[0];
        const profileUserId = infoConversation.user1Id === user.id ? infoConversation.user2Id : infoConversation.user1Id;
        navigate(`/profile/${profileUserId}`);
    }

    return (
        <>
            <SEO
                description={'Chat box'}
                title={'Inbox'}
            />
            <Stack direction="row" sx={{ flex: 3, p: 2 }}>
                <Paper variant="elevation" elevation={24} sx={{ display: "flex", flex: "3", height: "700px" }}>
                    {/* Conservation contex */}
                    <Box flex={1}>
                        <TextField fullWidth label="Search" type="search" variant="filled" sx={{ textAlign: "center" }} />
                        <List sx={{ height: "100%", overflowY: "scroll" }}>
                            {/* List conservation */}
                            {dataConversations &&
                                dataConversations.map((room) => (
                                    <NavLink
                                        key={room.id}
                                        to={`/inbox/${room.id}`}
                                        children={({ isActive }) => <Conversation key={room.id} conversation={room} checked={isActive} />}
                                        onClick={() => handleSetUserJoinRoom(room.id)}
                                    />
                                ))}
                        </List>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    {/* Message contex */}
                    <Box display={"flex"} flex={3} p={2} flexDirection={"column"}>
                        {(conversation_id && userInfo) ? (
                            <>
                                {/* Header */}
                                <Header userInfo={userInfo} handleNavigateProfilePage={handleNavigateProfilePage} />

                                <Divider flexItem />

                                {/* Message */}
                                <Message
                                    userInfo={userInfo}
                                    getMessages={getMessages}
                                />

                                {/* Input */}
                                <Input setSendMessage={setSendMessage} sendMessage={sendMessage} handleSendMessage={handleSendMessage} handleKeyDown={handleKeyDown} />
                            </>
                        ) : (
                            <Typography variant="h4" sx={{ p: 2, margin: "0 auto" }} textAlign>
                                Open a conversation to start a chat.
                            </Typography>
                        )}
                    </Box>
                    <Divider orientation="vertical" flexItem />

                    {ringing && <Avatar src={LogoPhoneCall} alt='PhoneIcon' />}
                    {calling && (
                        <div>
                            <div>
                                <h3>Your Video</h3>
                                <video ref={myVideo} autoPlay style={{ width: '100px', height: '100px' }} />
                            </div>
                            <div>
                                <h3>Remote Video</h3>
                                <video ref={userVideo} autoPlay style={{ width: '100px', height: '100px' }} />
                            </div>
                            <button onClick={() => createAnswer(conversationId)} disabled={!ringing}>Answer</button>
                            {ringing && <button onClick={() => rejectMeeting(conversationId)}>Cancel</button>}
                            {!ringing && <button onClick={() => endMeeting(conversationId)}>End Meeting</button>}
                        </div>
                    )}
                </Paper>
            </Stack >
        </>
    );
}
