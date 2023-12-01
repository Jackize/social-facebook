import { Call, Send, Videocam } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useMatch, useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";
import Conversation from "../../components/conversation/Conversation";
import Message from "./Messages";
import { AuthContext } from "../../context/authContext";
import SEO from "../../components/seo/SEO";
import { noneAvatar } from "../../utils/image";
import LogoGPT from "../../assets/logoGPT/LogoGPT";
import { useSocketContext } from "../../context/socketContext";
import Header from "./Header";
import Input from "./Input";
import LogoPhoneCall from '../../assets/phoneCall/telephone-call.png';

export default function Inbox() {
    const { currentUser } = React.useContext(AuthContext);
    const [getMessages, setGetMessages] = useState([]);
    const [sendMessage, setSendMessage] = useState("");
    const [dataConversations, setDataConversations] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [conversationId, setConversationId] = useState();
    const navigate = useNavigate();
    const gptURL = useMatch("/inbox/gpt");
    const conversation_id = parseInt(useLocation().pathname.split("/")[2]);
    const socket = useSocketContext()

    const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    }));
    const [offer, setOffer] = useState();
    const [ringing, setRinging] = useState(false);
    const [audio, setAudio] = useState(new Audio('/phone.wav'));
    const [connected, setConnected] = useState(false);
    const [rejected, setRejected] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    useEffect(() => {
        socket?.on("user joined", async (userId, roomId) => {
            console.log(`${userId} joined room ${roomId}`);
        });

        socket?.on("user left", async (userId, roomId) => {
            console.log(`${userId} left room ${roomId}`);
        });

        socket?.on("new message", async (message) => {
            setGetMessages((prev) => [...prev, message]);
        });

        socket?.on('answer', async (answer) => {
            try {
                let rtc_session_description = new RTCSessionDescription(answer);
                await peerConnection.setRemoteDescription(rtc_session_description);
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
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());

            localVideoRef.current.srcObject = null;
            remoteVideoRef.current.srcObject = null;

            peerConnection.setLocalDescription(null)
        })

        socket?.on('endMeeting', async (isEnd) => {
            setOffer(null);
            setConnected(!isEnd);

            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());

            localVideoRef.current.srcObject = null;
            remoteVideoRef.current.srcObject = null;

            peerConnection.setLocalDescription(null)
        });

        peerConnection.ontrack = (event) => {
            if (event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0]
            }
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.emit('ice-candidate', conversationId, event?.candidate)
            }
        }

        if (peerConnection) {
            peerConnection.onconnectionstatechange = () => {
                setConnected(peerConnection.connectionState === 'connected')
                console.log(peerConnection.connectionState);
            }
        }
        // Get all history conservation
        const getConversation = async () => {
            try {
                const res = await makeRequest.get("/conversations");
                setDataConversations(res.data);
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
        if (conversation_id) {
            socket?.emit("joinRoom", conversationId, currentUser?.id);
            getMessages(conversation_id);
        }
        if (dataConversations.length > 0 && conversation_id) {
            const convertionId = dataConversations.find((conversation) => conversation.id === conversation_id);
            const infoReceiver = convertionId?.user1_id === currentUser.id ? convertionId?.user2 : convertionId?.user1;
            infoReceiver && setUserInfo(infoReceiver);
        }
    }, [conversation_id, currentUser?.id]);

    // Get messages when users click on conversation
    const handleSetUserJoinRoom = async (roomId) => {
        if (roomId !== 0) {
            if (!conversationId && !gptURL) {
                setConversationId(roomId);
                setSendMessage("");
            } else if (roomId !== conversationId && roomId > 0) {
                socket?.emit("leaveRoom", conversationId, currentUser.id);
                await getMessages();
            }
        } else {
            setGetMessages([]);
            setSendMessage("");
            setUserInfo({})
            setUserInfo(0)
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
            if (!gptURL) {
                try {
                    const res = await makeRequest.post("/messages", newMessage);
                    setGetMessages([...getMessages, res.data]);
                    socket?.emit("sendMessage", res.data);
                    setSendMessage("");
                } catch (error) {
                    console.log(error);
                }
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
        const profileUserId = infoConversation.user1_id === currentUser.id ? infoConversation.user2_id : infoConversation.user1_id;
        navigate(`/profile/${profileUserId}`);
    }

    const handleJoin = () => {
        socket?.emit('join', roomId);
    };

    const getUserMedia = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.getTracks().forEach((track) => {
                peerConnection?.addTrack(track, localStream)
            })
            localVideoRef.current.srcObject = localStream
        } catch (error) {
            console.error('Counld not get user media', error)
        }
    }
    const createOffer = async () => {
        try {
            await getUserMedia()
            let offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            socket?.on('ice-candidate', async (cand) => {
                try {
                    await peerConnection.addIceCandidate(cand);
                } catch (error) {
                    console.error(error);
                }
            });
            socket?.emit('offer', conversationId, offer);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const createAnswer = async () => {
        try {
            await getUserMedia()

            audio.pause()
            audio.currentTime = 0
            setRinging(false)

            const rtc_session_description = new RTCSessionDescription(offer)
            await peerConnection?.setRemoteDescription(rtc_session_description)
            let answer = await peerConnection?.createAnswer()
            await peerConnection?.setLocalDescription(answer)
            socket?.emit('answer', conversationId, answer)
        } catch (error) {
            console.error('Error creating answer:', error);
        }
    };

    const cancelMeeting = () => {
        try {
            setRinging(false);
            setOffer(null);

            socket?.emit('reject', conversationId, true);

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        } catch (error) {
            console.error('Error cancle meeting:', error);
        }
    };

    const endMeeting = async () => {
        try {
            socket?.emit('endMeeting', conversationId, true)
            setOffer(null);
            setConnected(false)

            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());

            localVideoRef.current.srcObject = null;
            remoteVideoRef.current.srcObject = null;

            await peerConnection?.setLocalDescription(null)
        } catch (error) {
            console.error('Error ending meeting:', error);
        }
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
                            <NavLink to={"/inbox/gpt"} children={({ isActive }) => <Conversation currentUser={currentUser} conversation={dataConversations} gpt checked={isActive} />} onClick={() => handleSetUserJoinRoom(0)} />
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
                                <Header gptURL={gptURL ? true : false} userInfo={userInfo} handleNavigateProfilePage={handleNavigateProfilePage} createOffer={createOffer} />

                                <Divider flexItem />

                                {/* Message */}
                                <Message
                                    gptURL={gptURL ? true : false}
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
                    <Box flex={1}>
                        {ringing && <Avatar src={LogoPhoneCall} alt='PhoneIcon' />}
                        <div>
                            <h3>Your Video</h3>
                            <video ref={localVideoRef} autoPlay playsInline />
                        </div>
                        <div>
                            <h3>Remote Video</h3>
                            <video ref={remoteVideoRef} autoPlay playsInline />
                        </div>
                        <button onClick={createAnswer} disabled={!ringing}>Answer</button>
                        {ringing && <button onClick={cancelMeeting}>Cancel</button>}
                        {!ringing && <button onClick={endMeeting}>End Meeting</button>}
                    </Box>
                </Paper>
            </Stack >
        </>
    );
}
