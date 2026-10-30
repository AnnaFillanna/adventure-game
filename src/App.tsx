/**
 * Adventure Game - Main App Component
 * Routing und Layout
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import CharacterSelectionPage from './pages/CharacterSelectionPage';
import GameWorld from './pages/GameWorld';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/character-select" element={<CharacterSelectionPage />} />
          <Route path="/game" element={<GameWorld />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
