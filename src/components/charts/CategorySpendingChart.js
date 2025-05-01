import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

// Common Nigerian spending categories
const NIGERIAN_CATEGORIES = {
  'SPORTY BET': 'Betting',
  'ATM': 'Cash Withdrawal',
  'POS': 'POS Payments',
  'TRF': 'Transfers',
  'PAYSTACK': 'Online Payments',
  'MONIEPOINT': 'Bank Charges',
  'SMS': 'Bank Charges',
  'REMITLY': 'International Transfers',
  'AIRTIME': 'Airtime',
  'DATA': 'Mobile Data',
  'ELECTRICITY': 'Utilities',
  'DSTV': 'Entertainment',
  'GOTV': 'Entertainment',
  'UBER': 'Transport',
  'BOLT': 'Transport',
  'JUMIA': 'Shopping',
  'KONGA': 'Shopping',
  'FOOD': 'Food',
  'RESTAURANT': 'Dining',
  'HOSPITAL': 'Healthcare',
  'PHARMACY': 'Healthcare',
  'SCHOOL': 'Education',
  'FUEL': 'Transport',
  'TAX': 'Taxes',
  'SALARY': 'Income',
  'FREELANCE': 'Income',
  'BUSINESS': 'Income'
};

const detectCategory = (narration) => {
  narration = narration.toUpperCase();
  
  for (const [keyword, category] of Object.entries(NIGERIAN_CATEGORIES)) {
    if (narration.includes(keyword)) {
      return category;
    }
  }
  
  return 'Other';
};

const CategorySpendingChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  // Calculate spending by category
  const categoryTotals = {};
  
  transactions.forEach(transaction => {
    if (transaction.debit > 0) {
      const category = detectCategory(transaction.narration);
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.debit;
    }
  });

  // Sort categories by amount and take top 8
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const labels = sortedCategories.map(([category]) => category);
  const data = sortedCategories.map(([_, amount]) => amount);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC249', '#EA5545'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC249', '#EA5545'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₦${value.toLocaleString('en-NG')} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Spending by Category
      </Typography>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default CategorySpendingChart;