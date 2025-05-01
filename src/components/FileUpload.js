import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { analyzeTransactions } from '../utils/api';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const FileUpload = ({ onFileProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);

      // Await the API call to get the result
      const response = await analyzeTransactions(formData);
      console.log("Response from API: ", response);

      // Pass the resolved data to onFileProcessed
      onFileProcessed(response);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f5f5f5' : 'white',
        '&:hover': {
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <Box>
          <CircularProgress />
          <Typography variant="body1" mt={2}>Processing your statement...</Typography>
        </Box>
      ) : (
        <Box>
          <CloudUploadIcon sx={{ fontSize: 60, color: '#1976d2' }} />
          <Typography variant="h6" mt={2}>
            {isDragActive ? 'Drop your bank statement here' : 'Drag & drop your PDF statement here'}
          </Typography>
          <Typography variant="body1" mt={1} color="text.secondary">
            Or click to browse files
          </Typography>
          <Typography variant="caption" mt={2} display="block" color="text.secondary">
            Supported formats: Moniepoint, GTBank, Zenith, Access, FirstBank PDF statements
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;