import ReactPlayer from 'react-player';
import React, { useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
    filmUrl: string;
    thumbnailUrl: string;
    videoHeight: number;
}

const VideoPlayer = ({ filmUrl, thumbnailUrl }: VideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(true); // Track playback state

    const handleVideoClick = () => {
        setIsPlaying((prev) => !prev); // Toggle playback state
    };

    return (
        <div className="relative mb-2" >
            {/* Sticky Container */}
            <div className="sticky top-0 bg-charcoal">
                <div className="w-full aspect-video" onClick={handleVideoClick}>
                    <ReactPlayer
                        url={filmUrl}
                        
                        controls={true}
                        width="100%"
                        height="100%"
                        playing={true}
                        // light={thumbnailUrl} // Use the thumbnail URL
                        config={{
                            file: { attributes: { playsInline: true } },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
