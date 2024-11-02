import heroVideo from  "../assets/video/hero-video.mp4.mp4"

const Hero = () => {

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
            <div className="flex items-center justify-center h-full relative z-10"> {/* Ensure it's above the overlay */}
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold drop-shadow-md">Share Your Stories in Minutes</h1> {/* Added drop-shadow */}
                    <p className="mt-4 text-lg drop-shadow-md">Connect with a community of filmmakers and showcase your short films.</p> {/* Added drop-shadow */}
                    <a href="#upload" className="mt-6 inline-block bg-cornflowerBlue hover:bg-steelGray text-white px-6 py-3 rounded">Get Started</a>
                </div>
            </div>
        </section>

    )
}

export default Hero