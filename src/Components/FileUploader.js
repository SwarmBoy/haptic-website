// src/components/FileUploader.js
import React from 'react';

function FileUploader({ onFileLoaded, onFileSupress }) {
  const handleFileUpload = (e) => {
    console.log(e.target.files);
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

  const suppressData = () => {
    //reset the imput file
    const input = document.querySelector('input[type="file"]');
    input.value = '';

    onFileSupress();
  };

  return (
    <div>
      <input type="file" accept=".haptic" onChange={handleFileUpload} />
      <button  onClick={suppressData}>Suppress Data</button>
    </div>
  );
}

export default FileUploader;
