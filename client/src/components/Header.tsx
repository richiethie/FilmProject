const Header = () => {

    return (
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 text-white bg-transparent z-20">
            <div className="text-xl font-bold">FilmShare</div>
            <nav>
                <ul className="flex space-x-4">
                <li><a href="#features" className="hover:text-cornflowerBlue">Features</a></li>
                <li><a href="#about" className="hover:text-cornflowerBlue">About</a></li>
                <li>
                    <a href="#upload" className="bg-cornflowerBlue hover:bg-steelGray px-4 py-2 rounded">
                    Upload Film
                    </a>
                </li>
                <li>
                    <a href="#login" className="bg-cornflowerBlue hover:bg-steelGray px-4 py-2 rounded">
                    Login
                    </a>
                </li>
                </ul>
            </nav>
        </header>

    )
}

export default Header