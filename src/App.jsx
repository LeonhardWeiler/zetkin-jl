import { useEffect, useState } from 'react';
import './App.css';
import ActionGrid from './components/ActionGrid';

const ORG_IDS = [
  1276, 1277, 1286, 1292, 1296, 1295, 1293, 1294, 1297,
  1288, 1289, 1291, 1290, 1280, 1285, 1279, 1278, 1282, 1284, 1283, 1281
];

const CACHE_KEY = 'zetkinActions';
const CACHE_TTL = 1000 * 60 * 5; // 5 Minuten

function App() {
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        setActions(data);
        return; // Daten aus Cache nehmen
      }
    }

    // Fetch von API
    Promise.all(
      ORG_IDS.map((id) =>
        fetch(`/api/orgs/${id}/actions?filter=start_time>=2026-03-18T00:00:00Z`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then((data) => data.data || [])
      )
    )
      .then((results) => {
        const merged = results.flat();
        merged.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setActions(merged);

        // Daten im Cache speichern
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: merged })
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="app-container">
      <h1>Zetkin Aktionen</h1>
      {error && <div className="error">Error: {error}</div>}
      {!error && <ActionGrid actions={actions} />}
    </div>
  );
}

export default App;
