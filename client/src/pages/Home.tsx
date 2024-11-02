import AboutSection from "../components/AboutSection"
import Features from "../components/Features"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import Showcase from "../components/Showcase"

const Home = () => {

    return (
        <div>
            <Header />
            <Hero />
            <Features />
            <Showcase />
            <AboutSection />
            <Footer />
        </div>
    )
}

export default Home