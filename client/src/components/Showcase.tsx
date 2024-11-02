
const Showcase = () => {
    
    return (
        <section className="py-20 bg-white">
            <h2 className="text-3xl font-bold text-center">Featured Films</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Film Card */}
                <div className="bg-gray-100 rounded overflow-hidden shadow">
                    <img src="/path/to/film-thumbnail.jpg" alt="Film Title" className="w-full h-48 object-cover" />
                    <div className="p-4">
                    <h3 className="font-bold">Film Title</h3>
                    <p>by Creator Name</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Watch</button>
                    </div>
                </div>
                {/* Repeat for other films... */}
            </div>
        </section>
    )
}

export default Showcase