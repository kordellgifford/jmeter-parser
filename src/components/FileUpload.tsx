import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { JMeterRecord } from '../types';

interface FileUploadProps {
  onFileLoad: (data: JMeterRecord[]) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad, onError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const csvText = event.target?.result as string;
        const result = Papa.parse<JMeterRecord>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            if (field === 'success') return value === 'true';
            return value;
          }
        });

        if (result.errors.length > 0) {
          onError('Error parsing CSV: ' + result.errors[0].message);
          return;
        }

        onFileLoad(result.data);
      } catch (error) {
        onError('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };

    reader.readAsText(file);
  };

  return (
    <div
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-700">Drop your JMeter CSV file here or click to browse</p>
      <p className="text-sm text-gray-500 mt-2">Supports CSV files from JMeter</p>
    </div>
  );
};

export default FileUpload;