import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useThree } from '@react-three/fiber';

const Search = ({ setSearchTerm, hierarchyRefs }) => {
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const searchTerm = event.target.value.toLowerCase();
      setSearchTerm(searchTerm);

      for (const ref of Object.values(hierarchyRefs.current)) {
        if (ref.current && ref.current.innerText.toLowerCase().includes(searchTerm)) {
          ref.current.click();
          ref.current.style.backgroundColor = '#FFFF00'; // Highlight
        } else if (ref.current) {
          ref.current.style.backgroundColor = 'transparent'; // Remove highlight if not matched
        }
      }
    }
  };

  useEffect(() => {
    const searchbarContainer = document.getElementById('searchbar');
    if (searchbarContainer) {
      const searchbar = (
        <input
          type="text"
          placeholder="Search..."
          onKeyDown={handleSearch}
          style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
        />
      );
      const root = ReactDOM.createRoot(searchbarContainer);
      root.render(searchbar);
    } else {
      console.log('Searchbar container not found');
    }
  }, []);

  return null;
};

export default Search;
