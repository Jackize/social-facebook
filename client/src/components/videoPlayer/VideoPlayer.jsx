import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, key }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;

    }, [stream])
    return (
        <video key={key} style={{ width: '100px', height: '100px' }} ref={videoRef} autoPlay muted={true} />
    )
}

export default VideoPlayer