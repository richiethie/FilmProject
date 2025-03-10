import { useIsMobile } from "@/context/MobileContext";
import heroVideo from  "../assets/video/hero-video.mp4.mp4"
import { Link } from 'react-router-dom';

const Hero = () => {
    const isMobile = useIsMobile();

    return (
        <section className="relative h-screen overflow-hidden">
            <video
                className="absolute top-0 left-0 object-cover w-full h-full"
                autoPlay
                loop
                muted
                playsInline
                src={heroVideo} // Make sure this imports correctly
            >
                Your browser does not support the video tag.
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" /> {/* Darker overlay */}
            <div className="flex flex-col items-center justify-center h-full relative z-10" style={{ boxShadow: '0 35px 35px rgba(0, 0, 0, 0.6) inset' }}> {/* Ensure it's above the overlay */}
                <div className="text-center text-crispWhite px-4">
                    <h3 className={`my-2 ${isMobile ? ("text-md") : ("text-xl")} font-semibold drop-shadow-md text-cornflowerBlue`}>Join a vibrant community of filmmakers!</h3> {/* Subtitle */}
                    <h1 className={`${isMobile ? ("text-xl") : ("text-5xl")} font-black drop-shadow-md`}>Share Your Stories in Minutes</h1> {/* Main heading */}
                    <p className={`${isMobile ? ("text-sm mb-4 mt-2") : ("my-6 text-lg")} drop-shadow-md`}>Connect with a community of filmmakers and showcase your short films. Whether you're a seasoned pro or a passionate newcomer, we provide the platform you need.</p> {/* Additional description */}
                    <Link to="/signup" className={`bg-cornflowerBlue hover:bg-steelGray ${isMobile ? ("px-3 py-1 text-sm") : ("px-4 py-2")} rounded`}>
                        Get Started
                    </Link>
                </div>
            </div>
        </section>

    )
}

export default Hero