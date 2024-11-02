const Footer = () => {

    return (
        <footer className="py-10 bg-charcoal text-crispWhite text-center">
            <p>&copy; {new Date().getFullYear()} FilmShare. All rights reserved.</p>
            <div className="mt-4">
                <a href="#" className="px-2">Privacy Policy</a> | 
                <a href="#" className="px-2">Terms of Service</a>
            </div>
        </footer>
    )
}

export default Footer