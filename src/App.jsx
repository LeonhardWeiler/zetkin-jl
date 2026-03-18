import { useEffect, useState } from 'react';
import './App.css';

const ORG_IDS = [
  1276, 1277, 1286, 1292, 1296, 1295, 1293, 1294, 1297,
  1288, 1289, 1291, 1290, 1280, 1285, 1279, 1278, 1282, 1284, 1283, 1281
];

function App() {
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      <h1>Zetkin Aktionen</h1>
      {actions.length === 0 ? (
        <p>Keine Aktionen gefunden.</p>
      ) : (
        <div className="grid-container">
          {actions.map((action) => (
            <div key={action.id} className="card">
              <h2>{action.title}</h2>

              <img
                src={
                  action.cover_file?.url ||
                  'https://via.placeholder.com/300x150?text=Kein+Bild'
                }
                alt={action.cover_file?.original_name || 'Kein Bild'}
              />

              <p>
                <strong>Start:</strong> {new Date(action.start_time).toLocaleString()} <br />
                <strong>Ende:</strong> {new Date(action.end_time).toLocaleString()}
              </p>

              {action.organization && (
                <p>
                  <strong>Organisation:</strong> {action.organization.title}
                </p>
              )}

              {action.location && (
                <p>
                  <strong>Ort:</strong> {action.location.title}
                </p>
              )}

              {action.activity && (
                <p>
                  <strong>Activity:</strong> {action.activity.title}
                </p>
              )}

              {action.url && (
                <p>
                  <a href={action.url} target="_blank" rel="noopener noreferrer">
                    Anmeldung / Details
                  </a>
                </p>
              )}

              {action.info_text && <p className="info-text">{action.info_text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
