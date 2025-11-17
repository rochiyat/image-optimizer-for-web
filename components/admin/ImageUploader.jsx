import { useState } from 'react';
import Image from 'next/image';

/**
 * Professional Image Uploader Component
 * With drag-and-drop, preview, and progress tracking
 */
export default function ImageUploader({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const imageFiles = newFiles.filter(file => 
      file.type.startsWith('image/')
    );

    const filesWithPreview = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const uploadFiles = async () => {
    setUploading(true);
    setErrors({});

    for (const fileObj of files) {
      try {
        setProgress(prev => ({ ...prev, [fileObj.id]: 0 }));

        const formData = new FormData();
        formData.append('image', fileObj.file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        setProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
        
        if (onUploadComplete) {
          onUploadComplete(result);
        }

      } catch (error) {
        setErrors(prev => ({ 
          ...prev, 
          [fileObj.id]: error.message 
        }));
      }
    }

    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Upload Images</h2>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-gray-600">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium">Drop images here or click to browse</p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP up to 50MB</p>
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Selected Files ({files.length})
            </h3>
            
            <div className="space-y-4">
              {files.map((fileObj) => (
                <div key={fileObj.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {/* Preview */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {/* Progress */}
                    {progress[fileObj.id] !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress[fileObj.id]}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {errors[fileObj.id] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[fileObj.id]}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!uploading && (
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
