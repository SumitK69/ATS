import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert("Only PDF and DOCX files are allowed!");
      return;
    }
    alert(`File uploaded: ${acceptedFiles[0].name}`);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDrop,
  });

  return (
    <div>
      <h2>File Upload</h2>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          width: "300px",
          margin: "20px auto",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <p>Drag and drop a file here, or click to select one.</p>
        <p>(PDF and DOCX formats only)</p>
      </div>
    </div>
  );
};

export default FileUpload;
