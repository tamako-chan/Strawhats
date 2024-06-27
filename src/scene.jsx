import React, { useState } from 'react';
import MeshSelection from './meshselection'; // Assuming correct file name casing
import Hierarchy from './Hierarchy';
import Model from './Model';
import MeshGrouping from './meshgrouping';

export default function Scene({ importedScene }) {
  const [selectedMeshName, setSelectedMeshName] = useState(null);
  const [selectedObjects, setSelectedObjects] = useState([]);

  const handleItemClick = (name) => {
    setSelectedMeshName(name);
  };

  return (
    <>
      <MeshSelection selectedMeshName={selectedMeshName} />
      <MeshGrouping
        selectedObjects={selectedObjects}
        onGroupCreated={() => setSelectedObjects([])}
      />
      <Hierarchy onItemClick={handleItemClick} />
      <Model importedScene={importedScene} />
    </>
  );
}
