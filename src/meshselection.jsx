import React, { useState, useEffect, useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { Clock } from 'three';

extend({ EffectComposer, RenderPass, OutlinePass });

const MeshSelection = ({ selectedObject, selectedMeshName }) => {
  const { scene, camera, gl, size } = useThree();
  const [composer] = useState(() => new EffectComposer(gl));
  const [outlinePass] = useState(() => new OutlinePass(size, scene, camera));
  const [selectedObjects, setSelectedObjects] = useState([]);
  const hoveredObjectRef = useRef(null);
  const clock = new Clock();

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(outlinePass);

    return () => {
      composer.removePass(renderPass);
      composer.removePass(outlinePass);
    };
  }, [composer, scene, camera, outlinePass]);

  useEffect(() => {
    outlinePass.visibleEdgeColor.set(selectedObjects.length > 0 ? '#ffff00' : '#ff0000');
    outlinePass.edgeGlow = 2;
    outlinePass.edgeThickness = 3;
    outlinePass.selectedObjects = selectedObject ? [selectedObject] : selectedObjects;
  }, [outlinePass, selectedObjects, selectedObject]);

  useFrame(() => {
    composer.render();
  }, 1);

  useFrame(({ raycaster, mouse }) => {
    if (clock.getElapsedTime() > 0.5) {
      clock.start();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const selected = intersects[0].object;
        if (selected !== hoveredObjectRef.current) {
          hoveredObjectRef.current = selected;
          if (!selectedObjects.includes(selected)) {
            outlinePass.selectedObjects = selectedObject ? [selectedObject] : [...selectedObjects, selected];
          }
        }
      } else if (hoveredObjectRef.current) {
        hoveredObjectRef.current = null;
      }
    }
  });

  useEffect(() => {
    if (selectedMeshName) {
      const selectedObject = scene.getObjectByName(selectedMeshName);
      if (selectedObject) {
        setSelectedObjects([selectedObject]);
        outlinePass.selectedObjects = [selectedObject];
        outlinePass.visibleEdgeColor.set('#ffff00');
      } else {
        setSelectedObjects([]);
        outlinePass.selectedObjects = [];
      }
    } else {
      setSelectedObjects([]);
      outlinePass.selectedObjects = [];
    }
  }, [selectedMeshName, scene, outlinePass]);

  useEffect(() => {
    const handleClick = (event) => {
      if (hoveredObjectRef.current) {
        const selectedObject = hoveredObjectRef.current;
        if (selectedObjects.includes(selectedObject)) {
          // Deselect if already selected
          const filteredSelection = selectedObjects.filter(obj => obj !== selectedObject);
          setSelectedObjects(filteredSelection);
          outlinePass.selectedObjects = selectedObject ? [selectedObject] : filteredSelection;
        } else {
          // Select if not already selected
          setSelectedObjects([...selectedObjects, selectedObject]);
          outlinePass.selectedObjects = selectedObject ? [selectedObject] : [...selectedObjects, selectedObject];

          // Example of accessing name for content
          const content = `Selected mesh: ${selectedObject.name}`;
          const accessBar = document.getElementById('accessbar');
          if (accessBar) {
            accessBar.textContent = content;
          }
        }
        outlinePass.visibleEdgeColor.set('#ffff00');
      } else {
        setSelectedObjects([]);
        outlinePass.selectedObjects = selectedObject ? [selectedObject] : [];
        const accessBar = document.getElementById('accessbar');
        if (accessBar) {
          accessBar.textContent = '';
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);

  }, [selectedObjects, selectedObject, scene, outlinePass]);

  return null;
};

export default MeshSelection;
