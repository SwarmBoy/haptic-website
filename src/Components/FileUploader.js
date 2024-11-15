// src/components/FileUploader.js
import React from 'react';

function FileUploader({ onFileLoaded }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.haptic')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          onFileLoaded(jsonData);
        } catch (error) {
          alert('Invalid .haptic file format.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .haptic file.');
    }
  };

  return (
    <div>
      <input type="file" accept=".haptic" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUploader;
