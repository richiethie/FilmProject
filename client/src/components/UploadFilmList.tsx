import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEllipsisV, FaPlay } from "react-icons/fa";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import UploadFilmListItemVideo from "./UploadFilmListItemVideo";
import { Film } from "../types/Film";

interface UploadFilmListProps {
    handleSubmit: (e: React.FormEvent) => void; // Function to handle final submission
    filmUploaded: boolean;
    setFilmUploaded: (filmUploaded: boolean) => void;
}

const UploadFilmList = (props: UploadFilmListProps) => {

    const {handleSubmit, filmUploaded, setFilmUploaded} = props

    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId, token } = useAuth();

    // Modal state
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dropdown menu state
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchFilms = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/films/user/${userId}`
            );
            setFilms(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
        };

        fetchFilms();
        if (filmUploaded) {
            setFilmUploaded(false);
        }
    }, [userId, filmUploaded]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setMenuVisible(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = (film: Film) => {
        setSelectedFilm(film);
        setMenuVisible(!menuVisible);
    };

    const handleThumbnailClick = (film: Film) => {
        console.log("Opening modal for film:", film);
        setSelectedFilm(film);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleDeleteFilm = async (film: Film) => {
        const filmId = film._id
        try {
            setLoading(true);
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/films/delete/${filmId}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`, // Include token in the header
                    },
                }
            );
            console.log(response.data)
            console.log(film.title, " has been deleted")
            setFilms((prevFilms) => prevFilms.filter((f) => f._id !== filmId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }

        
    }

    if (loading) return <p>Loading films...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="mt-8">
        {films.map((film, index) => (
            <div key={index} className="flex items-center border-b border-steelGray p-4 mb-4">
            <div className="relative h-full">
                <div className="relative group mr-4" onClick={() => handleThumbnailClick(film)}>
                <img
                    src={film.thumbnailUrl}
                    alt={film.title}
                    className="aspect-w-16 aspect-h-9 max-h-24 object-cover rounded-md cursor-pointer"
                />
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-md">
                    <FaPlay className="text-white text-3xl" />
                </div>
                </div>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg">{film.title}</h3>
                <p className="text-sm text-gray-400">Genre: {film.genre}</p>
                <p className="text-sm text-gray-400">Series: {film.series}</p>
                <p className="text-sm text-gray-400 capitalize">{film.visibility}</p>
            </div>
            <div className="relative">
                <button
                ref={buttonRef}
                onClick={() => handleMenuClick(film)}
                className="text-gray-400 hover:text-gray-600"
                >
                <FaEllipsisV size={20} />
                </button>
                {menuVisible && selectedFilm?.title === film.title && (
                <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 bg-[#19222b] shadow-lg rounded-md w-40 z-20"
                >
                    <ul className="py-2 text-xl">
                    <li
                        onClick={() => console.log("Schedule", film)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#212c38] flex items-center"
                    >
                        <FaCalendarAlt className="text-lg mr-2" />
                        Schedule
                    </li>
                    <li
                        onClick={() => console.log("Edit", film.title)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#212c38] flex items-center"
                    >
                        <MdEdit className="text-xl mr-2" />
                        Edit
                    </li>
                    <li
                        onClick={() => handleDeleteFilm(film)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#212c38] flex items-center"
                    >
                        <MdDeleteOutline className="text-red-500 text-xl mr-2" />
                        Delete
                    </li>
                    </ul>
                </div>
                )}
            </div>
            </div>
        ))}

        {/* Modal */}
        {isModalOpen && selectedFilm && (
            <UploadFilmListItemVideo 
            selectedFilm={selectedFilm} 
            isModalOpen={isModalOpen} 
            closeModal={closeModal} 
            />
        )}
        </div>
    );
};

export default UploadFilmList;
