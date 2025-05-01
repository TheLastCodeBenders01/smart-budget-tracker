import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
  CompareArrows as NetFlowIcon
} from '@mui/icons-material';

const SummaryCards = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  // Calculate summary data
  const totalIncome = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalExpenses = transactions.reduce((sum, t) => sum + t.debit, 0);
  const netFlow = totalIncome - totalExpenses;
  const currentBalance = transactions[transactions.length - 1]?.balance || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const cards = [
    {
      title: 'Current Balance',
      value: formatCurrency(currentBalance),
      icon: <AccountBalanceIcon fontSize="large" />,
      color: '#4caf50'
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: <IncomeIcon fontSize="large" />,
      color: '#2196f3'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: <ExpenseIcon fontSize="large" />,
      color: '#f44336'
    },
    {
      title: 'Net Flow',
      value: formatCurrency(netFlow),
      icon: <NetFlowIcon fontSize="large" />,
      color: netFlow >= 0 ? '#4caf50' : '#f44336'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderLeft: `4px solid ${card.color}`
            }}
            elevation={3}
          >
            <Box sx={{ color: card.color, mb: 1 }}>{card.icon}</Box>
            <Typography variant="h6" color="text.secondary">
              {card.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;