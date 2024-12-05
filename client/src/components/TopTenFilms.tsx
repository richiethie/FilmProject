import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Film } from '../types/Film';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination  } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import '../styles/swiperStyles.css'; // Import custom style
import ProfileLink from './ProfileLink';

const TopTenFilms = () => {
    const [topFilms, setTopFilms] = useState<Film[] | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/films/top-films`)
            .then((response) => {
                setTopFilms(response.data);
            })
            .catch((error) => console.error('Error fetching top films:', error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="my-12">
            <h2 className="text-4xl font-bold mb-6 text-center">Top 10 Films</h2>
            {loading ? (
                <p className="text-center">Loading top films...</p>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={3}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="h-auto"
                >
                    {topFilms?.map((film, index) => (
                        <SwiperSlide key={film._id}>
                            <div
                                className="bg-charcoal rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                onClick={() => navigate(`/films/${film._id}`)}
                            >
                                <div className="relative group">
                                    <img
                                        src={film.thumbnailUrl}
                                        alt={film.title}
                                        className="aspect-w-16 aspect-h-9 w-full object-cover rounded-t-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="text-crispWhite text-3xl">
                                            <FaPlay />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold">{film.title}</h3>
                                        <span className="text-cornflowerBlue text-lg font-semibold">#{index + 1}</span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Votes: {film.votes.length}
                                    </p>
                                    <p className="text-sm text-gray-500">by <ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} /></p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
};

export default TopTenFilms;
