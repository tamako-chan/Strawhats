import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export function exportModel(scene, options, callback) {
  const exporter = new GLTFExporter();

  exporter.parse(scene, (gltf) => {
    const json = JSON.stringify(gltf);
    const originalSize = new Blob([json]).size;

    if (options.binary) {
      const blob = new Blob([json], { type: 'application/octet-stream' });
      const reader = new FileReader();
      reader.onload = function () {
        const arrayBuffer = this.result;
        const compressedSize = arrayBuffer.byteLength;

        if (callback) {
          callback(originalSize, compressedSize);
        }

        const url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/octet-stream' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.glb';
        a.click();
      };
      reader.readAsArrayBuffer(blob);
    } else {
      const compressedSize = originalSize;

      if (callback) {
        callback(originalSize, compressedSize);
      }

      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'model.gltf';
      a.click();
    }
  }, options);
}
