// FileDropZone.tsx
import { useState } from "react";
import axios from "axios";

export default function FileDropZone() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", droppedFile);

    try {
      axios.post("http://localhost:3000/upload/upload", formData)
        .then(response => {
          console.log("Upload success:", response.data);
          alert("Upload successful!");
        })
        .catch(err => {
          alert("Upload failed!");
          console.error("Upload failed", err);
        })
        .finally(() => {
          setUploading(false);
        });
    } catch (err) {
      alert("Upload failed!");
      console.error("Upload failed", err);
      setUploading(false);
    }

}

  return (
    <div
      className={`w-full h-64 border-4 border-dashed rounded-2xl shadow-lg flex items-center justify-center transition-colors ${
        dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <span className="text-gray-500">Uploading...</span>
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold">Drag & drop a file here</p>
          <p className="text-sm">or click to browse</p>
        </div>
      )}
    </div>
  );
}
