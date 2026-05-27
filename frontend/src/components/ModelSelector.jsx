const MODELS = [
  {
    id: 'lstm',
    name: 'LSTM',
    emoji: '🧠',
    description: 'Long Short-Term Memory — great at capturing sequential patterns in email text',
  },
  {
    id: 'gru',
    name: 'GRU',
    emoji: '⚡',
    description: 'Gated Recurrent Unit — lightweight and fast with competitive accuracy',
  },
  {
    id: 'transformer',
    name: 'Transformer',
    emoji: '🤖',
    description: 'BERT-based model — best contextual understanding of complex phishing',
  },
];

/**
 * ModelSelector — toggle cards for choosing which models to run.
 */
export default function ModelSelector({ selected, onToggle }) {
  return (
    <section className="model-selector" id="model-selector">
      <div className="model-selector__header">
        <span className="model-selector__icon">🔬</span>
        <h2 className="model-selector__title">Select Models</h2>
      </div>

      <div className="model-selector__grid">
        {MODELS.map((m) => {
          const isSelected = selected.includes(m.id);
          const classes = [
            'model-card',
            `model-card--${m.id}`,
            isSelected && 'model-card--selected',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={m.id}
              id={`model-toggle-${m.id}`}
              className={classes}
              onClick={() => onToggle(m.id)}
              type="button"
              aria-pressed={isSelected}
            >
              <span className="model-card__check">✓</span>
              <span className="model-card__emoji">{m.emoji}</span>
              <span className="model-card__name">{m.name}</span>
              <span className="model-card__desc">{m.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
