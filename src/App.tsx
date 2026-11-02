/**
 * Adventure Game - Main App Component
 * Routing und Layout
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import CharacterSelectionPage from './pages/CharacterSelectionPage';
import GameHub from './pages/GameHub';
import GameWorld from './pages/GameWorld';
import LegacyGameWorld from './pages/LegacyGameWorld';
import { OutdoorAdventure } from './pages/OutdoorAdventure';
import HeroInfoPage from './pages/HeroInfoPage';
import InventoryPage from './pages/InventoryPage';
import DebugCampaignPage from './pages/DebugCampaignPage';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/character-select" element={<CharacterSelectionPage />} />
          <Route path="/hub" element={<GameHub />} />
          <Route path="/game" element={<GameWorld />} />
          <Route path="/hub/outdoor" element={<OutdoorAdventure onReturn={() => window.history.back()} allowDemoMode={true} />} />
          <Route path="/hub/hero-info" element={<HeroInfoPage />} />
          <Route path="/hub/inventory" element={<InventoryPage />} />
          <Route path="/free-world" element={<LegacyGameWorld />} />
          <Route path="/debug/campaign" element={<DebugCampaignPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
