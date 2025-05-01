import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const Home = () => {
  const navigate = useNavigate();
  
  const handleFileProcessed = (result) => {
    navigate('/analysis', { state: { result } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        textAlign: 'center', 
        my: 8,
        p: 4,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: 3
      }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Smart Budget Tracker
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          For Nigerian Bank Accounts
        </Typography>
        <Typography variant="body1" sx={{ my: 3, maxWidth: 600, mx: 'auto' }}>
          Upload your bank statement (PDF) to get detailed spending analysis, 
          visualizations, and AI-powered financial insights tailored for Nigerian consumers.
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <FileUpload onFileProcessed={handleFileProcessed} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Supports statements from Moniepoint, GTBank, Zenith, Access, FirstBank, and more.
        </Typography>
      </Box>
      
      <Box sx={{ my: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          How It Works
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          flexWrap: 'wrap',
          gap: 3,
          mt: 4
        }}>
          {[
            {
              title: 'Upload Statement',
              description: 'Securely upload your bank statement in PDF format'
            },
            {
              title: 'Automatic Analysis',
              description: 'We process and categorize your transactions'
            },
            {
              title: 'Get Insights',
              description: 'Receive personalized financial recommendations'
            }
          ].map((step, index) => (
            <Box key={index} sx={{ 
              textAlign: 'center', 
              p: 3,
              maxWidth: 300,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              boxShadow: 1
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;