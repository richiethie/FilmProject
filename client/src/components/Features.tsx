
const Features = () => {

    return (
        <section id="features" className="pt-20 pb-16 bg-cornflowerBlue text-center" style={{ boxShadow: '0 35px 35px rgba(0, 0, 0, 0.6) inset' }}>
            <h2 className="text-3xl font-bold text-crispWhite">What We Offer</h2>
            <div className="mt-8 mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-crispWhite p-4 rounded shadow">
                    <h3 className="font-semibold">Easy Uploads</h3>
                    <p>Quickly upload and share your short films with just a few clicks.</p>
                </div>
                <div className="bg-crispWhite p-4 rounded shadow">
                    <h3 className="font-semibold">Community Feedback</h3>
                    <p>Get feedback from fellow filmmakers and improve your craft.</p>
                </div>
                <div className="bg-crispWhite p-4 rounded shadow">
                    <h3 className="font-semibold">Analytics</h3>
                    <p>Track views and engagement on your films.</p>
                </div>
                <div className="bg-crispWhite p-4 rounded shadow">
                    <h3 className="font-semibold">Showcase Your Work</h3>
                    <p>Be featured in our monthly highlights and gain exposure.</p>
                </div>
            </div>
        </section>
    )
}

export default Features