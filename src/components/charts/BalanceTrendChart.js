import React from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { Box, Typography } from '@mui/material';

const BalanceTrendChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  // Get the last 30 days of transactions for the trend
  const recentTransactions = transactions.slice(-30);
  
  const labels = recentTransactions.map(t => 
    format(parseISO(t.date), 'MMM dd')
  );
  const balanceData = recentTransactions.map(t => t.balance);

  const data = {
    labels,
    datasets: [
      {
        label: 'Account Balance',
        data: balanceData,
        fill: false,
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Balance: ₦${context.raw.toLocaleString('en-NG')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return `₦${value.toLocaleString('en-NG')}`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Balance Trend (Last 30 Days)
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
};

export default BalanceTrendChart;