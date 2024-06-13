import { saveAs } from 'file-saver';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export const exportModel = (scene, options, originalPath, originalSize, onExport) => {
  const exporter = new GLTFExporter();
  const getFileNameFromPath = (filePath) => {
    const pathArray = filePath.split("/");
    const fileName = pathArray[pathArray.length - 1];
    return fileName;
  };

  const originalName = getFileNameFromPath(originalPath);
  const compressedFileName = `${originalName.split('.glb')[0]}_compressed.glb`;

  try {
    exporter.parse(
      scene,
      (result) => {
        const output = options.binary ? result : JSON.stringify(result, null, 2);
        const compressedBlob = new Blob([output], { type: options.binary ? 'application/octet-stream' : 'application/json' });
        saveAs(compressedBlob, compressedFileName);
        console.log('Compressed file saved as:', compressedFileName)
        console.log('Size of Compressed Model:', compressedBlob.size, 'bytes');
        if (onExport) onExport(compressedBlob); // Call the callback with the compressed blob
      },
      (error) => {
        console.error('An error occurred during parsing', error);
      },
      options
    );
  } catch (error) {
    console.error('An unexpected error occurred during export:', error);
  }
};
