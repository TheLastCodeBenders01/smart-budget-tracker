import React from 'react';
import { Bar } from 'react-chartjs-2';
import { format, parseISO, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { Box, Typography } from '@mui/material';

const MonthlySpendingChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  // Get the year from the first transaction
  const firstDate = parseISO(transactions[0].date);
  const year = format(firstDate, 'yyyy');
  
  // Create all months in the year
  const months = eachMonthOfInterval({
    start: startOfYear(firstDate),
    end: endOfYear(firstDate)
  }).map(month => format(month, 'MMM'));

  // Initialize monthly totals
  const monthlyExpenses = Array(12).fill(0);
  const monthlyIncome = Array(12).fill(0);

  // Calculate totals per month
  transactions.forEach(transaction => {
    const date = parseISO(transaction.date);
    const monthIndex = date.getMonth();
    
    monthlyExpenses[monthIndex] += transaction.debit;
    monthlyIncome[monthIndex] += transaction.credit;
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Expenses',
        data: monthlyExpenses,
        backgroundColor: 'rgba(244, 67, 54, 0.7)',
        borderColor: 'rgba(244, 67, 54, 1)',
        borderWidth: 1
      },
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(33, 150, 243, 0.7)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1
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
            return `${context.dataset.label}: ₦${context.raw.toLocaleString('en-NG')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
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
        Monthly Income vs Expenses ({year})
      </Typography>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default MonthlySpendingChart;