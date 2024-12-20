import { useEffect, useState } from 'react';
import { Film } from '../types/Film';
import FilmCard from "./FilmCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination  } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import '../styles/swiperStyles.css'; // Import custom styles
import axios from 'axios';
import { useIsMobile } from '@/context/MobileContext';

const Showcase = () => {
    const [topFilms, setTopFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(false);
    const isMobile = useIsMobile();


    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/films/top-films`)
            .then((response) => setTopFilms(response.data))
            .catch((error) => console.error('Error fetching top films:', error))
            .finally(() => setLoading(false));
    }, []);
    return (
        <section className="py-20 bg-charcoal">
            <h2 className="text-6xl font-bold text-center text-crispWhite pb-10">Featured Films</h2>
            <p className="text-center text-lg text-crispWhite pb-6">
                Discover this month's top 10 ranked films, showcasing the best in storytelling and creativity. 
                Explore these incredible short films that have captured the hearts of audiences everywhere.
            </p>
            <div className="mt-8 flex justify-center px-8 relative max-w-[2422px] mx-auto"> {/* Added relative positioning */}
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
                    {topFilms?.map((film: Film, index: number) => (
                        <SwiperSlide key={index}>
                            <FilmCard film={film} index={index} /> {/* Pass film data to FilmCard */}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigation buttons */}
                {isMobile ? (
                        <div className="custom-swiper-pagination bg-darkCharcoal rounded-full mt-4 flex justify-center z-0 gap-2"></div>

                    ) : (
                        <>
                            <button className="custom-swiper-button custom-swiper-button-left absolute left-[-42px] transform -translate-y-1/2 text-4xl">❮</button>
                            <button className="custom-swiper-button custom-swiper-button-right absolute right-[-42px] transform -translate-y-1/2 text-4xl">❯</button>
                        </>
                    )}
            </div>
        </section>
    );
};

export default Showcase;
