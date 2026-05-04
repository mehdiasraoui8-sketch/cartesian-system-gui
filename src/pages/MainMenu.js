import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainMenu.css';

function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="main-menu">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">⬡</div>
          <span className="logo-text">Pl. Groupe 7</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn">A propos</button>
          <button className="nav-btn">Aide</button>
        </nav>
      </header>

      {/* Main content */}
      <main className="main-content">
        <div className="left-panel">
          <h1 className="main-title">
            Système cartésien:<br />
            Interface de contrôle
          </h1>
          <p className="main-subtitle">Sélectionnez un mode de fonctionnement</p>

          <div className="mode-buttons">
            <button
              className="mode-btn mode-btn--manuel"
              onClick={() => navigate('/mode-manuel')}
            >
              <span className="mode-btn-icon">✏️</span>
              <div className="mode-btn-content">
                <span className="mode-btn-label">Mode manuel</span>
                <span className="mode-btn-desc">Contrôle direct des coordonnées</span>
              </div>
              <span className="mode-btn-arrow">›</span>
            </button>

            <button
              className="mode-btn mode-btn--import"
              onClick={() => navigate('/mode-import')}
            >
              <span className="mode-btn-icon">📁</span>
              <div className="mode-btn-content">
                <span className="mode-btn-label">Mode import</span>
                <span className="mode-btn-desc">Importer un fichier G-code ou SVG</span>
              </div>
              <span className="mode-btn-arrow">›</span>
            </button>

            <button
              className="mode-btn mode-btn--formes"
              onClick={() => navigate('/formes-predefinie')}
            >
              <span className="mode-btn-icon">⬡</span>
              <div className="mode-btn-content">
                <span className="mode-btn-label">Formes prédefinies</span>
                <span className="mode-btn-desc">Sélectionner une forme géométrique</span>
              </div>
              <span className="mode-btn-arrow">›</span>
            </button>
          </div>
        </div>

        <div className="right-panel">
          <div className="illustration">
            <IsometricIllustration />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <button className="quit-btn" onClick={() => window.close()}>
          ✕ Quitter
        </button>
      </footer>
    </div>
  );
}

function IsometricIllustration() {
  return (
    <svg
      viewBox="0 0 400 350"
      xmlns="http://www.w3.org/2000/svg"
      className="iso-svg"
    >
      {/* Grid floor */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4].map((i) =>
          [0, 1, 2, 3, 4].map((j) => (
            <rect
              key={`${i}-${j}`}
              x={100 + i * 40 - j * 20}
              y={120 + i * 20 + j * 20}
              width="42"
              height="22"
              fill="none"
              stroke="#4fc3f7"
              strokeWidth="0.5"
              transform={`skewY(-26.57)`}
            />
          ))
        )}
      </g>

      {/* 3D Box - base */}
      <polygon points="200,180 280,210 280,270 200,240" fill="#1565c0" opacity="0.9" />
      <polygon points="200,180 120,210 120,270 200,240" fill="#1976d2" opacity="0.9" />
      <polygon points="200,180 120,210 200,180 280,210" fill="#2196f3" opacity="0.9" />

      {/* 3D Box - top */}
      <polygon points="200,110 280,140 280,210 200,180" fill="#1565c0" opacity="0.9" />
      <polygon points="200,110 120,140 120,210 200,180" fill="#1976d2" opacity="0.9" />
      <polygon points="200,110 120,140 200,110 280,140" fill="#42a5f5" opacity="0.9" />

      {/* Arm / Robot arm */}
      <line x1="200" y1="110" x2="200" y2="50" stroke="#4fc3f7" strokeWidth="4" />
      <circle cx="200" cy="50" r="8" fill="#4fc3f7" />
      <line x1="200" y1="75" x2="240" y2="55" stroke="#4fc3f7" strokeWidth="3" />
      <circle cx="240" cy="55" r="5" fill="#81d4fa" />

      {/* Coordinate axes */}
      <line x1="60" y1="300" x2="130" y2="300" stroke="#f44336" strokeWidth="2" markerEnd="url(#arrowX)" />
      <text x="135" y="305" fill="#f44336" fontSize="14" fontWeight="bold">X</text>
      <line x1="60" y1="300" x2="60" y2="230" stroke="#4caf50" strokeWidth="2" />
      <text x="52" y="225" fill="#4caf50" fontSize="14" fontWeight="bold">Y</text>
      <line x1="60" y1="300" x2="25" y2="270" stroke="#2196f3" strokeWidth="2" />
      <text x="12" y="265" fill="#2196f3" fontSize="14" fontWeight="bold">Z</text>

      {/* Dots on axes */}
      <circle cx="100" cy="300" r="3" fill="#f44336" />
      <circle cx="60" cy="260" r="3" fill="#4caf50" />
      <circle cx="40" cy="283" r="3" fill="#2196f3" />

      {/* Glow effect */}
      <circle cx="200" cy="50" r="20" fill="#4fc3f7" opacity="0.1" />
      <circle cx="200" cy="50" r="35" fill="#4fc3f7" opacity="0.05" />
    </svg>
  );
}

export default MainMenu;
