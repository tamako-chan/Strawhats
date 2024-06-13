import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Scene from './components/Scene';
import ImportContainer from './components/ImportContainer';
import { importModel } from './functions/Import';
import { exportModel } from './functions/Export';
import { mergeMeshes } from './functions/Merge';
import './App.css';

export default function App() {
  const sceneRef = useRef();
  const [mergeMessage, setMergeMessage] = useState(null);
  const [originalPath, setOriginalPath] = useState("");
  const [originalSize, setOriginalSize] = useState(null);

  const handleMeshMerge = () => {
    console.log('handleMeshMerge called');
    const scene = sceneRef.current;
    const geometries = [];

    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        geometries.push(child.geometry);
      }
    });

    console.log('Geometries found:', geometries.length);

    if (geometries.length === 0) {
      setMergeMessage({ message: 'No geometries found in the model', color: 'red' });
      console.log('No geometries found in the model');
      return;
    }

    try {
      mergeMeshes(geometries, scene);
      setMergeMessage({ message: 'Mesh merging successful! :)', color: 'green' });
      console.log('Mesh merging successful');
    } catch (error) {
      console.error('Mesh merging failed:', error);
      setMergeMessage({ message: 'Mesh merging unavailable for this model :(', color: 'red' });
    }

    setTimeout(() => {
      setMergeMessage(null);
    }, 3000);
  };

  const handleExport = () => {
    const options = {
      binary: true,
      trs: false,
      onlyVisible: true,
      truncateDrawRange: true,
      embedImages: true
    };
    //console.log('Exporting model with options:', options);
    exportModel(sceneRef.current, options, originalPath, originalSize, (compressedBlob) => {
      const compressionRatio = (originalSize / compressedBlob.size).toFixed(3);
      const percentageReduction = ((1 - (compressedBlob.size / originalSize)) * 100).toFixed(2);
      console.log("Compression Ratio: ", compressionRatio);
      console.log("Percentage Reduction: ", percentageReduction + "%");
    });
  };

  const handleImport = (file) => {
    console.log('Importing file:', file.name);
    setOriginalPath(file.name); // Save the original file path
    setOriginalSize(file.size); // Save the original file size
    importModel(file, (importedScene) => {
      console.log('Model imported successfully');
      sceneRef.current.clear();
      sceneRef.current.add(importedScene);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Size of Uploaded Model:", file.size,"bytes");
      handleImport(file);
    }
  };

  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <directionalLight intensity={7.0} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <Scene sceneRef={sceneRef} />
        <Stats />
      </Canvas>
      <h1>DRACO Model Compressor</h1>
      <div className="bottom-right-panel">
        <div className="button-group">
          <button className="panel-button" onClick={handleExport}>Download</button>
        </div>
      </div>
      <div className="bottom-left-panel">
        <div className="button-group">
          <input 
            type="file" 
            className="panel-button" 
            onChange={handleFileChange} 
            accept=".glb, .gltf"
          />
        </div>
      </div>
      {mergeMessage && (
        <div className="merge-message" style={{ backgroundColor: mergeMessage.color }}>
          <p>{mergeMessage.message}</p>
        </div>
      )}
      <ImportContainer onImport={handleImport} />
    </div>
  );
}
