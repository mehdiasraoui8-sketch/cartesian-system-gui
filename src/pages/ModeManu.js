import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeManu.css';

function ModeManu() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('Mode manuel');
  const [activeTab, setActiveTab] = useState('coordonnees');
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [inputCoords, setInputCoords] = useState({ x: '', y: '', z: '' });
  const [speed, setSpeed] = useState(50);
  const [sequences, setSequences] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const canvasRef = useRef(null);

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    if (val === 'Mode import') navigate('/mode-import');
    if (val === 'Formes prédefinies') navigate('/formes-predefinie');
  };

  const handleAddSequence = () => {
    const x = parseFloat(inputCoords.x) || 0;
    const y = parseFloat(inputCoords.y) || 0;
    const z = parseFloat(inputCoords.z) || 0;
    const newSeq = { x, y, z, id: Date.now() };
    setSequences((prev) => [...prev, newSeq]);
    setCoords({ x, y, z });
    setInputCoords({ x: '', y: '', z: '' });
  };

  const handleCanvasMouseDown = (e) => {
    if (activeTab !== 'dessin') return;
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setDrawPoints([[px, py]]);
  };

  const handleCanvasMouseMove = (e) => {
    if (!drawing || activeTab !== 'dessin') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setDrawPoints((prev) => [...prev, [px, py]]);
    setCoords({
      x: Math.round(px * 10) / 10,
      y: Math.round(py * 10) / 10,
      z: coords.z,
    });
  };

  const handleCanvasMouseUp = () => setDrawing(false);

  const clearCanvas = () => setDrawPoints([]);

  const buildPath = (points) => {
    if (points.length < 2) return '';
    return points.reduce((acc, pt, i) => {
      return acc + (i === 0 ? `M ${pt[0]} ${pt[1]}` : ` L ${pt[0]} ${pt[1]}`);
    }, '');
  };

  return (
    <div className="screen screen--manuel">
      {/* Header */}
      <header className="screen-header">
        <div className="screen-header-left">
          <div className="color-bar color-bar--green"></div>
          <h2 className="screen-title">Mode manuel:</h2>
        </div>
        <div className="screen-header-right">
          <label className="mode-label">Mode :</label>
          <select className="mode-select" value={mode} onChange={handleModeChange}>
            <option>Mode manuel</option>
            <option>Mode import</option>
            <option>Formes prédefinies</option>
          </select>
        </div>
      </header>

      {/* Body */}
      <div className="screen-body">
        {/* Left control panel */}
        <div className="control-panel">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'coordonnees' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('coordonnees')}
            >
              Tapage de coordonnées
            </button>
            <button
              className={`tab-btn ${activeTab === 'dessin' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('dessin')}
            >
              Dessin sur écran
            </button>
          </div>

          {activeTab === 'coordonnees' && (
            <div className="coord-inputs">
              {['x', 'y', 'z'].map((axis) => (
                <div className="coord-row" key={axis}>
                  <label className="coord-label">{axis.toUpperCase()} :</label>
                  <input
                    className="coord-input"
                    type="number"
                    placeholder="Value"
                    value={inputCoords[axis]}
                    onChange={(e) =>
                      setInputCoords((prev) => ({ ...prev, [axis]: e.target.value }))
                    }
                  />
                  <span className="coord-unit">mm</span>
                </div>
              ))}

              <button className="add-sequence-btn" onClick={handleAddSequence}>
                + Ajouter une séquence
              </button>

              {sequences.length > 0 && (
                <div className="sequence-list">
                  {sequences.map((seq, idx) => (
                    <div className="sequence-item" key={seq.id}>
                      <span className="seq-num">#{idx + 1}</span>
                      <span>X:{seq.x} Y:{seq.y} Z:{seq.z}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dessin' && (
            <div className="dessin-hint">
              <p>🖱️ Dessinez directement sur le plan de droite</p>
              <button className="clear-btn" onClick={clearCanvas}>🗑 Effacer</button>
            </div>
          )}

          {/* Speed control */}
          <div className="speed-section">
            <div className="speed-header">
              <span className="speed-label">Vitesse</span>
              <span className="speed-value">{speed} mm/s</span>
            </div>
            <div className="speed-slider-row">
              <span className="speed-icon" title="Lent">🐢</span>
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="speed-slider speed-slider--green"
              />
              <span className="speed-icon" title="Rapide">🐇</span>
            </div>
          </div>

          {/* Calibration */}
          <button className="calibrate-btn calibrate-btn--green">
            ⚙ Calibration
          </button>
        </div>

        {/* Right drawing panel */}
        <div className="drawing-panel">
          <div className="drawing-panel-header">
            <span>Plan de dessin</span>
            {activeTab === 'dessin' && (
              <span className="drawing-hint-badge">Mode dessin actif</span>
            )}
          </div>
          <div
            className="canvas-area"
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            style={{ cursor: activeTab === 'dessin' ? 'crosshair' : 'default' }}
          >
            <svg width="100%" height="100%" className="drawing-svg">
              {/* Grid */}
              <defs>
                <pattern id="grid-manuel" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(46,204,113,0.15)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-manuel)" />

              {/* Axis lines */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(46,204,113,0.2)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(46,204,113,0.2)" strokeWidth="1" strokeDasharray="4,4" />

              {/* Drawn path */}
              {drawPoints.length > 1 && (
                <path
                  d={buildPath(drawPoints)}
                  fill="none"
                  stroke="#2ecc71"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Sequence points */}
              {sequences.map((seq) => (
                <circle
                  key={seq.id}
                  cx={`${Math.min(Math.max(seq.x, 10), 90)}%`}
                  cy={`${Math.min(Math.max(seq.y, 10), 90)}%`}
                  r="6"
                  fill="#2ecc71"
                  opacity="0.7"
                />
              ))}

              {/* Origin */}
              <circle cx="50%" cy="50%" r="5" fill="#2ecc71" opacity="0.5" />
              <text x="51%" y="48%" fill="rgba(46,204,113,0.6)" fontSize="11">O</text>
            </svg>

            {drawPoints.length === 0 && sequences.length === 0 && (
              <div className="canvas-placeholder">
                <span className="canvas-placeholder-icon">📐</span>
                <span>Plan de dessin</span>
              </div>
            )}
          </div>

          {/* Realtime coords */}
          <div className="realtime-coords realtime-coords--green">
            <span className="coord-display">
              <span className="coord-axis">X</span>
              <span className="coord-val">{coords.x.toFixed(2)}</span>
              <span className="coord-unit-sm">mm</span>
            </span>
            <span className="coord-separator">|</span>
            <span className="coord-display">
              <span className="coord-axis">Y</span>
              <span className="coord-val">{coords.y.toFixed(2)}</span>
              <span className="coord-unit-sm">mm</span>
            </span>
            <span className="coord-separator">|</span>
            <span className="coord-display">
              <span className="coord-axis">Z</span>
              <span className="coord-val">{coords.z.toFixed(2)}</span>
              <span className="coord-unit-sm">mm</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="screen-footer">
        <button className="return-btn" onClick={() => navigate('/')}>
          ← Retour
        </button>
      </footer>
    </div>
  );
}

export default ModeManu;
