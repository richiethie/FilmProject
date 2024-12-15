import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

interface FollowButtonProps {
    targetUserId : string; // ID of the user to follow/unfollow
    token: string; // Authentication token
}

const FollowButton = ({ targetUserId , token }: FollowButtonProps) => {
    const [following, setFollowing] = useState<boolean | null>(null); // Initial state is null to show a loading indicator
    const [loading, setLoading] = useState(false);

    const { userId } = useAuth();

    // Fetch the following state when the component mounts
    useEffect(() => {
        const fetchFollowingState = async () => {
        try {
            setLoading(true); // Show loading state
            const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/${targetUserId}/is-following`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Secure request
                },
            }
            );
            setFollowing(response.data.isFollowing); // Update the state based on the response
        } catch (err) {
            console.error("Error fetching follow state", err);
            setFollowing(false); // Default to not following on error
        } finally {
            setLoading(false); // Reset loading state
        }
        };

        fetchFollowingState();
    }, [targetUserId , token]);

    const toggleFollow = async () => {
        try {
        setLoading(true); // Show loading state
        if (following) {
            await axios.post(
            `${import.meta.env.VITE_API_URL}/api/users/${targetUserId}/unfollow`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Secure request
                },
            }
            );
        } else {
            await axios.post(
            `${import.meta.env.VITE_API_URL}/api/users/${targetUserId}/follow`,
            {},
            {
                headers: {
                Authorization: `Bearer ${token}`, // Secure request
                },
            }
            );
        }
        setFollowing(!following); // Toggle the state on success
        } catch (err) {
        console.error("Error following/unfollowing user", err);
        } finally {
        setLoading(false); // Reset loading state
        }
    };

    // Show a loading state until the following state is determined
    if (following === null) {
        return (
        <button className="px-4 py-2 rounded-lg bg-gray-300" disabled>
            Loading...
        </button>
        );
    }

    return (
        <button
        onClick={toggleFollow}
        className={`px-4 py-2 rounded-lg ${
            following ? "bg-steelGray hover:bg-gray-600" : "bg-cornflowerBlue hover:bg-blue-600"
        }`}
        disabled={loading} // Disable button while processing
        >
        {loading ? "Processing..." : following ? "Following" : "Follow"}
        </button>
    );
};

export default FollowButton;
