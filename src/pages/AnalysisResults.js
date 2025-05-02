import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const location = useLocation();
  const { state } = location;
  const { result } = state || {};

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" color="error">
          No data available. Please upload a bank statement first.
        </Typography>
      </Container>
    );
  }

  const { advice, summary, data } = result.data;
  console.log('Analysis Result:', result);

  // Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Amount Spent (%)',
        data: Object.values(data).map((value) => {
          // Ensure the value is a string before calling replace
          const numericValue = typeof value === 'string' 
            ? parseFloat(value.replace(/,/g, '')) 
            : value;
          return numericValue;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spending Categories',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Spending Analysis
      </Typography>

      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {summary}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Financial Advice
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {advice}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Spending Categories
          </Typography>
          <Bar data={chartData} options={chartOptions} />
        </Paper>
      </Box>
    </Container>
  );
};

export default Analysis;