import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-charcoal text-crispWhite">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-lg">The page you are looking for doesn't exist.</p>
      <Link
        to="/feed"
        className="mt-4 px-4 py-2 bg-cornflowerBlue text-charcoal rounded-lg hover:bg-darkCharcoal hover:text-crispWhite"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;