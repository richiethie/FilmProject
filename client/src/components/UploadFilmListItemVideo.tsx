import { IoClose } from "react-icons/io5";

interface Film {
    title: string;
    description: string;
    thumbnailUrl: string;
    filmUrl: string;
    genre: string;
    series: string;
    duration: number;
    rank: number | null;
    votes: number;
    visibility: "private" | "unlisted" | "public";
    uploadedBy: string;
  }
  
  interface UploadFilmListItemVideoProps {
    selectedFilm: Film;
    isModalOpen: boolean;
    closeModal: () => void;
  }
  
  const UploadFilmListItemVideo = ({
    selectedFilm,
    isModalOpen,
    closeModal,
  }: UploadFilmListItemVideoProps) => {
    if (!isModalOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div className="bg-[#19222b] rounded-md p-6 max-w-5xl w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                    {selectedFilm.title}
                </h2>
                <IoClose className="text-3xl hover:text-cornflowerBlue cursor-pointer" onClick={closeModal}/>
            </div>
            <video
                controls
                autoPlay
                className="w-full rounded-md mb-4"
            >
                <source src={selectedFilm.filmUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gray-300 mb-2">
                <strong>Description:</strong> {selectedFilm.description}
            </p>
            <p className="text-sm text-gray-300 mb-2">
                <strong>Genre:</strong> {selectedFilm.genre}
            </p>
            <p className="text-sm text-gray-300 mb-2">
                <strong>Duration:</strong> {selectedFilm.duration} minutes
            </p>
            <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-cornflowerBlue text-white rounded-md"
            >
                Close
            </button>
        </div>
      </div>
    );
  };
  
  export default UploadFilmListItemVideo;
  