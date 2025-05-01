const url = 'https://bread-budget-backend-production.up.railway.app/transaction-summary';


const fs = require('fs');
const FormData = require('form-data');

const axios = require('axios');
const form = new FormData();
const filePath = './state.pdf'; // Path to your PDF file
form.append('file', fs.createReadStream(filePath)); // Append the file to the form data
const headers = {
  ...form.getHeaders(),
  'Content-Type': 'multipart/form-data',
};


axios.post(url, form, { headers })
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });