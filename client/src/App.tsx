import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Video from './pages/Video';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Watch from './pages/Watch';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Make the app take full height */}
      <main className="flex-grow"> {/* This allows the main section to expand */}
        <Routes>
          {/* Not protected */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
          {/* Protected Routes Below */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/video/:id" 
            element={
              <ProtectedRoute>
                <Video />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
          } 
          />
          <Route 
            path="/alerts" 
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/films/:id" 
            element={
              <ProtectedRoute>
                <Watch />
              </ProtectedRoute>
            } 
          />
          {/* Add additional routes as needed */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
