import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Film } from '../types/Film';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import '../styles/swiperStyles.css';
import ProfileLink from './ProfileLink';
import { useIsMobile } from '@/context/MobileContext';

const TopTenFilms = () => {
    const [topFilms, setTopFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/films/top-films`)
            .then((response) => setTopFilms(response.data))
            .catch((error) => console.error('Error fetching top films:', error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="my-12">
            <h2 className={` font-bold mb-6 ${isMobile ? ("ml-2 text-xl") : ("text-4xl")}`}>Top 10 Films</h2>
            {loading ? (
                <p className="text-center">Loading top films...</p>
            ) : (
                <div className='relative'>
                    <Swiper
                        modules={[Navigation, Pagination]} // Include Pagination module
                        navigation={
                            !isMobile
                                ? {
                                    nextEl: '.custom-swiper-button-right', // Reference your custom button
                                    prevEl: '.custom-swiper-button-left', // Reference your custom button
                                }
                                : false
                        }
                        pagination={
                            isMobile
                                ? {
                                    clickable: true, // Make pagination dots clickable
                                    dynamicBullets: true,
                                    renderBullet: (index, className) => {
                                        return `<span class="${className} custom-bullet">${index + 1}</span>`; // Render custom bullets
                                    },
                                    
                                }
                                : false
                        }
                        spaceBetween={10}
                        slidesPerView={isMobile ? 1 : 3}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        className="h-auto"
                    >
                        {topFilms?.map((film, index) => (
                            <SwiperSlide key={film._id}>
                                <div className="relative group cursor-pointer" onClick={() => navigate(`/films/${film._id}`)}>
                                    {/* Rank Number */}
                                    <span className="absolute top-2 left-2 text-[150px] font-extrabold text-gray-800 opacity-60 z-30 drop-shadow-lg leading-none pointer-events-none text-outline-white">
                                        {index + 1}
                                    </span>
    
                                    {/* Gradient Shadow at Bottom Left */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${isMobile ? ("") : ("rounded-lg")} from-black via-black/60 to-transparent z-30 pointer-events-none`}></div>
    
                                    {/* Film Thumbnail */}
                                    <img
                                        src={film.thumbnailUrl}
                                        alt={film.title}
                                        className={`w-full  object-cover ${isMobile ? ("h-[260px]") : ("rounded-lg h-[300px]")}`}
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
                                        <p className="text-sm text-gray-400">
                                            by <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} />
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {isMobile ? (
                        <div className="custom-swiper-pagination bg-darkCharcoal rounded-full mt-4 flex justify-center z-0 gap-2"></div>

                    ) : (
                        <>
                            <button className="custom-swiper-button custom-swiper-button-left absolute left-[-42px] transform -translate-y-1/2 text-4xl">❮</button>
                            <button className="custom-swiper-button custom-swiper-button-right absolute right-[-42px] transform -translate-y-1/2 text-4xl">❯</button>
                        </>
                    )}
                </div>
            )}
        </section>
    );
};

export default TopTenFilms;
