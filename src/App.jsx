import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './scene';
import { importModel } from './Import';
import './App.css';

export default function App() {
  const [importedScenes, setImportedScenes] = useState([]);

  const handleImport = (file) => {
    importModel(file, (importedScene) => {
      setImportedScenes(prevScenes => [...prevScenes, importedScene]);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };

  return (
    <div className='scene'>
      <div className='sidebar' id='sidebar'>
        <div className='searchbar' id='searchbar'></div>
        <div className='hierarchy' id='hierarchy'></div>
      </div>

      <div className='viewport'>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".glb, .gltf"
        />
        <Canvas camera={{ position: [2, 2, 2] }} style={{ background: '#242222' }}>
          <ambientLight intensity={0.1} />
          <directionalLight color="white" position={[2, 2, 2]} intensity={10}/>
          <directionalLight color="white" position={[2,2,-2]} intensity={10}/>
          <directionalLight color="white" position={[-2,2,2]} intensity={10}/>
          <directionalLight color="white" position={[-2,-2,-2]} intensity={10}/>
          {importedScenes.map((scene, index) => (
            <Scene key={index} importedScene={scene} />
          ))}
          <OrbitControls />
        </Canvas>
        <div className='accessbar' id='accessbar'></div>
      </div>
    </div>
  );
}
