import { useState, useEffect } from "react";
import { BiUpvote, BiSolidUpvote } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface VoteWithBGProps {
  filmId: string;
  initialPressed?: boolean; // Indicates if the user has already upvoted
  onVoteChange?: (votesDelta: number) => void; // Callback to update parent state
}

const VoteWithBG = ({ filmId, initialPressed = false, onVoteChange }: VoteWithBGProps) => {
  const [pressed, setPressed] = useState(initialPressed);
  const [votes, setVotes] = useState<number>(0); // State for votes (default to 0)
  const [loading, setLoading] = useState(true); // Loading for initial fetch or vote
  const [error, setError] = useState<string | null>(null); // Error state

  const { token } = useAuth();

  // Fetch initial votes for the film
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/films/${filmId}/votes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Ensure votes is a number
        setVotes(response.data.votes || 0); // Defaults to 0 if votes are undefined
        setPressed(response.data.userHasVoted); // Assuming API returns { userHasVoted: boolean }
      } catch (err) {
        console.error("Error fetching votes:", err);
        setError("Failed to fetch votes.");
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [filmId, token]);

  const handleVote = async () => {
    if (loading) return; // Prevent duplicate requests

    try {
      setLoading(true);

      // Send vote request to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/films/${filmId}/vote`,
        { isUpvote: !pressed }, // Toggle upvote
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local votes count
      const votesDelta = !pressed ? 1 : -1;
      setVotes((prevVotes) => prevVotes + votesDelta);

      // Toggle pressed state
      setPressed(!pressed);

      // Update parent state if callback is provided
      if (onVoteChange) {
        onVoteChange(votesDelta);
      }
    } catch (err) {
      console.error("Error while voting:", err);
      alert("Failed to register your vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && votes === 0) {
    return <p>Loading...</p>; // Display loading indicator while fetching initial votes
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message with correct class
  }

  return (
    <div className="flex items-center bg-darkCharcoal p-2 rounded-lg hover:cursor-pointer" onClick={handleVote}>
      <button
        disabled={loading}
        className={`text-crispWhite hover:text-cornflowerBlue ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {pressed ? (
          <BiSolidUpvote className="text-3xl text-cornflowerBlue" />
        ) : (
          <BiUpvote className="text-3xl" />
        )}
      </button>
      <span className="ml-2 text-lg text-crispWhite">{votes}</span> {/* Display votes */}
    </div>
  );
};

export default VoteWithBG;
