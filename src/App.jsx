import { useEffect, useState } from 'react';

function App() {
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/orgs/1276/actions?filter=start_time>=2026-03-18T15:45:23.768Z')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setActions(data.data || []))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zetkin Aktionen</h1>
      {actions.length === 0 ? (
        <p>Keine Aktionen gefunden.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {actions.map((action) => (
            <li key={action.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <h2>{action.title}</h2>
              <p>
                <strong>Start:</strong> {new Date(action.start_time).toLocaleString()} <br />
                <strong>Ende:</strong> {new Date(action.end_time).toLocaleString()}
              </p>
              {action.location && (
                <p>
                  <strong>Ort:</strong> {action.location.title}
                </p>
              )}
              {action.activity && <p><strong>Activity:</strong> {action.activity.title}</p>}
              {action.url && (
                <p>
                  <a href={action.url} target="_blank" rel="noopener noreferrer">
                    Anmeldung / Details
                  </a>
                </p>
              )}
              {action.cover_file && (
                <img src={action.cover_file.url} alt={action.cover_file.original_name} style={{ maxWidth: '300px' }} />
              )}
              <p>{action.info_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
