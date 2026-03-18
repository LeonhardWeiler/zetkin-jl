// src/components/ActionGrid.jsx
import React from 'react';
import ActionCard from './ActionCard';

export default function ActionGrid({ actions }) {
  if (!actions || actions.length === 0) {
    return <p>Keine Aktionen gefunden.</p>;
  }

  return (
    <div className="grid-container">
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}
