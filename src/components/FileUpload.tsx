// src/components/FileUpload.tsx
import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import type { JMeterRecord } from '../types';

interface FileUploadProps {
  onFileLoad: (data: JMeterRecord[]) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const results = await new Promise<JMeterRecord[]>((resolve, reject) => {
        const data: JMeterRecord[] = [];
        
        Papa.parse<JMeterRecord>(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            if (field === 'success') return value === 'true';
            return value;
          },
          chunk: (results) => {
            // Ensure each row has the required fields
            const validChunk = results.data.filter((row): row is JMeterRecord => 
              typeof row.timeStamp === 'number' && 
              typeof row.elapsed === 'number' && 
              typeof row.label === 'string'
            );
            data.push(...validChunk);
          },
          complete: () => {
            resolve(data);
          },
          error: (error) => {
            reject(new Error('Error parsing CSV: ' + error.message));
          }
        });
      });

      onFileLoad(results);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileLoad, onError]);

  return (
    <div
      className={`relative p-6 border-2 border-dashed rounded-lg text-center cursor-pointer 
        ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'}
        ${isProcessing ? 'pointer-events-none' : ''}`}
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
        disabled={isProcessing}
      />
      
      {isProcessing ? (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Processing file...</p>
          </div>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Drop your JMeter CSV file here or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Supports CSV files from JMeter
          </p>
        </>
      )}
    </div>
  );
};

export default FileUpload;