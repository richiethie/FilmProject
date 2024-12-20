import { useIsMobile } from '@/context/MobileContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const isMobile = useIsMobile();

    return (
        <header
            className={`absolute top-0 left-0 w-full flex justify-between items-center ${isMobile ? ("px-4 pt-4") : ("px-20 pt-8")} text-crispWhite bg-transparent z-20`}
            style={{ boxShadow: '0 35px 35px rgba(0, 0, 0, 0.6) inset' }}
        >
            <Link to="/" className={`${isMobile ? ("text-xl") : ("text-4xl")} font-bold`}>Film<span className="text-cornflowerBlue">Share</span></Link>
            <nav>
                <ul className="flex space-x-4">
                <li>
                    <Link to="/login" className={`bg-cornflowerBlue hover:bg-steelGray ${isMobile ? ("px-3 py-1 text-sm") : ("px-4 py-2")} rounded`}>
                        Sign In
                    </Link>
                </li>
                </ul>
            </nav>
        </header>


    )
}

export default Header