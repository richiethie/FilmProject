import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/types/User';
import { HiFire } from 'react-icons/hi';
import { Tooltip } from "@/components/ui/tooltip"

interface ProfileLinkProps {
    username: string; // The username to display
    userId: string;   // The user's ID for generating the profile URL
}

const ProfileLink = ({ username, userId }: ProfileLinkProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token'); // Ensure you retrieve the token properly
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                const userResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(userResponse.data);
            } catch (err) {
                setError('Error fetching user data');
                console.error(err);
            }
        };

        fetchUser();
    }, [userId]); // Depend on `userId` so it fetches new data when `userId` changes

    return (
        <div className='flex items-center'>
            <Link
                to={`/profile/${userId}`} // Adjust the route as per your app's structure
                className={`${user?.topCreator === true ? ("text-cornflowerBlue") : ("text-cornflowerBlue")} font-bold hover:text-crispWhite z-10`}
                onClick={(e) => e.stopPropagation()}
            >
                {username} 
            </Link>
            {user?.topCreator === true && (
                <Tooltip content="Top Creator">
                    <HiFire className=' ml-1 bg-darkCharcoal p-1 rounded-full text-xl text-fireOrange'/>
                </Tooltip>
            )}
        </div>
    );
};

export default ProfileLink;
