import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormesPredefinie.css';

const SHAPES = ['Carré', 'Cercle', 'Spirale'];

function ShapePreview({ shape, speed }) {
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    let frame;
    let val = 0;
    const animate = () => {
      val = (val + (speed / 1000)) % 1;
      setAnimOffset(val);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const dashLen = 600;
  const dashOffset = dashLen * (1 - animOffset);

  return (
    <svg viewBox="0 0 300 300" className="shape-svg">
      <defs>
        <pattern id="grid-formes" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(33,150,243,0.12)" strokeWidth="0.5" />
        </pattern>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="300" height="300" fill="url(#grid-formes)" />
      <line x1="150" y1="0" x2="150" y2="300" stroke="rgba(33,150,243,0.15)" strokeWidth="1" strokeDasharray="4,4" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(33,150,243,0.15)" strokeWidth="1" strokeDasharray="4,4" />

      {shape === 'Carré' && (
        <>
          <rect
            x="75" y="75" width="150" height="150"
            fill="rgba(33,150,243,0.08)"
            stroke="#2196f3"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashLen}
            strokeDashoffset={dashOffset}
            filter="url(#glow-blue)"
          />
          <rect x="75" y="75" width="150" height="150"
            fill="none" stroke="rgba(33,150,243,0.25)" strokeWidth="8" />
          {/* Corner marks */}
          {[[75,75],[225,75],[225,225],[75,225]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#2196f3" opacity="0.8" />
          ))}
        </>
      )}

      {shape === 'Cercle' && (
        <>
          <circle
            cx="150" cy="150" r="90"
            fill="rgba(33,150,243,0.08)"
            stroke="#2196f3"
            strokeWidth="2.5"
            strokeDasharray={dashLen}
            strokeDashoffset={dashOffset}
            filter="url(#glow-blue)"
          />
          <circle cx="150" cy="150" r="90"
            fill="none" stroke="rgba(33,150,243,0.25)" strokeWidth="8" />
          <circle cx="150" cy="150" r="4" fill="#2196f3" opacity="0.7" />
          <line x1="150" y1="150" x2="240" y2="150"
            stroke="rgba(33,150,243,0.4)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="190" y="145" fill="rgba(33,150,243,0.6)" fontSize="10">r=90</text>
        </>
      )}

      {shape === 'Spirale' && (
        <SpiralPath animOffset={animOffset} />
      )}
    </svg>
  );
}

function SpiralPath({ animOffset }) {
  const points = [];
  const turns = 4;
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = (i / steps) * 100;
    const x = 150 + r * Math.cos(t);
    const y = 150 + r * Math.sin(t);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const d = points.join(' ');
  const dashLen = 800;

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="rgba(33,150,243,0.2)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={d}
        fill="none"
        stroke="#2196f3"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={dashLen}
        strokeDashoffset={dashLen * (1 - animOffset)}
        filter="url(#glow-blue)"
      />
    </>
  );
}

function FormesPredefinie() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('Formes prédefinies');
  const [shape, setShape] = useState('Carré');
  const [speed, setSpeed] = useState(50);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    if (val === 'Mode manuel') navigate('/mode-manuel');
    if (val === 'Mode import') navigate('/mode-import');
  };

  // Animate coordinate display based on shape
  useEffect(() => {
    let frame;
    let t = 0;
    const animate = () => {
      t += 0.02 * (speed / 50);
      let x = 0, y = 0;
      if (shape === 'Carré') {
        const phase = (t % (2 * Math.PI)) / (2 * Math.PI);
        if (phase < 0.25) { x = phase * 4 * 150 - 75; y = -75; }
        else if (phase < 0.5) { x = 75; y = (phase - 0.25) * 4 * 150 - 75; }
        else if (phase < 0.75) { x = 75 - (phase - 0.5) * 4 * 150; y = 75; }
        else { x = -75; y = 75 - (phase - 0.75) * 4 * 150; }
      } else if (shape === 'Cercle') {
        x = Math.cos(t) * 90;
        y = Math.sin(t) * 90;
      } else {
        const r = (t % (4 * Math.PI)) / (4 * Math.PI) * 100;
        x = r * Math.cos(t);
        y = r * Math.sin(t);
      }
      setCoords({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        z: 0,
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [shape, speed]);

  return (
    <div className="screen screen--formes">
      {/* Header */}
      <header className="screen-header">
        <div className="screen-header-left">
          <div className="color-bar color-bar--blue"></div>
          <h2 className="screen-title">Formes prédefinies:</h2>
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
          {/* Shape selector */}
          <div className="shape-selector-section">
            <label className="shape-selector-label">Choisissez la forme</label>
            <div className="shape-buttons">
              {SHAPES.map((s) => (
                <button
                  key={s}
                  className={`shape-btn ${shape === s ? 'shape-btn--active' : ''}`}
                  onClick={() => setShape(s)}
                >
                  <span className="shape-btn-icon">
                    {s === 'Carré' ? '⬛' : s === 'Cercle' ? '⭕' : '🌀'}
                  </span>
                  <span>{s}</span>
                </button>
              ))}
            </div>

            <select
              className="shape-select"
              value={shape}
              onChange={(e) => setShape(e.target.value)}
            >
              {SHAPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Shape info */}
          <div className="shape-info-box">
            <div className="shape-info-row">
              <span className="shape-info-key">Forme</span>
              <span className="shape-info-val">{shape}</span>
            </div>
            {shape === 'Carré' && (
              <>
                <div className="shape-info-row">
                  <span className="shape-info-key">Côté</span>
                  <span className="shape-info-val">150 mm</span>
                </div>
                <div className="shape-info-row">
                  <span className="shape-info-key">Périmètre</span>
                  <span className="shape-info-val">600 mm</span>
                </div>
              </>
            )}
            {shape === 'Cercle' && (
              <>
                <div className="shape-info-row">
                  <span className="shape-info-key">Rayon</span>
                  <span className="shape-info-val">90 mm</span>
                </div>
                <div className="shape-info-row">
                  <span className="shape-info-key">Périmètre</span>
                  <span className="shape-info-val">565 mm</span>
                </div>
              </>
            )}
            {shape === 'Spirale' && (
              <>
                <div className="shape-info-row">
                  <span className="shape-info-key">Tours</span>
                  <span className="shape-info-val">4</span>
                </div>
                <div className="shape-info-row">
                  <span className="shape-info-key">R max</span>
                  <span className="shape-info-val">100 mm</span>
                </div>
              </>
            )}
          </div>

          {/* Speed control */}
          <div className="speed-section">
            <div className="speed-header">
              <span className="speed-label">Vitesse</span>
              <span className="speed-value speed-value--blue">{speed} mm/s</span>
            </div>
            <div className="speed-slider-row">
              <span className="speed-icon">🐢</span>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="speed-slider speed-slider--blue"
              />
              <span className="speed-icon">🐇</span>
            </div>
          </div>

          {/* Calibration */}
          <button className="calibrate-btn calibrate-btn--blue">
            ⚙ Calibration
          </button>
        </div>

        {/* Right preview panel */}
        <div className="drawing-panel">
          <div className="drawing-panel-header">
            <span>Aperçu en temps réel — {shape}</span>
            <span className="shape-live-badge">● Live</span>
          </div>

          <div className="canvas-area">
            <ShapePreview shape={shape} speed={speed} />
          </div>

          {/* Realtime coords */}
          <div className="realtime-coords realtime-coords--blue">
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

export default FormesPredefinie;
