import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Tabs, 
  Tab,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Receipt as TransactionsIcon,
  PieChart as ChartsIcon,
  Insights as InsightsIcon,
  Share as ShareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import MonthlySpendingChart from '../components/charts/MonthlySpendingChart';
import CategorySpendingChart from '../components/charts/CategorySpendingChart';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import AIInsights from '../components/AIInsights';
import { processTransactions } from '../utils/transactionProcessor';
import format from 'date-fns/format';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  
  // Get transactions from navigation state
  const transactions = location.state?.transactions || [];
  
  useEffect(() => {
    if (transactions.length > 0) {
      const data = processTransactions(transactions);
      setProcessedData(data);
    } else {
      // No transactions, redirect back to home
      navigate('/');
    }
  }, [transactions, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewUpload = () => {
    navigate('/');
  };

  if (!processedData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Statement Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {format(processedData.summary.startDate, 'MMM dd, yyyy')} - {format(processedData.summary.endDate, 'MMM dd, yyyy')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={() => alert('Share functionality coming soon')}
          >
            Share
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => alert('Export functionality coming soon')}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNewUpload}
            sx={{ ml: 'auto' }}
          >
            Analyze Another Statement
          </Button>
        </Box>
        
        <SummaryCards transactions={transactions} />
        
        <Paper sx={{ my: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<TransactionsIcon />} label="Transactions" />
            <Tab icon={<ChartsIcon />} label="Charts" />
            <Tab icon={<InsightsIcon />} label="AI Insights" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <TransactionTable transactions={transactions} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <MonthlySpendingChart transactions={transactions} />
            <CategorySpendingChart transactions={transactions} />
            <BalanceTrendChart transactions={transactions} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <AIInsights transactions={transactions} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AnalysisResults;