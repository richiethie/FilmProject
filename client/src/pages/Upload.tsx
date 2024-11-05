import { useState } from 'react';
import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import { IoCloseOutline } from "react-icons/io5";
import UploadModalStepOne from '../components/UploadModalStepOne';
import UploadModalStepTwo from '../components/UploadModalStepTwo';
import UploadModalStepThree from '../components/UploadModalStepThree';
import ProgressBar from '../components/ProgressBar';

const Upload = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // State for thumbnail URL
    const [series, setSeries] = useState(''); // State for the selected series
    const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false); // State to toggle new series input
    const [genre, setGenre] = useState('');
    const [visibility, setVisibility] = useState('private'); // State for visibility

    const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'new') {
            setIsCreatingNewSeries(true);
        } else {
            setIsCreatingNewSeries(false);
            setSeries(value);
        }
    };

    const handleNewSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeries(e.target.value);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setStep(1); // Reset to step 1 when closing
        setFile(null); // Reset file state
        setThumbnail(null); // Reset thumbnail state
        setThumbnailUrl(null); // Reset thumbnail URL
        setTitle(''); // Reset title state
        setDescription(''); // Reset description state
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setTitle(e.target.files[0].name); // Set default title to file name
        }
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1); // Move to the next step
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1); // Move to the previous step
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedThumbnail = e.target.files[0];
            setThumbnail(selectedThumbnail);
            setThumbnailUrl(URL.createObjectURL(selectedThumbnail)); // Create URL for thumbnail
        }
    };

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisibility(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to handle final submission
        console.log({ file, title, description, thumbnail, visibility });
        closeModal(); // Close modal after submission
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <LeftFeedNav />
            <main className="flex-grow container max-w-[60%] mx-auto px-4 py-8">
                <button
                    onClick={openModal}
                    className="bg-cornflowerBlue text-charcoal font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition"
                >
                    Upload
                </button>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-charcoal rounded-lg p-8 w-[30%] h-[80%] shadow-lg relative">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-steelGray">
                                <h2 className="text-2xl font-bold">
                                    {step === 1 ? "Upload your film" : title || "Set Details"}
                                </h2>
                                <IoCloseOutline
                                    onClick={closeModal}
                                    className="text-crispWhite text-3xl hover:text-cornflowerBlue cursor-pointer transition"
                                />
                            </div>
                            {/* Progress Bar */}
                            <div className='flex justify-center'>
                                <ProgressBar 
                                    currentStep={step} 
                                    totalSteps={3} 
                                    stepTitles={['Upload File', 'Set Details', 'Visibility']}
                                />
                            </div>
                            <div className='flex h-[90%] w-full items-center justify-center'>
                                {/* Modal Content */}
                                {step === 1 ? (
                                    <UploadModalStepOne 
                                        file={file}
                                        handleFileChange={handleFileChange}
                                        handleNext={handleNext}
                                    />
                                ) : step === 2 ? (
                                    <UploadModalStepTwo 
                                        title={title}
                                        description={description}
                                        thumbnail={thumbnail}
                                        thumbnailUrl={thumbnailUrl}
                                        series={series}
                                        isCreatingNewSeries={isCreatingNewSeries}
                                        genre={genre}
                                        setGenre={setGenre}
                                        handleTitleChange={handleTitleChange}
                                        handleDescriptionChange={handleDescriptionChange}
                                        handleThumbnailChange={handleThumbnailChange}
                                        handleSeriesChange={handleSeriesChange}
                                        handleNewSeriesChange={handleNewSeriesChange}
                                        handleSubmit={handleSubmit}
                                        handlePrevious={handlePrevious}
                                        handleNext={handleNext}
                                    />
                                )  : (
                                    <UploadModalStepThree 
                                        visibility={visibility}
                                        handleVisibilityChange={handleVisibilityChange}
                                        handlePrevious={handlePrevious}
                                        handleSubmit={handleSubmit}
                                        thumbnailUrl={thumbnailUrl}
                                        title={title}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Upload;
