import MoonLoader from "react-spinners/MoonLoader";

const Loading = () => {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen bg-charcoal">
            <div className="flex items-center justify-center">
                <MoonLoader 
                    size={120}
                    color="#4f76f6"
                    speedMultiplier={0.4}
                />
                <p className="absolute text-crispWhite text-lg font-bold">
                    Film<span className="text-cornflowerBlue">Share</span>
                </p>
            </div>
        </div>
    );
};

export default Loading;
