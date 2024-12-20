import { FaPlay } from "react-icons/fa";
import { Film } from '../types/Film';
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/context/MobileContext";

interface FilmCardProps {
    film: Film
    index: number
}

const FilmCard = (props: FilmCardProps) => {
    const { film, index } = props

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    return (
        <div className="relative group cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
            {/* Rank Number */}
            <span className={`absolute top-2 left-2 ${isMobile ? ("text-[100px]") : ("text-[150px]")} font-extrabold text-gray-800 opacity-60 z-30 drop-shadow-lg leading-none pointer-events-none text-outline-white`}>
                {index + 1}
            </span>

            {/* Gradient Shadow at Bottom Left */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t rounded-lg from-black via-black/60 to-transparent z-30 pointer-events-none"></div>

            {/* Film Thumbnail */}
            <img
                src={film.thumbnailUrl}
                alt={film.title}
                className={`w-full ${isMobile ? ("h-[220px]") : ("h-[500px]")} object-cover rounded-lg`}
            />

            {/* Play Button Overlay */}
            {!isMobile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="text-crispWhite text-4xl">
                        <FaPlay />
                    </button>
                </div>
            )}

            {/* Text at Bottom Left */}
            <div className="absolute bottom-4 left-4 z-30">
                <h3 className="text-xl font-bold text-crispWhite">{film.title}</h3>
                <p className="text-sm text-gray-300">Votes: {film.votes.length}</p>
                <p className="text-sm text-gray-300">
                    by <span className="text-mintGreen">{film.uploadedBy.username}</span>
                </p>
            </div>
        </div>
    );
};

export default FilmCard;
