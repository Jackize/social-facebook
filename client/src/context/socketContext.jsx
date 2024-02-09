import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { SOCKET_SERVER } from "../utils/config";

export const SocketContext = createContext();
let socket = io(SOCKET_SERVER, {
    transports: ["websocket"],
});

const configuration = {
    iceServers: [
        {
            urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        },
    ],
    iceCandidatePoolSize: 10,
}

export default function SocketContextProider({ children }) {
    const [pc, setPc] = useState(new RTCPeerConnection(configuration));
    const [conversationId, setConversationId] = useState(0)
    const [offer, setOffer] = useState(null)
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [calling, setCalling] = useState(false)
    const [ringing, setRinging] = useState(false);
    const [audio, setAudio] = useState(new Audio('/phone.wav'));

    const myVideo = useRef(null)
    const userVideo = useRef(null)

    const getUserMedia = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            myVideo.current.srcObject = localStream
            localStream.getTracks().forEach((track) => {
                pc?.addTrack(track, localStream)
            })
        } catch (error) {
            console.error('Counld not get user media', error)
        }
    }

    const createOffer = async (conversationId) => {
        try {
            setConversationId(conversationId)
            setCalling(true)
            setCallAccepted(false)
            await getUserMedia()
            let offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket?.on('ice-candidate', async (cand) => {
                await pc.addIceCandidate(cand);
            });
            socket?.emit('offer', conversationId, offer);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const createAnswer = async (conversationId) => {
        try {
            setCalling(true)
            setConversationId(conversationId)
            setCallAccepted(true)
            await getUserMedia()
            audio.pause()
            audio.currentTime = 0
            setRinging(false)

            const rtc_session_description = new RTCSessionDescription(offer)
            await pc?.setRemoteDescription(rtc_session_description)
            let answer = await pc?.createAnswer()
            await pc?.setLocalDescription(answer)
            socket?.emit('answer', conversationId, answer)
        } catch (error) {
            console.error('Error creating answer:', error);
        }
    };

    const rejectMeeting = (conversationId) => {
        try {
            setConversationId(conversationId)
            setCallEnded(true)
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

    const endMeeting = async (conversationId) => {
        try {
            setConversationId(conversationId)
            setCallEnded(true)
            socket?.emit('endMeeting', conversationId, true)
            setOffer(null);

            myVideo.current.srcObject.getTracks().forEach(track => track.stop());
            userVideo.current.srcObject.getTracks().forEach(track => track.stop());

            myVideo.current.srcObject = null;
            userVideo.current.srcObject = null;

            await pc?.setLocalDescription(null)
        } catch (error) {
            console.error('Error ending meeting:', error);
        }
    }
    return (
        <SocketContext.Provider value={{ pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocketContext = () => {
    const { pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio } = useContext(SocketContext);
    return { pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio };
};