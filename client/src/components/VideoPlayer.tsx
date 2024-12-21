import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    filmUrl: string;
    thumbnailUrl: string;
}

const VideoPlayer = ({ filmUrl, thumbnailUrl }: VideoPlayerProps) => (
    <div className="relative mb-2">
        {/* Sticky Container */}
        <div className="sticky top-0 bg-charcoal">
            <div className="w-full aspect-video">
                <ReactPlayer
                    url={filmUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    light={thumbnailUrl} // Use the thumbnail URL
                    config={{
                        file: { attributes: { playsInline: true } },
                    }}
                />
            </div>
        </div>
    </div>
);

export default VideoPlayer;
