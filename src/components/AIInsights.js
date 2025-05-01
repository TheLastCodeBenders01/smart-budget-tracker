import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import {
  Insights as InsightsIcon,
  Savings as SavingsIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon
} from '@mui/icons-material';
import { analyzeTransactions, getFinancialTips } from '../utils/api';

const AIInsights = ({ transactions }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      fetchInsights();
    }
  }, [transactions]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Analyze spending patterns
      const analysis = await analyzeTransactions(transactions);
      
      // Get personalized tips
      const tips = await getFinancialTips(analysis);
      
      // Detect any anomalies
      
      setInsights({
        analysis,
        tips,
      });
    } catch (err) {
      setError('Failed to generate insights. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Analyzing your spending patterns...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        AI-Powered Financial Insights
      </Typography>
      
      <Grid container spacing={3}>
        {/* Spending Analysis */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InsightsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Spending Analysis
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrendUpIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Top Spending Category"
                    secondary={
                      <>
                        {insights.analysis.topCategory} 
                        <Chip 
                          label={`₦${insights.analysis.topCategoryAmount.toLocaleString('en-NG')}`} 
                          size="small" 
                          sx={{ ml: 1 }} 
                        />
                      </>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TrendDownIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Biggest Expense Reduction Opportunity"
                    secondary={insights.analysis.reductionOpportunity}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MoneyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Monthly Average Spend"
                    secondary={`₦${insights.analysis.monthlyAverage.toLocaleString('en-NG')}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Financial Tips */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SavingsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Personalized Financial Tips
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                {insights.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {tip.type === 'saving' ? (
                        <SavingsIcon color="success" />
                      ) : (
                        <MoneyIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={tip.tip} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
    
      </Grid>
    </Box>
  );
};

export default AIInsights;