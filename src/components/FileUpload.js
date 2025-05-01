import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';


pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;



const FileUpload = ({ onFileProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      const file = acceptedFiles[0];
      // const text = await file.text();
      const loadingTask = pdfjsLib.getDocument('./test.pdf');
      loadingTask.promise.then(pdf => {
        console.log('PDF loaded', pdf);
      });

      // const transactions = parsePdfText(text);
      // onFileProcessed(transactions);
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

// Helper function to parse PDF text (will be expanded in utils)
const parsePdfText = (text) => {
  // Initial parsing logic
  const lines = text.split('\n');
  const transactions = [];
  
  // This is a simplified parser - we'll create a more robust one in utils
  lines.forEach(line => {
    if (line.includes('_DEBIT_') || line.includes('_CREDIT_')) {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 6) {
        transactions.push({
          date: parts[0],
          narration: parts[1],
          reference: parts[2],
          debit: parseFloat(parts[3].replace(/,/g, '')) || 0,
          credit: parseFloat(parts[4].replace(/,/g, '')) || 0,
          balance: parseFloat(parts[5].replace(/,/g, '')) || 0
        });
      }
    }
  });
  
  return transactions;
};

function extractText(pdfUrl) {
	var pdf = pdfjsLib.getDocument(pdfUrl);
	return pdf.promise.then(function (pdf) {
		var totalPageCount = pdf.numPages;
		var countPromises = [];
		for (
			var currentPage = 1;
			currentPage <= totalPageCount;
			currentPage++
		) {
			var page = pdf.getPage(currentPage);
			countPromises.push(
				page.then(function (page) {
					var textContent = page.getTextContent();
					return textContent.then(function (text) {
						return text.items
							.map(function (s) {
								return s.str;
							})
							.join('');
					});
				}),
			);
		}

		return Promise.all(countPromises).then(function (texts) {
			return texts.join('');
		});
	});
}




export default FileUpload;