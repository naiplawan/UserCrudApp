import React from 'react';
import { ExportButtonProps } from '@/app/interface/index';

const ExportButton = ({ data }: ExportButtonProps) => {
  const handleExport = async () => {
    const response = await fetch('/api/createNewSheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();
    if (response.ok) {
      window.open(result.url, '_blank');
    } else {
      console.error(result.error);
    }
  };

  return (
    <button onClick={handleExport} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
      Export to New Google Sheet
    </button>
  );
};

export default ExportButton;
