import { Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';

const SearchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-charcoal text-white min-h-screen p-4">
      {/* Back Button */}
      <div className='flex'>
        <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl pr-2 hover:text-cornflowerBlue mb-4 flex items-center"
            aria-label="Go Back"
        >
            <IoChevronBack />
        </button>

        {/* Search Field */}
        <Input
            placeholder="Search"
            size="lg"
            bg="charcoal"
            color="white"
            _placeholder={{ color: 'gray.300' }}
            borderWidth="1px"
            borderRadius="md"
            className="border-steelGray px-4 mb-4"
        />
      </div>

      {/* Recent Searches */}
      <h2 className="text-xl font-bold mb-2">Recent Searches</h2>
      <ul className="space-y-2">
        <li className="hover:text-cornflowerBlue cursor-pointer">Action Films</li>
        <li className="hover:text-cornflowerBlue cursor-pointer">Comedy</li>
        <li className="hover:text-cornflowerBlue cursor-pointer">Romance</li>
      </ul>
    </div>
  );
};

export default SearchPage;
