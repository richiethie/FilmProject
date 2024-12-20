import { useState, useEffect } from "react";
import { BiUpvote, BiSolidUpvote, BiDownvote, BiSolidDownvote } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from '@/context/MobileContext';

interface VoteWithBGProps {
  filmId: string;
  initialPressed?: boolean; // Indicates if the user has already upvoted
  initialDownPressed?: boolean; // Indicates if the user has already downvoted
  onVoteChange?: (votesDelta: number) => void; // Callback to update parent state
}

const VoteWithBG = ({
  filmId,
  initialPressed = false,
  initialDownPressed = false,
  onVoteChange,
}: VoteWithBGProps) => {
  const [pressed, setPressed] = useState(initialPressed);
  const [pressedDownvote, setPressedDownvote] = useState(initialDownPressed);
  const [votes, setVotes] = useState<number>(0); // State for votes (default to 0)
  const [loading, setLoading] = useState(true); // Loading for initial fetch or vote
  const [error, setError] = useState<string | null>(null); // Error state

  const { token } = useAuth();
  const isMobile = useIsMobile();

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
        setPressed(response.data.userHasUpvoted); // Assuming API returns { userHasUpvoted: boolean }
        setPressedDownvote(response.data.userHasDownvoted); // Assuming API returns { userHasDownvoted: boolean }
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
        { isUpvote: true, isDownvote: false }, // Upvote action
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local votes count
      const votesDelta = !pressed ? 1 : -1;
      setVotes((prevVotes) => prevVotes + votesDelta);

      // Update button states
      setPressed(!pressed);
      setPressedDownvote(false);

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

  const handleDownvote = async () => {
    if (loading) return; // Prevent duplicate requests
  
    try {
      setLoading(true);
  
      let votesDelta = 0;
  
      if (pressedDownvote) {
        // Case 3: Downvote clicked again to unsubmit (no change to vote count)
        votesDelta = 0;
      } else if (pressed) {
        // Case 2: Downvote clicked while upvote is active
        votesDelta = -1; // Remove the upvote
      } else {
        // Case 1: Downvote clicked without previous selection (no change to vote count)
        votesDelta = 0;
      }
  
      // Send downvote request to the backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/films/${filmId}/vote`,
        { isUpvote: false, isDownvote: !pressedDownvote }, // Toggle downvote
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update local votes count
      setVotes((prevVotes) => prevVotes + votesDelta);
  
      // Update button states
      setPressedDownvote(!pressedDownvote);
      if (pressed) setPressed(false); // Clear upvote if it was active
  
      // Update parent state if callback is provided
      if (onVoteChange && votesDelta !== 0) {
        onVoteChange(votesDelta);
      }
    } catch (err) {
      console.error("Error while voting:", err);
      alert("Failed to register your vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  if (loading) {
    return (
      <div className="flex items-center bg-darkCharcoal p-2 rounded-full cursor-not-allowed">
        <button
          className="flex items-center text-steelGray cursor-not-allowed"
        >
          <BiSolidUpvote className={`${isMobile ? "text-xl" : "text-3xl"}`} />
        </button>
        {/* Display placeholder for votes */}
        <span className={`ml-2 ${isMobile ? "text-md" : "text-lg"} text-steelGray`}>0</span>
        <span className={`mx-3 ${isMobile ? "text-md" : "text-lg"} text-steelGray`}>|</span> {/* Separator */}
        <button
          className="flex items-center text-steelGray cursor-not-allowed"
        >
          <BiSolidDownvote className={`${isMobile ? "text-xl" : "text-3xl"}`} />
        </button>
      </div>
    );
  }
  

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message with correct class
  }

  return (
    <div className="flex items-center bg-darkCharcoal p-2 rounded-full hover:cursor-pointer">
      <button
        disabled={loading}
        className={`flex items-center text-crispWhite hover:text-cornflowerBlue ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
        onClick={handleVote}
      >
        {pressed ? (
          <BiSolidUpvote className={`${ isMobile ? ("text-xl") : ("text-3xl")} text-cornflowerBlue`} />
        ) : (
          <BiUpvote className={`${ isMobile ? ("text-xl") : ("text-3xl")}`} />
        )}
      </button>
      {/* Display votes */}
      <span className={`ml-2 ${ isMobile ? ("text-md") : ("text-lg")} text-crispWhite`}>{votes}</span>
      <span className={`mx-3 ${ isMobile ? ("text-md") : ("text-lg")} text-steelGray`}>|</span> {/* Separator */}
      <button
        disabled={loading}
        className={`flex items-center text-crispWhite hover:text-cornflowerBlue ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
        onClick={handleDownvote}
      >
        {pressedDownvote ? (
          <BiSolidDownvote className={`${ isMobile ? ("text-xl") : ("text-3xl")} text-cornflowerBlue`} />
        ) : (
          <BiDownvote className={`${ isMobile ? ("text-xl") : ("text-3xl")}`} />
        )}
      </button>
    </div>
  );
};

export default VoteWithBG;
