import { useState, useEffect } from 'react';
import { checkApiHealth } from '../api';

/**
 * ApiStatus — shows a live dot indicating whether the backend is reachable.
 */
export default function ApiStatus() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const ok = await checkApiHealth();
      if (!cancelled) setOnline(ok);
    }

    check();
    const interval = setInterval(check, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const dotClass =
    online === null
      ? 'api-status__dot'
      : online
        ? 'api-status__dot api-status__dot--online'
        : 'api-status__dot api-status__dot--offline';

  const label =
    online === null ? 'Checking API…' : online ? 'API Online' : 'API Offline';

  return (
    <span className="api-status" id="api-status">
      <span className={dotClass} />
      {label}
    </span>
  );
}
