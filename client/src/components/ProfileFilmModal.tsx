import { IoMdClose } from 'react-icons/io';
import { Film } from '../types/Film';

interface ProfileFilmModalProps {
  selectedFilm: Film | null;
  closeFilmModal: () => void;
}

const ProfileFilmModal= (props: ProfileFilmModalProps) => {

    const { selectedFilm, closeFilmModal } = props

    if (!selectedFilm) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-charcoal p-6 rounded-lg max-w-5xl w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{selectedFilm.title}</h2>
                    <button
                        onClick={closeFilmModal}
                        className="text-white text-2xl hover:text-cornflowerBlue"
                    >
                        <IoMdClose />
                    </button>
                </div>
                <video className="w-full my-4" controls>
                <source src={selectedFilm.filmUrl} type="video/mp4" />
                Your browser does not support the video tag.
                </video>
                <p className="text-sm text-gray-400">By {selectedFilm.uploadedBy.username}</p>
                <p className="mt-4">{selectedFilm.description || 'No description available'}</p>
                <div className="mt-4">
                    <p>
                        <strong>Votes: </strong>{selectedFilm.votes.length}
                    </p>
                    <p>
                        <strong>Rank: </strong>{selectedFilm.rank || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileFilmModal;


