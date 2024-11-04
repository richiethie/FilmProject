import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Footer from '../components/Footer';
import { followedFilms, categories } from '../data/home';
import CategoryPills from '../components/CategoryPills';

const Feed = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

    // Placeholder data for videos from people you follow and recommended films
    const recommendedVideos = [
        { title: 'Recommended Film 1', creator: 'Creator X', thumbnail: 'path/to/thumbnail3.jpg' },
        { title: 'Recommended Film 2', creator: 'Creator Y', thumbnail: 'path/to/thumbnail4.jpg' },
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
            {/* Create absolute positioned left side menu */}
            <main className="flex-grow container mx-auto px-4 py-8">
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
                <h1 className="text-4xl font-bold mb-6">Your Feed</h1>
                
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Films from People You Follow</h2>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {followedFilms.map((video, index) => (
                            <div key={index} className="bg-charcoal rounded-lg shadow-md overflow-hidden">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{video.title}</h3>
                                    <p className="text-sm text-gray-400">by {video.creator}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4">Recommended Films</h2>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {recommendedVideos.map((video, index) => (
                            <div key={index} className="bg-charcoal rounded-lg shadow-md overflow-hidden">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
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
