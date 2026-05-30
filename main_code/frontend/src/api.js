const API_BASE = 'http://127.0.0.1:8000';

/**
 * Check if the backend API is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(API_BASE, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Run phishing prediction against a specific model.
 * @param {'lstm' | 'gru' | 'transformer'} modelName
 * @param {{ subject: string, body: string, sender: string, timestamp: string }} emailData
 * @returns {Promise<{ model: string, probability: number, prediction: string }>}
 */
export async function predictEmail(modelName, emailData) {
  const res = await fetch(`${API_BASE}/predict/${modelName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Run predictions against multiple models in parallel.
 * @param {string[]} modelNames
 * @param {{ subject: string, body: string, sender: string, timestamp: string }} emailData
 * @returns {Promise<Object.<string, { model: string, probability: number, prediction: string }>>}
 */
export async function predictAllModels(modelNames, emailData) {
  const results = {};
  const settled = await Promise.allSettled(
    modelNames.map(async (name) => {
      try {
        const result = await predictEmail(name, emailData);
        return { name, result };
      } catch (err) {
        return { name, error: err.message || 'Unknown error' };
      }
    })
  );

  for (const outcome of settled) {
    const { name, result, error } = outcome.value;
    if (error) {
      results[name] = { error };
    } else {
      results[name] = result;
    }
  }

  return results;
}
