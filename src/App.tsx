/**
 * Adventure Game - Main App Component
 * Routing und Layout
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import GameWorld from './pages/GameWorld';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/game" element={<GameWorld />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
