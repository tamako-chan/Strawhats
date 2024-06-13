import React from 'react';

function ImportContainer({ onImport }) {
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  
}

export default ImportContainer;
