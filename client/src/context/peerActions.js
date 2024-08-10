export const ADD_PEER_STREAM = 'ADD_PEER_STREAM';
export const REMOVE_PEER_STREAM = 'REMOVE_PEER_STREAM';
export const ADD_PEER_NAME = 'ADD_PEER_NAME';
export const ADD_ALL_PEERS = 'ADD_ALL_PEERS';

export const addPeerAction = (peerId, stream) => ({
    type: ADD_PEER_STREAM,
    payload: { peerId, stream },
});

export const removePeerAction = (peerId) => ({
    type: REMOVE_PEER_STREAM,
    payload: { peerId },
});