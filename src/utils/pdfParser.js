import { PDFDocument } from 'pdf-lib';

// Nigerian bank specific parsers
const BANK_PARSERS = {
  'MONIEPOINT': parseMoniepointStatement,
  'GTBANK': parseGTBankStatement,
  'ZENITH': parseZenithStatement,
  'ACCESS': parseAccessStatement,
  'FIRSTBANK': parseFirstBankStatement
};

export async function parsePdf(file) {
  try {
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const pages = pdfDoc.getPages();
    let text = '';
    
    for (const page of pages) {
      text += await page.getText();
    }
    
    // Detect bank and use appropriate parser
    const bank = detectBank(text);
    const parser = BANK_PARSERS[bank] || parseGenericStatement;
    
    return parser(text);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please ensure you uploaded a valid bank statement.');
  }
}

function detectBank(text) {
  if (text.includes('Moniepoint')) return 'MONIEPOINT';
  if (text.includes('GTBank') || text.includes('Guaranty Trust Bank')) return 'GTBANK';
  if (text.includes('Zenith Bank')) return 'ZENITH';
  if (text.includes('Access Bank')) return 'ACCESS';
  if (text.includes('First Bank')) return 'FIRSTBANK';
  return 'GENERIC';
}

function parseMoniepointStatement(text) {
  const lines = text.split('\n');
  const transactions = [];
  let currentTransaction = null;
  
  // Moniepoint specific parsing logic
  for (const line of lines) {
    // Check for transaction start (date pattern)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(line.trim())) {
      if (currentTransaction) {
        transactions.push(currentTransaction);
      }
      
      const parts = line.trim().split(' ');
      currentTransaction = {
        date: parts[0],
        narration: parts.slice(1).join(' '),
        reference: '',
        debit: 0,
        credit: 0,
        balance: 0
      };
    }
    
    // Check for amount lines
    if (currentTransaction && (line.includes('_DEBIT_') || line.includes('_CREDIT_'))) {
      const amountParts = line.trim().split('|').map(p => p.trim());
      if (amountParts.length >= 6) {
        currentTransaction.reference = amountParts[2];
        currentTransaction.debit = parseFloat(amountParts[3].replace(/,/g, '')) || 0;
        currentTransaction.credit = parseFloat(amountParts[4].replace(/,/g, '')) || 0;
        currentTransaction.balance = parseFloat(amountParts[5].replace(/,/g, '')) || 0;
      }
    }
  }
  
  if (currentTransaction) {
    transactions.push(currentTransaction);
  }
  
  return transactions;
}

// Other bank parsers would follow similar patterns
function parseGTBankStatement(text) {
  // Implementation for GTBank
}

function parseZenithStatement(text) {
  // Implementation for Zenith
}

function parseAccessStatement(text) {
  // Implementation for Access
}

function parseFirstBankStatement(text) {
  // Implementation for FirstBank
}

function parseGenericStatement(text) {
  // Fallback parser for unknown banks
}