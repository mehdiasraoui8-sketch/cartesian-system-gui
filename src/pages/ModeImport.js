import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeImport.css';

function ModeImport() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('Mode import');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [coords] = useState({ x: 0, y: 0, z: 0 });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const progressInterval = useRef(null);

  const handleModeChange = (e) => {
    const val = e.target.value;
    setMode(val);
    if (val === 'Mode manuel') navigate('/mode-manuel');
    if (val === 'Formes prédefinies') navigate('/formes-predefinie');
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['.gcode', '.svg', '.nc', '.g'];
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert('Seuls les fichiers G-code ou SVG sont acceptés.');
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
    setProgress(0);
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    let current = 0;
    progressInterval.current = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(progressInterval.current);
        setUploading(false);
        setUploaded(true);
      }
      setProgress(Math.round(current));
    }, 200);
  };

  const handleCancel = () => {
    clearInterval(progressInterval.current);
    setFile(null);
    setProgress(0);
    setUploading(false);
    setUploaded(false);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="screen screen--import">
      {/* Header */}
      <header className="screen-header">
        <div className="screen-header-left">
          <div className="color-bar color-bar--yellow"></div>
          <h2 className="screen-title">Mode Import:</h2>
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
          {/* Upload zone */}
          <div
            className={`upload-zone ${dragOver ? 'upload-zone--over' : ''} ${file ? 'upload-zone--has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".gcode,.svg,.nc,.g"
              style={{ display: 'none' }}
              onChange={handleInputChange}
            />

            {file ? (
              <div className="file-selected">
                <span className="file-icon">📄</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
            ) : (
              <>
                <div className="upload-cloud-icon">☁</div>
                <h3 className="upload-title">Sélectionner votre fichier</h3>
                <p className="upload-subtitle">G-code ou svg seul sont acceptées</p>
                <button
                  className="select-file-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                >
                  Selectionner
                </button>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="upload-actions">
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={!file && !uploading}
            >
              cancel
            </button>
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={!file || uploading || uploaded}
            >
              {uploading ? 'En cours...' : uploaded ? '✓ Terminé' : 'upload'}
            </button>
          </div>

          {/* Estimation */}
          {file && (
            <div className="estimation-box">
              <span className="estimation-label">Estimation</span>
              <span className="estimation-time">9:41</span>
            </div>
          )}

          {/* Speed control */}
          <div className="speed-section">
            <div className="speed-header">
              <span className="speed-label">Vitesse</span>
              <span className="speed-value speed-value--yellow">50 mm/s</span>
            </div>
            <div className="speed-slider-row">
              <span className="speed-icon">🐢</span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="speed-slider speed-slider--yellow"
              />
              <span className="speed-icon">🐇</span>
            </div>
          </div>

          {/* Calibration */}
          <button className="calibrate-btn calibrate-btn--yellow">
            ⚙ Calibration
          </button>
        </div>

        {/* Right progress panel */}
        <div className="drawing-panel">
          <div className="drawing-panel-header">
            <span>Progression</span>
            {uploaded && <span className="upload-done-badge">✓ Fichier chargé</span>}
          </div>

          <div className="progress-panel">
            {!file ? (
              <div className="canvas-placeholder">
                <span className="canvas-placeholder-icon">📂</span>
                <span>Aucun fichier sélectionné</span>
              </div>
            ) : (
              <div className="progress-content">
                {/* File info */}
                <div className="progress-file-info">
                  <div className="progress-file-icon">
                    {file.name.endsWith('.svg') ? '🖼' : '⚙'}
                  </div>
                  <div className="progress-file-details">
                    <span className="progress-file-name">{file.name}</span>
                    <span className="progress-file-size">{formatSize(file.size)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-pct">{progress}%</span>
                </div>

                {/* Status */}
                <div className="progress-status">
                  {uploading && <span className="status-text status-text--loading">⏳ Chargement en cours...</span>}
                  {uploaded && <span className="status-text status-text--done">✅ Fichier prêt à l'exécution</span>}
                  {!uploading && !uploaded && progress === 0 && (
                    <span className="status-text status-text--idle">Cliquez sur "upload" pour commencer</span>
                  )}
                </div>

                {/* Preview lines (simulated G-code path) */}
                {uploaded && (
                  <div className="gcode-preview">
                    <svg viewBox="0 0 300 200" className="gcode-svg">
                      <defs>
                        <pattern id="grid-import" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(205,220,57,0.1)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="300" height="200" fill="url(#grid-import)" />
                      <polyline
                        points="20,180 60,80 100,120 140,40 180,100 220,60 260,90 280,30"
                        fill="none"
                        stroke="#cddc39"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      />
                      <circle cx="20" cy="180" r="4" fill="#2ecc71" />
                      <circle cx="280" cy="30" r="4" fill="#ff5252" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Realtime coords */}
          <div className="realtime-coords realtime-coords--yellow">
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

export default ModeImport;
