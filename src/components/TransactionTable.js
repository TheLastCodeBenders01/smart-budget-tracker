import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box
} from '@mui/material';
import { format } from 'date-fns';

const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No transactions found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
      <Table stickyHeader aria-label="transaction table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Debit (₦)</TableCell>
            <TableCell align="right">Credit (₦)</TableCell>
            <TableCell align="right">Balance (₦)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>
                {transaction.date ? format(new Date(transaction.date), 'dd MMM yyyy HH:mm') : 'N/A'}
              </TableCell>
              <TableCell sx={{ maxWidth: 300 }}>
                <Typography noWrap>{transaction.narration}</Typography>
              </TableCell>
              <TableCell align="right">
                {transaction.debit > 0 ? transaction.debit.toLocaleString('en-NG') : '-'}
              </TableCell>
              <TableCell align="right">
                {transaction.credit > 0 ? transaction.credit.toLocaleString('en-NG') : '-'}
              </TableCell>
              <TableCell align="right">
                {transaction.balance.toLocaleString('en-NG')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;