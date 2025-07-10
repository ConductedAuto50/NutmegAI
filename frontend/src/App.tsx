import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import NutmegAILanding from './components/NutmegAILanding';
import ChatPage from './pages/ChatPage';
import Background3D from './components/Background3D';

// Styles
import './App.css';

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  useEffect(() => {
    // Initialize AOS (Animate On Scroll) only for chat page
    if (isChatPage) {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, [isChatPage]);

  return (
    <div className="App">
      {/* Only show Background3D on chat page, as landing page has its own 3D background */}
      {isChatPage && <Background3D />}
      <Routes>
        <Route path="/" element={<NutmegAILanding />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 