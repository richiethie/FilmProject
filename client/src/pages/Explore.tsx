import { useState } from 'react';
import { FaSearch, FaRegComment } from 'react-icons/fa';
import { FiSend } from "react-icons/fi";
import { BiUpvote, BiSolidUpvote  } from "react-icons/bi";
import Footer from '../components/Footer';
import { recommendedFilms, categories } from '../data/home';
import CategoryPills from '../components/CategoryPills';
import LeftFeedNav from '../components/LeftFeedNav';

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const [pressed, setPressed] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };


    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            <LeftFeedNav />
            <main className="flex-grow container max-w-[60%] mx-auto px-4 py-8">
                {/* INPUT */}
                <div className="flex justify-center items-center mb-6">
                    <div className="flex flex-grow items-center bg-charcoal max-w-[600px] h-12">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="rounded-l-md bg-charcoal border border-steelGray shadow-inner shadow-secondary py-2 px-4 text-lg w-full focus:border-cornflowerBlue outline-none h-[100%]"
                        />
                        <button className="py-2 px-4 rounded-r-md border border-steelGray hover:border-cornflowerBlue border-l-0 flex-shrink-0 bg-charcoal h-[100%]">
                            <FaSearch className="text-steelGray text-lg" />
                        </button>
                    </div>
                </div>
                {/* CategoryPills */}
                <div className='flex justify-center'>
                <CategoryPills categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
                </div>
                <section className="mb-12 mt-8">
                    <h1 className="text-4xl font-bold mb-6">Your Feed</h1>
                    <h2 className="text-xl mb-2">Recommended Films</h2>
                    <div className="grid gap-6 grid-cols-1">
                        {recommendedFilms.map((film, index) => (
                            <div key={index} className="bg-charcoal rounded-lg overflow-hidden mt-8">
                                <img src={film.thumbnail} alt={film.title} className="aspect-w-16 aspect-h-9 w-full object-cover rounded-lg shadow-lg" />
                                <div className="flex-grow p-4">
                                    <div className="flex justify-between items-center">
                                        {/* Film Title and Creator */}
                                        <div>
                                            <h3 className="text-xl font-bold">{film.title}</h3>
                                            <p className="text-sm text-gray-400">by {film.creator}</p>
                                        </div>

                                        {/* Icons */}
                                        <div className="flex space-x-4">
                                            <button onClick={() => setPressed( !pressed )} className="text-crispWhite hover:text-cornflowerBlue">
                                                {/* Vote Icon */}
                                                {pressed ? <BiSolidUpvote className='text-3xl text-cornflowerBlue'/> : <BiUpvote className='text-3xl' />}
                                            </button>
                                            <button className="text-crispWhite hover:text-cornflowerBlue">
                                                {/* Comment Icon */}
                                                <FaRegComment className='text-2xl' />
                                            </button>
                                            <button className="text-crispWhite hover:text-cornflowerBlue">
                                                {/* Send Icon */}
                                                <FiSend className='text-2xl' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>

    )
}

export default Explore