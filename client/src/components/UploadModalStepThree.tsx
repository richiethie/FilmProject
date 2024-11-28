import React from 'react';

interface UploadModalStepThreeProps {
    visibility: string; // State for visibility
    title: string;
    description: string;
    genre: string;
    thumbnail: File | null;
    thumbnailUrl: string | null;
    series: string;
    isCreatingNewSeries: boolean;
    handleVisibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle visibility change
    handlePrevious: () => void; // Function to handle going back to the previous step
    handleSubmit: (e: React.FormEvent) => void; // Function to handle final submission
}

const UploadModalStepThree = (props: UploadModalStepThreeProps) => {
    const {
        visibility,
        title,
        thumbnailUrl,
        handleVisibilityChange,
        handlePrevious,
        handleSubmit,
    } = props;


    return (
        // Step 3: Set Visibility
        <div className="space-y-6 flex w-full h-full mx-4 mt-4">
            <div className="w-full">
                {/* Visibility Options */}
                <h2 className="text-xl font-semibold text-crispWhite mt-4">Visibility</h2>
                <div className="w-full mr-6 flex justify-between space-x-8">
                    <div className="flex flex-col">
                        <p className="text-sm text-steelGray my-2">Set your film's visibility:</p>
                        <div className="flex flex-col border border-steelGray p-6 rounded-lg items-start space-y-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="private"
                                    checked={visibility === 'private'}
                                    onChange={handleVisibilityChange}
                                    className="mr-2 appearance-none w-5 h-5 p-2 rounded-full border-2 border-crispWhite bg-charcoal checked:bg-cornflowerBlue focus:ring-0 transition-all"
                                />
                                <div className="flex flex-col">
                                    Private
                                    <p className="text-xs text-steelGray">Only you can view this film.</p>
                                </div>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="unlisted"
                                    checked={visibility === 'unlisted'}
                                    onChange={handleVisibilityChange}
                                    className="mr-2 appearance-none w-5 h-5 p-2 rounded-full border-2 border-crispWhite bg-charcoal checked:bg-cornflowerBlue focus:ring-0 transition-all"
                                />
                                <div className="flex flex-col">
                                    Unlisted
                                    <p className="text-xs text-steelGray">Only people with the link can view this film.</p>
                                </div>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="public"
                                    checked={visibility === 'public'}
                                    onChange={handleVisibilityChange}
                                    className="mr-2 appearance-none w-5 h-5 p-2 rounded-full border-2 border-crispWhite bg-charcoal checked:bg-cornflowerBlue focus:ring-0 transition-all"
                                />
                                <div className="flex flex-col">
                                    Public
                                    <p className="text-xs text-steelGray">Anyone can view this film.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Display thumbnail image below */}
                    {thumbnailUrl && (
                        <div className="mt-2 w-[60%] overflow-hidden">
                            <p className="text-sm text-steelGray mb-2 ml-1">Preview</p>
                            <img
                                src={thumbnailUrl}
                                alt="Selected Thumbnail"
                                className="aspect-w-16 aspect-h-9 object-cover rounded-lg shadow-lg w-full"
                            />
                            <div className="m-1">
                                <h4>{title}</h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-5 right-5 flex gap-4">
                <button
                    onClick={handlePrevious}
                    className="bg-gray-600 text-crispWhite font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                >
                    Previous
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-cornflowerBlue text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default UploadModalStepThree;
