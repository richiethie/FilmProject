const Footer = () => {

    return (
        <footer className="py-10 bg-gray-800 text-white text-center">
            <p>&copy; {new Date().getFullYear()} FilmShare. All rights reserved.</p>
            <div className="mt-4">
                <a href="#" className="px-2">Privacy Policy</a> | 
                <a href="#" className="px-2">Terms of Service</a>
            </div>
        </footer>
    )
}

export default Footer