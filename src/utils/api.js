import axios from 'axios';

const API_BASE_URL = 'https://bread-budget-backend-production.up.railway.app/';

// export const analyzeTransactions = async (transactions) => {
//   // const form = new FormData();
//   // const filePath = './state.pdf'; // Path to your PDF file
//   // form.append('file', filePath); // Append the file to the form data

//   axios.post(API_BASE_URL + "transaction-summary", transactions)
//     .then(response => {
//       console.log('Response:', response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error.message);
//     });
// };

export const analyzeTransactions = async (formData) => {
  try {
    const response = await fetch('https://bread-budget-backend-production.up.railway.app/transaction-summary', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json(); // Parse the JSON response
  } catch (error) {
    console.error('Error in analyzeTransactions:', error);
    throw error;
  }
};