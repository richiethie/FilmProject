import FollowButton from '@/components/FollowButton';
import ProfileLink from '@/components/ProfileLink';
import { SearchResults } from '@/types/SearchResults';
import { Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Astronaut from '../../assets/img/profilePic/profile-astronaut.jpg'
import Comment from '@/components/Comment';
import Vote from '@/components/Vote';
import { formatDistanceToNow } from 'date-fns';
import { IoFilter } from "react-icons/io5";

const SearchPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    users: [],
    films: [],
    series: [],
  });

  useEffect(() => {
    if (query.trim() === '') {
      setResults({ users: [], films: [], series: [] }); // Clear results if the query is empty
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [query]);

  const trimToWords = (text: string, maxWords: number): string => {
    return text.split(' ').slice(0, maxWords).join(' ');
  };

  return (
    <div className="bg-charcoal text-white min-h-screen py-4">
      <div className="flex px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl pr-2 hover:text-cornflowerBlue mb-4 flex items-center"
          aria-label="Go Back"
        >
          <IoChevronBack />
        </button>
        <Input
          placeholder="Search"
          size="lg"
          bg="charcoal"
          color="white"
          _placeholder={{ color: 'gray.300' }}
          borderWidth="1px"
          borderRadius="md"
          className="border-steelGray px-4 mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur(); // Dismiss the keyboard
            }
          }}
        />
        <button
          // onClick={() => navigate(-1)}
          className="text-white text-2xl pl-4 hover:text-cornflowerBlue mb-4 flex items-center"
          aria-label="Go Back"
        >
          <IoFilter />
        </button>
      </div>
      
      {/* Display Search Results */}
      {results.users.length > 0 && (
        <div className=''>
          <h3 className="text-lg font-semibold pl-4">Users</h3>
          <ul className='border-t border-b border-steelGray my-4'>
            {results.users.filter(user => user.role).map((user) => (
              <div key={user._id} className="bg-charcoal rounded-lg overflow-hidden py-4 px-4">
                <div className="flex justify-between items-center">
                  <div className='flex'>
                    <img src={user.profilePhotoUrl || Astronaut} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div className='mb-2 text-xl'>
                        <div className='text-sm'>
                          <ProfileLink username={user.username} userId={user._id} />
                        </div>
                        {user.bio && (
                          <p className="text-xs text-gray-400">{user.followersCount} followers • {user.uploadedFilmsCount} films</p>
                        )}
                    </div>
                  </div>
                  <div className='ml-4'>
                    <FollowButton targetUserId={user._id || ''} token={token || ''} />
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
      {results.films.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold pl-4">Films</h3>
          <ul className='border-t border-b border-steelGray my-4'>
            {results.films.map((film) => (
              <div key={film._id} className="bg-charcoal overflow-hidden mt-4 group">
                <div
                    className="relative w-full pb-[60%] cursor-pointer"
                    onClick={() => navigate(`/films/${film._id}`)}
                >
                  <img
                      src={film.thumbnailUrl}
                      alt={film.title}
                      className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                  />
                </div>
                <div className="flex-grow py-2">
                    <div className="flex justify-between px-2 items-center">
                        <div>
                            <h3 className="text-xl font-bold">{film.title}</h3>
                            <p className="text-sm text-gray-400"><ProfileLink username={film.uploadedBy.username} userId={film.uploadedBy._id} /> • {formatDistanceToNow(new Date(film.createdAt), { addSuffix: true })}</p>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <Vote filmId={film._id} />
                            <Comment filmId={film._id} />
                            {/* <button className="text-crispWhite border border-steelGray px-3 py-1 rounded-full hover:text-cornflowerBlue">
                                <FiSend className="text-xl" />
                            </button> */}
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
      {results.series.length > 0 && (
        <div className=''>
          <h3 className="text-lg font-semibold pl-4">Series</h3>
          <ul className='border-t border-steelGray mt-4'>
            {results.series.map((series) => (
              <div className='flex justify-between items-center gap-2 py-4 px-4 mx-4 mb-4 mt-4 bg-darkCharcoal text-crispWhite transition-shadow duration-300 cursor-pointer hover:shadow-lg rounded-xl'>
                <div className='w-24 h-16 overflow-hidden rounded-md cursor-pointer group'>
                    <img
                        src={series?.films[0]?.thumbnailUrl}
                        alt={series?.films[0]?.title || 'Film thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="flex items-center">
                    <p
                        className="text-md font-semibold text-center truncate max-w-xs mr-2"
                        title={series?.title}
                    >
                        {series?.title}
                    </p>
                    <p className="text-md bg-charcoal p-2 rounded-xl font-semibold text-center truncate max-w-xs">
                        {series?.films.length} films
                    </p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
