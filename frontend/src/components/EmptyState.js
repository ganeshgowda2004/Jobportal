import React from 'react';

export default function EmptyState({ title = 'Nothing here yet', subtitle = 'Try adjusting your filters or come back later.', action }) {
  return (
    <div className="border rounded-lg p-6 text-center bg-white">
      <h3 className="text-gray-900 font-medium">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}