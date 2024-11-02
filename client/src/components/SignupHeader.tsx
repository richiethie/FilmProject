import { Link } from 'react-router-dom';

const SignupHeader = () => {
    return (
        <header className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-20 text-crispWhite bg-transparent z-20">
            <Link to="/" className="text-4xl font-bold">Film<span className="text-cornflowerBlue">Share</span></Link>
        </header>
    );
};

export default SignupHeader;
