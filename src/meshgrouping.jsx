import React, { useState, useEffect } from 'react';

const MeshGrouping = ({ selectedObjects, onGroupCreated }) => {
  const groupSelectedMeshes = () => {
    if (selectedObjects.length < 2) {
      alert('Select at least two objects to create a group.');
      return;
    }

    const parentObject = selectedObjects[0];
    const childrenObjects = selectedObjects.slice(1);

    // Set parent-child relationship
    childrenObjects.forEach(child => {
      parentObject.add(child);
    });

    // Optionally, you can perform further operations or updates here

    // Clear selection
    onGroupCreated();
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'g' || event.key === 'G') {
        const confirmGroup = window.confirm('Do you want to create a group of selected meshes?');
        if (confirmGroup && selectedObjects.length > 0) {
          groupSelectedMeshes();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);

  }, [selectedObjects]);

  return null;
};

export default MeshGrouping;
