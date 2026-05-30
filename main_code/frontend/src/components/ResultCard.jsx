import { useMemo } from 'react';

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MODEL_META = {
  lstm: { emoji: '🧠', label: 'LSTM', badge: 'result-card__model-badge--lstm' },
  gru: { emoji: '⚡', label: 'GRU', badge: 'result-card__model-badge--gru' },
  transformer: { emoji: '🤖', label: 'Transformer', badge: 'result-card__model-badge--transformer' },
};

function getSeverity(probability) {
  if (probability >= 0.6) return 'danger';
  if (probability >= 0.4) return 'warning';
  return 'safe';
}

/**
 * ResultCard — displays a single model's prediction with an animated gauge ring.
 */
export default function ResultCard({ modelName, result }) {
  const meta = MODEL_META[modelName] || MODEL_META.lstm;

  // Handle error state
  if (result.error) {
    return (
      <article className="glass-card result-card" id={`result-${modelName}`}>
        <div className="result-card__scan-line" />
        <div className="result-card__model-header">
          <div className="result-card__model-name">
            <span className="result-card__model-emoji">{meta.emoji}</span>
            <span className="result-card__model-label">{meta.label}</span>
          </div>
          <span className={`result-card__model-badge ${meta.badge}`}>{modelName}</span>
        </div>
        <div className="error-banner" style={{ marginTop: 0 }}>
          <span className="error-banner__icon">⚠️</span>
          <span className="error-banner__text">{result.error}</span>
        </div>
      </article>
    );
  }

  const probability = result.probability;
  const percent = (probability * 100).toFixed(1);
  const severity = getSeverity(probability);

  const dashOffset = useMemo(
    () => CIRCUMFERENCE - (probability * CIRCUMFERENCE),
    [probability]
  );

  return (
    <article className="glass-card result-card" id={`result-${modelName}`}>
      <div className="result-card__scan-line" />

      {/* Header */}
      <div className="result-card__model-header">
        <div className="result-card__model-name">
          <span className="result-card__model-emoji">{meta.emoji}</span>
          <span className="result-card__model-label">{meta.label}</span>
        </div>
        <span className={`result-card__model-badge ${meta.badge}`}>{modelName}</span>
      </div>

      {/* Gauge */}
      <div className="gauge">
        <div className="gauge__ring">
          <svg className="gauge__svg" viewBox="0 0 140 140">
            <circle className="gauge__bg" cx="70" cy="70" r={RADIUS} />
            <circle
              className={`gauge__fill gauge__fill--${severity}`}
              cx="70"
              cy="70"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="gauge__value">
            <div className={`gauge__percent gauge__percent--${severity}`}>
              {percent}%
            </div>
            <div className="gauge__label-small">phishing</div>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`verdict verdict--${severity}`}>
        <span className="verdict__icon">
          {severity === 'danger' ? '🚨' : severity === 'warning' ? '⚠️' : '✅'}
        </span>
        <span>{result.prediction}</span>
      </div>
    </article>
  );
}
