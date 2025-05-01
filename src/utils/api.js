import axios from 'axios';
const FormData = require('form-data');

const API_BASE_URL = 'http://bread-budget-backend-production.up.railway.app/';

export const analyzeTransactions = async (transactions) => {
  const form = new FormData();
  const filePath = './state.pdf'; // Path to your PDF file
  form.append('file', filePath); // Append the file to the form data

  axios.post(API_BASE_URL, form)
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
};
