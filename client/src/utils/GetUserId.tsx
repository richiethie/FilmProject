import { jwtDecode } from 'jwt-decode'; // Correct import for the named export

interface JwtDecoded {
  userId: string;  // Adjust this according to your actual JWT structure
}

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (!token) return null;

  // Decode the JWT and specify the correct type
  const decoded = jwtDecode<JwtDecoded>(token);

  return decoded.userId || null; // Assuming the JWT contains 'userId'
};
