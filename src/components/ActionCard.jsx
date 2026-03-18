// src/components/ActionCard.jsx
import React from 'react';

export default function ActionCard({ action }) {
  return (
    <div className="card">
      <h2>{action.title}</h2>

      {action.cover_file?.url && (
        <img
          src={action.cover_file.url}
          alt={action.cover_file.original_name || 'Bild'}
        />
      )}

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
  );
}
