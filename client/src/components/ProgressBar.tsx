
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
}

const ProgressBar = (props: ProgressBarProps) => {
    const { currentStep, totalSteps, stepTitles } = props

    return (
        <div className="relative w-[90%] mt-12 mb-4">
            {/* Progress Bar Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-steelGray rounded-full"></div>

            {/* Dots and Titles for each step */}
            {[...Array(totalSteps)].map((_, index) => (
                <div key={index} className="relative">
                    <div
                        className={`absolute w-5 h-5 rounded-full border-2 transition-all duration-300
                            ${index < currentStep ? 'bg-white' : 'bg-charcoal border-white'}`}
                        style={{
                            left: `${index * (100 / (totalSteps - 1))}%`,
                            top: 'calc(50% - 12px)', // Adjust this value to position the dots above the line
                            transform: 'translateX(-50%)' // Center the dot horizontally
                        }}
                    />
                    <span
                        className={`absolute text-xs ${(index + 1) == currentStep ? "text-crispWhite font-semibold" : "text-steelGray"}`}
                        style={{
                            left: `${index * (100 / (totalSteps - 1))}%`,
                            top: 'calc(50% - 30px)', // Position the title above the dot
                            transform: 'translateX(-50%)' // Center the title horizontally
                        }}
                    >
                        {stepTitles[index]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
