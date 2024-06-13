import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

function Scene({ sceneRef }) {
  const { gl } = useThree();
  const dracoLoader = useRef(new DRACOLoader()).current;

  useEffect(() => {
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }, [dracoLoader]);

  return (
    <group ref={sceneRef} />
  );
}

export default Scene;