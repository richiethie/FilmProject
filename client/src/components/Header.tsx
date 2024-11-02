import { Link } from 'react-router-dom';

const Header = () => {

    return (
        <header
        className="absolute top-0 left-0 w-full flex justify-between items-center pt-8 px-20 text-crispWhite bg-transparent z-20"
        style={{ boxShadow: '0 35px 35px rgba(0, 0, 0, 0.6) inset' }}
        >
            <Link to="/" className="text-4xl font-bold">Film<span className="text-cornflowerBlue">Share</span></Link>
            <nav>
                <ul className="flex space-x-4">
                <li>
                    <Link to="/login" className="bg-cornflowerBlue hover:bg-steelGray px-4 py-2 rounded">
                        Sign In
                    </Link>
                </li>
                </ul>
            </nav>
        </header>


    )
}

export default Header