import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Video from './pages/Video';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Make the app take full height */}
        <main className="flex-grow"> {/* This allows the main section to expand */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/video/:id" element={<Video />} />
            {/* Add additional routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
