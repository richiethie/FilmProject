import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "@/components/ui/provider"
import './styles/index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </Provider>
  </StrictMode>
);
