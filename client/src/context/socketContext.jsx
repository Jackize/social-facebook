import Peer from 'peerjs';
import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { socket } from "../redux/socketSlice";
import { PEER_SERVER_HOST, PEER_SERVER_PORT } from '../utils/config';
import { addPeerAction, removePeerAction } from './peerActions';
import { peersReducer } from './peerReducer';
export const SocketContext = createContext();

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
    const [peer, setpeer] = useState()
    const [peerId2, setpeerId2] = useState()
    const [stream, setStream] = useState()
    const { user } = useSelector((state) => state.user);
    const [peers, dispatch] = useReducer(peersReducer, {})
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
    useEffect(() => {
        const peer = new Peer(uuid(), {
            host: PEER_SERVER_HOST,
            port: PEER_SERVER_PORT,
            path: '/'
        })
        peer.on('open', (id) => {
            console.log(`Connected to PeerServer with ID: ${id}`);
        });
        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });
        setpeer(peer)

        socket.on('call', ({ conversationId, peerId }) => {
            console.log("🚀 ~ socket.on ~ { conversationId, peerId }:", { conversationId, peerId })
            setRinging(true);
            audio.play();
            setpeerId2(peerId)
        })
    }, [])

    useEffect(() => {
        if (!stream || !peer) return

        socket.on('user-disconnected', (peerId) => {
            dispatch(removePeerAction(peerId))
        })
        
        // listen income call
        peer.on('call', (call) => {
            // answer call with stream
            call.answer(stream)
            call.on('stream', (remoteStream) => {
                console.log("🚀 ~ call.on ~ remoteStream:", remoteStream)
                dispatch(addPeerAction(call.peer, remoteStream))
            })
        })
    }, [stream, peer])
    console.log('peers:', peers)

    const getUserMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
            throw error;
        }
    }

    const createOffer = async (conversationId) => {
        console.log("🚀 ~ createOffer ~ conversationId:", conversationId)
        await getUserMedia();
        setConversationId(conversationId);
        setCalling(true);
        setCallAccepted(false);

        try {
            // send conversationId, peerId, userId of user1 to user2
            socket.emit('offer', { conversationId, peerId: peer._id ?? peer._lastServerId, userId: user.id });
        } catch (error) {
            console.error('Error creating offer:', error);
        }

    };

    const createAnswer = async (conversationId) => {
        const localStream = await getUserMedia();
        setConversationId(conversationId);
        setCalling(true);
        setCallAccepted(true);
        setRinging(false);
        audio.pause();
        audio.currentTime = 0;
        try {
            const call = peer.call(peerId2, localStream)
            call.on('stream', (remoteStream) => {
                dispatch(addPeerAction(peerId2, remoteStream))
            })
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
        <SocketContext.Provider value={{ peer, peers, stream, pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocketContext = () => {
    const { pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio, peer, stream, peers } = useContext(SocketContext);
    return { pc, socket, myVideo, userVideo, callAccepted, callEnded, calling, ringing, conversationId, createOffer, createAnswer, rejectMeeting, endMeeting, setRinging, setOffer, setCalling, setConversationId, audio, peer, stream, peers };
};