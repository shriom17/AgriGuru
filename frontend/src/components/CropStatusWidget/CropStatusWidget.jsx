import React, { useState, useRef } from 'react';
import { analyzeCropImage, validateImageFile, getAnalysisHistory } from '../../services/cropAnalysisService';
import './CropStatusWidget.css';

const CropStatusWidget = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setSelectedImage(file);
      setError(null);
      setAnalysis(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      
      const result = await analyzeCropImage(selectedImage);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Simulate file input change
      const fakeEvent = { target: { files: [file] } };
      handleImageSelect(fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const analysisHistory = getAnalysisHistory();

  return (
    <div className="crop-status-widget">
      <div className="widget-header">
        <h3>🌱 Crop Health Analysis</h3>
        <div className="header-actions">
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="history-btn"
            title="View Analysis History"
          >
            📊
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Image Upload Section */}
      <div className="upload-section">
        <div 
          className={`upload-area ${selectedImage ? 'has-image' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="image-preview">
              <img src={imagePreview} alt="Crop preview" />
              <div className="image-overlay">
                <button onClick={(e) => { e.stopPropagation(); handleClear(); }} className="clear-btn">
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📸</div>
              <p>Click to upload or drag & drop</p>
              <small>JPEG, PNG, WebP (max 10MB)</small>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageSelect}
          className="file-input"
        />
      </div>

      {/* Action Buttons */}
      {selectedImage && (
        <div className="action-buttons">
          <button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="analyze-btn"
          >
            {analyzing ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              '🔍 Analyze Crop'
            )}
          </button>
          <button onClick={handleClear} className="clear-action-btn">
            Clear
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="analysis-results">
          <div className="result-header">
            <div 
              className="status-indicator" 
              style={{ backgroundColor: analysis.color }}
            >
              <span className="status-text">{analysis.status}</span>
            </div>
            <div className="confidence">
              <span className="confidence-label">Confidence:</span>
              <span className="confidence-value">{(analysis.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="result-details">
            <p className="description">{analysis.description}</p>
            
            {analysis.cropType && (
              <div className="crop-info">
                <strong>Detected Crop:</strong> {analysis.cropType}
              </div>
            )}

            <div className="recommendations">
              <h4>💡 Recommendations:</h4>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {analysis.additionalInfo && (
              <div className="additional-info">
                <small>
                  Analysis Time: {analysis.additionalInfo.analysisTime} | 
                  Image Size: {analysis.additionalInfo.imageSize}
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis History */}
      {showHistory && (
        <div className="analysis-history">
          <h4>📈 Recent Analyses</h4>
          <div className="history-list">
            {analysisHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-info">
                  <span className="history-status">{item.status}</span>
                  <span className="history-crop">{item.cropType}</span>
                </div>
                <div className="history-meta">
                  <span className="history-confidence">{(item.confidence * 100).toFixed(0)}%</span>
                  <span className="history-date">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {analyzing && (
        <div className="analysis-overlay">
          <div className="analysis-progress">
            <div className="progress-spinner"></div>
            <p>Analyzing your crop image...</p>
            <small>This may take a few moments</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropStatusWidget;
