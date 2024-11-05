import Footer from '../components/Footer';
import LeftFeedNav from '../components/LeftFeedNav';
import { userFilms, exampleUser } from '../data/profile';
import { IoMdTrendingUp } from "react-icons/io";

const Profile = () => {
    const hasRankedFilms = userFilms.some(film => film.rank !== undefined);
    return (
        <div className="min-h-screen flex flex-col bg-charcoal text-crispWhite">
        <LeftFeedNav />
        <main className="flex-grow container max-w-[60%] mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
            <img
                src={exampleUser.userProfilePic}
                alt={`${exampleUser.name}'s profile`}
                className="w-32 h-32 rounded-full border border-steelGray shadow-lg object-cover"
            />
            <div className="ml-6 mt-8">
                <h1 className="text-3xl font-bold">{exampleUser.name}</h1>
                <p className="text-xl text-steelGray">@{exampleUser.username}</p>
                {hasRankedFilms && <p className='text-xl text-cornflowerBlue'>TOP CREATOR</p>}
                <p className="text-lg">{exampleUser.bio}</p>
                <div className="flex space-x-4 mt-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold">{exampleUser.films.length}</h2>
                    <p className="text-sm text-steelGray">Posts</p>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{exampleUser.followers}</h2>
                    <p className="text-sm text-steelGray">Followers</p>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{exampleUser.following}</h2>
                    <p className="text-sm text-steelGray">Following</p>
                </div>
                </div>
            </div>
            </div>
            <section>
                <h2 className="text-2xl font-bold mb-4">My Posts</h2>
                <div className="grid gap-6 grid-cols-3">
                    {userFilms.map((film, index) => (
                        <div key={index} className="bg-charcoal rounded-lg overflow-hidden">
                            <div className="relative w-full pb-[56.25%]"> {/* 16:9 aspect ratio */}
                                <img
                                    src={film.thumbnail}
                                    alt={film.title}
                                    className={`${film.rank && "border-4 border-cornflowerBlue"} absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                                />
                                {film.rank && (
                                    <div className="absolute top-3 left-4 text-cornflowerBlue">
                                        <IoMdTrendingUp className='text-3xl' />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div className='flex flex-col'>
                                    <h3 className="text-xl font-bold">{film.title}</h3>
                                    <p className="text-sm text-gray-400">by {exampleUser.name}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm text-gray-400">{film.votes} votes</p>
                                    {film.rank ? <p className='text-cornflowerBlue'>RANK #{film.rank}</p> : <p>-</p>}
                                </div>
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

export default Profile;
