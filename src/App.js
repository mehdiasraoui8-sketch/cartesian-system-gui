import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import ModeManu from './pages/ModeManu';
import ModeImport from './pages/ModeImport';
import FormesPredefinie from './pages/FormesPredefinie';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/mode-manuel" element={<ModeManu />} />
          <Route path="/mode-import" element={<ModeImport />} />
          <Route path="/formes-predefinie" element={<FormesPredefinie />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
