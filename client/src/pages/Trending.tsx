import { useIsMobile } from "@/context/MobileContext";
import { Film } from "@/types/Film";
import { Box, Button, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { FaPlay } from "react-icons/fa";
import ProfileLink from "@/components/ProfileLink";
import FeedHeader from "@/components/FeedHeader";
import Footer from "@/components/Footer";

const Trending = () => {
    const [topFilmsByGenre, setTopFilmsByGenre] = useState<
        { genre: string; topFilms: Film[] }[] | null
    >(null);
    const [topTenFilms, setTopTenFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        setLoading(true);
    
        axios
          .all([
            axios.get(`${import.meta.env.VITE_API_URL}/api/films/top-films-by-genre`),
            axios.get(`${import.meta.env.VITE_API_URL}/api/films/top-films`),
          ])
          .then(
            axios.spread((response1, response2) => {
              setTopFilmsByGenre(response1.data);
              setTopTenFilms(response2.data);
            })
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    useEffect(() => {
        if (topFilmsByGenre) {
          const hash = window.location.hash;
          if (hash) {
            const element = document.getElementById(hash.replace("#", ""));
            if (element) {
              const offset = 65; // Adjust to match your header's height
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
              });
            }
          }
        }
      }, [topFilmsByGenre]);
      

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <FeedHeader />
            <div className="mx-4 my-6">
                <h2 className="text-2xl font-semibold mb-4 border-b border-steelGray pb-2">Top Ten Films 🔥</h2>
                <Box
                    overflowX="scroll"
                    scrollbar="hidden"
                    display="flex"
                    scrollSnapType="x mandatory"
                    px={2}
                    className="overflow-hidden"
                >
                    <HStack as="ul" align="flex-start">
                        {topTenFilms?.map((film, index) => (
                            <div
                                key={film._id}
                                className={`relative group cursor-pointer flex-shrink-0 w-72`}
                                onClick={() => navigate(`/films/${film._id}`)}
                            >
                                {/* Rank Number */}
                                <span className="absolute top-2 left-2 text-[80px] font-extrabold text-gray-800 opacity-60 z-30 drop-shadow-lg leading-none pointer-events-none text-outline-white">
                                    {index + 1}
                                </span>

                                {/* Gradient Shadow at Bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t rounded-lg from-black via-black/60 to-transparent z-30 pointer-events-none"></div>

                                {/* Film Thumbnail */}
                                <img
                                    src={film.thumbnailUrl}
                                    alt={film.title}
                                    className="w-full object-cover h-[180px] rounded-lg shadow-lg"
                                />

                                {/* Text at Bottom Left */}
                                <div className="absolute bottom-4 left-4 z-30">
                                    <h3 className="text-xl font-bold text-crispWhite">
                                        {film.title}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Votes: {film.votes.length}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        by{" "}
                                        <ProfileLink
                                            username={film.uploadedBy.username}
                                            userId={film.uploadedBy._id}
                                        />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </HStack>
                </Box>
                <h2 className="text-xl font-semibold my-4 border-b border-steelGray pb-2">Trending Films by Genre</h2>
                {topFilmsByGenre?.map(({ genre, topFilms }) => (
                    <div key={genre} className="mb-8">
                        <h2 id={genre.toLocaleLowerCase()} className="text-lg font-semibold mb-2">{genre}</h2>
                        <Box
                            overflowX="scroll"
                            scrollbar="hidden"
                            display="flex"
                            scrollSnapType="x mandatory"
                            px={2}
                            className="overflow-hidden"
                        >
                            <HStack as="ul" align="flex-start">
                                {topFilms.map((film, index) => (
                                    <div
                                        key={film._id}
                                        className={`relative group cursor-pointer flex-shrink-0 w-72`}
                                        onClick={() => navigate(`/films/${film._id}`)}
                                    >
                                        {/* Rank Number */}
                                        <span className="absolute top-2 left-2 text-[80px] font-extrabold text-gray-800 opacity-60 z-30 drop-shadow-lg leading-none pointer-events-none text-outline-white">
                                            {index + 1}
                                        </span>
    
                                        {/* Gradient Shadow at Bottom */}
                                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t rounded-lg from-black via-black/60 to-transparent z-30 pointer-events-none"></div>
    
                                        {/* Film Thumbnail */}
                                        <img
                                            src={film.thumbnailUrl}
                                            alt={film.title}
                                            className="w-full object-cover h-[180px] rounded-lg shadow-lg"
                                        />
    
                                        {/* Text at Bottom Left */}
                                        <div className="absolute bottom-4 left-4 z-30">
                                            <h3 className="text-xl font-bold text-crispWhite">
                                                {film.title}
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                Votes: {film.votes.length}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                by{" "}
                                                <ProfileLink
                                                    username={film.uploadedBy.username}
                                                    userId={film.uploadedBy._id}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </HStack>
                        </Box>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
    
};

export default Trending;
