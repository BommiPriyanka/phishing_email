import { useState, useCallback } from 'react';
import { predictAllModels } from './api';

import ShieldIcon from './components/ShieldIcon';
import ApiStatus from './components/ApiStatus';
import EmailForm from './components/EmailForm';
import ModelSelector from './components/ModelSelector';
import ResultCard from './components/ResultCard';

const DEFAULT_FORM = {
  sender: '',
  subject: '',
  body: '',
  timestamp: '',
};

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [selectedModels, setSelectedModels] = useState(['lstm', 'transformer']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleModel = useCallback((id) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  const handleAnalyze = useCallback(async () => {
    const hasContent =
      formData.sender.trim() ||
      formData.subject.trim() ||
      formData.body.trim();

    if (!hasContent) {
      setError('Please enter at least a sender, subject, or email body before analyzing.');
      return;
    }
    if (selectedModels.length === 0) {
      setError('Please select at least one model.');
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const data = await predictAllModels(selectedModels, formData);
      setResults(data);
    } catch (err) {
      setError(
        err.message ||
          'Failed to reach the backend. Make sure the API is running on http://127.0.0.1:8000'
      );
    } finally {
      setLoading(false);
    }
  }, [formData, selectedModels]);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleAnalyze();
      }
    },
    [handleAnalyze]
  );

  return (
    <div className="app-container" onKeyDown={handleKeyDown}>
      {/* ── Header ── */}
      <header className="header">
        <div className="header__logo-row">
          <ShieldIcon className="header__shield" />
          <h1 className="header__title">PhishGuard AI</h1>
        </div>
        <p className="header__subtitle">
          Enterprise-grade phishing email detection powered by LSTM, GRU &amp;
          Transformer deep learning models
        </p>
        <div className="header__badge">
          <span className="header__badge-dot" />
          <ApiStatus />
        </div>
      </header>

      {/* ── Email Input ── */}
      <EmailForm formData={formData} onChange={setFormData} />

      {/* ── Model Selector ── */}
      <ModelSelector selected={selectedModels} onToggle={toggleModel} />

      {/* ── Analyze Button ── */}
      <div className="analyze-section">
        <button
          id="analyze-btn"
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
          type="button"
        >
          {loading ? (
            <>
              <span className="analyze-btn__spinner" />
              Analyzing…
            </>
          ) : (
            <>🛡️ Analyze Email</>
          )}
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="error-banner" id="error-banner">
          <span className="error-banner__icon">❌</span>
          <span className="error-banner__text">{error}</span>
        </div>
      )}

      {/* ── Results ── */}
      {results && (
        <section className="results" id="results-section">
          <div className="results__header">
            <span className="results__icon">📊</span>
            <h2 className="results__title">Analysis Results</h2>
          </div>

          <div className="results__grid">
            {Object.entries(results).map(([name, result]) => (
              <ResultCard key={name} modelName={name} result={result} />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty State ── */}
      {!results && !loading && !error && (
        <div className="empty-state" id="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__text">
            Enter an email and click <strong>Analyze</strong> to get started
          </p>
          <p className="empty-state__hint">
            Press <kbd>⌘</kbd>+<kbd>Enter</kbd> for quick analysis
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__divider" />
        <p className="footer__text">
          PhishGuard AI — Phishing Email Detection System
        </p>
        <div className="footer__tech">
          <span className="footer__tag">React</span>
          <span className="footer__tag">FastAPI</span>
          <span className="footer__tag">TensorFlow</span>
          <span className="footer__tag">PyTorch</span>
          <span className="footer__tag">BERT</span>
        </div>
      </footer>
    </div>
  );
}
