const Header = () => {

    return (
        <header className="flex justify-between items-center p-4 bg-darkBlue text-white">
            <div className="text-xl font-bold">FilmShare</div>
            <nav>
            <ul className="flex space-x-4">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#upload" className="bg-burntOrange px-4 py-2 rounded">Upload Film</a></li>
                <li><a href="#login" className="bg-burntOrange px-4 py-2 rounded">Login</a></li>
            </ul>
            </nav>
        </header>
    )
}

export default Header