import { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useIsMobile } from '@/context/MobileContext';

// Define the prop types
interface CommentProps {
  filmId: string; // The ID of the film, expected to be a string (e.g., MongoDB ObjectId)
}

const Comment= ({ filmId }: CommentProps) => {
  const [commentCount, setCommentCount] = useState<number>(0); // State to store the number of comments
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/film/${filmId}/count`);
        setCommentCount(response.data); // Assuming the API returns { count: number }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, [filmId]); // Re-run effect when filmId changes

  return (
    <div
      className="flex items-center border border-steelGray rounded-full py-1 px-2 space-x-2 cursor-pointer"
      onClick={() => navigate(`/films/${filmId}`)}
    >
      <FaRegComment className={`${isMobile ? ("text-xl") : ("text-xl")} text-crispWhite hover:text-cornflowerBlue`} />
      <span className={`${isMobile ? ("text-md") : ("text-md") } text-crispWhite`}>{commentCount}</span>
    </div>
  );
};

export default Comment;
