import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com';

export const analyzeTransactions = async (transactions) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      transactions,
      currency: 'NGN' // Specify Nigerian Naira
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing transactions:', error);
    throw error;
  }
};

export const getFinancialTips = async (analysisData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tips`, {
      ...analysisData,
      country: 'Nigeria' // Provide context for location-specific tips
    });
    return response.data;
  } catch (error) {
    console.error('Error getting financial tips:', error);
    throw error;
  }
};