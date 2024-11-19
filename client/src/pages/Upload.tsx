import { useState } from 'react';
import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import { IoCloseOutline } from "react-icons/io5";
import UploadModalStepOne from '../components/UploadModalStepOne';
import UploadModalStepTwo from '../components/UploadModalStepTwo';
import UploadModalStepThree from '../components/UploadModalStepThree';
import UploadFilmList from '../components/UploadFilmList';
import ProgressBar from '../components/ProgressBar';
import axios from 'axios'; // Make sure to import axios for API calls
import { useAuth } from '../context/AuthContext';

interface Film {
    title: string;
    description: string;
    thumbnailUrl: string;
    filmUrl: string; // URL or path to the film file
    genre: string;
    series: string;
    duration: number; // Duration in minutes
    rank: number | null;
    votes: number;
    visibility: 'private' | 'unlisted' | 'public';
    uploadedBy: string; // Assuming you handle user authentication and pass the user ID
}

const Upload = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // State for thumbnail URL
    const [series, setSeries] = useState(''); // State for the selected series
    const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false); // State to toggle new series input
    const [genre, setGenre] = useState('');
    const [visibility, setVisibility] = useState<'private' | 'unlisted' | 'public'>('private'); // State for visibility
    const [duration, setDuration] = useState(0); // Duration in minutes
    const [rank, setRank] = useState<number | null>(null); // Rank for the film
    const [votes, setVotes] = useState(0); // Default votes count
    const [filmUrl, setFilmUrl] = useState<string>("");

    const [films, setFilms] = useState<Film[]>([]); // New state to store the list of uploaded films

    const { userId, token } = useAuth();

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
        setVisibility(e.target.value as 'private' | 'unlisted' | 'public');
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(Number(e.target.value));
    };

    const handleRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRank(Number(e.target.value));
    };

    // Submit the form and send data to the backend API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const filmData = {
            title,
            description,
            genre,
            series,
            visibility,
            duration,
            rank: rank ? rank : null, // Set rank to null if not provided
            votes,
            filmUrl,
            thumbnailUrl: thumbnailUrl || '', // Send empty string if no thumbnail URL
            uploadedBy: userId || '', // Replace with actual user ID
        };
    
        console.log("Film data being sent:", filmData);
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/films/upload`,
                filmData, // Send the data as JSON
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Specify that the content is JSON
                    },
                }
            );
    
            console.log('Film uploaded successfully:', response.data);
    
            // Update the films list after submission
            const newFilm: Film = {
                title,
                description,
                thumbnailUrl: thumbnailUrl || '',
                filmUrl,
                genre,
                series,
                duration,
                rank,
                votes,
                visibility,
                uploadedBy: userId || '',
            };
            setFilms([...films, newFilm]);
    
            closeModal(); // Close modal after submission
        } catch (error) {
            console.error('Error uploading film:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <LeftFeedNav />
            <main className="flex-grow container max-w-[60%] mx-auto px-4 py-8">
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl font-semibold'>Creator <span className='text-cornflowerBlue'>Studio</span></h2>
                    <button
                        onClick={openModal}
                        className="bg-cornflowerBlue text-charcoal font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition"
                    >
                        Upload
                    </button>
                </div>
                
                {/* Render the list of films */}
                <UploadFilmList 
                    handleSubmit={handleSubmit}
                />

                {/* Upload Modal */}
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
                            <div className='flex h-[90%] w-full items-center justify-center overflow-y-auto max-h-full'>
                                {/* Modal Content */}
                                {step === 1 ? (
                                    <UploadModalStepOne 
                                        file={file}
                                        handleFileChange={handleFileChange}
                                        handleNext={handleNext}
                                        setFilmUrl={setFilmUrl}
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
                                        setThumbnailUrl={setThumbnailUrl}
                                        handleTitleChange={handleTitleChange}
                                        handleDescriptionChange={handleDescriptionChange}
                                        handleThumbnailChange={handleThumbnailChange}
                                        handleSeriesChange={handleSeriesChange}
                                        handleNewSeriesChange={handleNewSeriesChange}
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
                                        description={description}
                                        genre={genre}
                                        isCreatingNewSeries={isCreatingNewSeries}
                                        series={series}
                                        thumbnail={thumbnail}
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
