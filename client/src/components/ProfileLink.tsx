import { Link } from 'react-router-dom';

interface ProfileLinkProps {
    username: string; // The username to display
    userId: string;   // The user's ID for generating the profile URL
}

const ProfileLink = ({ username, userId }: ProfileLinkProps) => {
    return (
        <Link
            to={`/profile/${userId}`} // Adjust the route as per your app's structure
            className="text-cornflowerBlue font-bold hover:text-crispWhite z-10"
            onClick={(e) => e.stopPropagation()}
        >
            {username}
        </Link>
    );
};

export default ProfileLink;
