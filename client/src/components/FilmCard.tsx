import { FaPlay } from "react-icons/fa";

interface FilmCardProps {
    film: {
        title: string;
        creator: string;
        thumbnail: string;
        genre: string;
        rank: number;
    };
}

const FilmCard = (props: FilmCardProps) => {
    const { film } = props
    return (
        <div className="overflow-hidden flex flex-col"> {/* Add relative and group for hover */}
            <div className="aspect-[16/9] max-h-[800px] relative group rounded-lg"> {/* Ensure this div also has rounded corners */}
                <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover shadow-md rounded" /> {/* Changed to object-cover for better fitting */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 rounded" /> {/* Dark overlay */}
                <button className="absolute inset-0 flex items-center justify-center text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"> {/* Play button */}
                    <FaPlay className="h-28" />
                </button>
            </div>
            <div className="flex flex-col items-start p-4">
                <div className="flex flex-row justify-between items-center w-full">
                    <h3 className="font-bold text-crispWhite">{film.title}</h3>
                    <h3 className="font-bold text-steelGray">{film.genre}</h3>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                    <p className="text-crispWhite">by <span className="text-mintGreen">{film.creator}</span></p>
                    <p className="text-cornflowerBlue">RANK #{film.rank}</p>
                </div>
            </div>
        </div>
    );
};

export default FilmCard;
