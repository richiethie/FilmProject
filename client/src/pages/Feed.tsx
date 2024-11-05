import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Footer from '../components/Footer';
import { followedFilms, categories } from '../data/home';
import CategoryPills from '../components/CategoryPills';
import LeftFeedNav from '../components/LeftFeedNav';

const Feed = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

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
                <div className="flex justify-center">
                    <CategoryPills
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </div>
                <section className="mb-12 mt-8">
                    <h1 className="text-4xl font-bold mb-6">Your Feed</h1>
                    <h2 className="text-xl mb-2">Films from People You Follow</h2>
                    <div className="grid gap-6 grid-cols-1">
                        {followedFilms.map((video, index) => (
                            <div key={index} className="bg-charcoal rounded-lg overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="aspect-w-16 aspect-h-9 object-cover rounded-lg shadow-lg"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{video.title}</h3>
                                    <p className="text-sm text-gray-400">by {video.creator}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Feed;
