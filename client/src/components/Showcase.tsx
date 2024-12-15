import FilmCard from "./FilmCard";
import { films, Film } from "../data/home";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination  } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import '../styles/swiperStyles.css'; // Import custom styles

const Showcase = () => {
    return (
        <section className="py-20 bg-charcoal">
            <h2 className="text-6xl font-bold text-center text-crispWhite pb-10">Featured Films</h2>
            <p className="text-center text-lg text-crispWhite pb-6">
                Discover this month's top 10 ranked films, showcasing the best in storytelling and creativity. 
                Explore these incredible short films that have captured the hearts of audiences everywhere.
            </p>
            <div className="mt-8 flex justify-center px-8 relative max-w-[1422px] mx-auto"> {/* Added relative positioning */}
                <Swiper
                    modules={[Navigation, Pagination]} // Pass the modules to the Swiper component
                    navigation={{
                        nextEl: '.custom-swiper-button-right', // Reference your custom button
                        prevEl: '.custom-swiper-button-left', // Reference your custom button
                    }}
                    pagination={{ clickable: true, el: '.custom-swiper-pagination', dynamicBullets: true, }}
                    spaceBetween={30}
                    slidesPerView={1} // Change this number to adjust how many cards are visible at once
                >
                    {films.map((film: Film, index: number) => (
                        <SwiperSlide key={index}>
                            <FilmCard film={film} /> {/* Pass film data to FilmCard */}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom navigation buttons */}
                <button className="custom-swiper-button custom-swiper-button-left absolute left-[-10px] transform -translate-y-1/2 text-4xl">❮</button>
                <button className="custom-swiper-button custom-swiper-button-right absolute right-[-10px] transform -translate-y-1/2 text-4xl">❯</button>
                <div className="custom-swiper-pagination absolute bottom-0 w-full text-center mt-4"></div>
            </div>
        </section>
    );
};

export default Showcase;
