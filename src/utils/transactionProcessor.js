import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function processTransactions(transactions) {
  if (!transactions || transactions.length === 0) return {};
  
  // Basic statistics
  const totalIncome = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalExpenses = transactions.reduce((sum, t) => sum + t.debit, 0);
  const netFlow = totalIncome - totalExpenses;
  const currentBalance = transactions[transactions.length - 1]?.balance || 0;
  
  // Get date range
  const firstDate = parseISO(transactions[0].date);
  const lastDate = parseISO(transactions[transactions.length - 1].date);
  
  // Monthly breakdown
  const months = {};
  transactions.forEach(t => {
    const date = parseISO(t.date);
    const monthKey = format(date, 'yyyy-MM');
    
    if (!months[monthKey]) {
      months[monthKey] = {
        income: 0,
        expenses: 0,
        startBalance: t.balance - t.credit + t.debit, // Balance before this transaction
        endBalance: t.balance
      };
    } else {
      months[monthKey].income += t.credit;
      months[monthKey].expenses += t.debit;
      months[monthKey].endBalance = t.balance;
    }
  });
  
  // Daily balance for trend
  const dailyBalances = {};
  const allDates = eachDayOfInterval({ start: firstDate, end: lastDate });
  
  allDates.forEach(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    // Find the last transaction of each day
    const dayTransactions = transactions.filter(t => 
      format(parseISO(t.date), 'yyyy-MM-dd') === dateKey
    );
    
    if (dayTransactions.length > 0) {
      dailyBalances[dateKey] = dayTransactions[dayTransactions.length - 1].balance;
    } else {
      // If no transactions, carry forward the previous balance
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateKey = format(prevDate, 'yyyy-MM-dd');
      dailyBalances[dateKey] = dailyBalances[prevDateKey] || 0;
    }
  });
  
  // Category spending
  const categories = {};
  transactions.forEach(t => {
    if (t.debit > 0) {
      const category = detectCategory(t.narration);
      categories[category] = (categories[category] || 0) + t.debit;
    }
  });
  
  // Largest transactions
  const largestExpenses = [...transactions]
    .filter(t => t.debit > 0)
    .sort((a, b) => b.debit - a.debit)
    .slice(0, 5);
  
  const largestIncome = [...transactions]
    .filter(t => t.credit > 0)
    .sort((a, b) => b.credit - a.credit)
    .slice(0, 5);
  
  return {
    summary: {
      totalIncome,
      totalExpenses,
      netFlow,
      currentBalance,
      startDate: firstDate,
      endDate: lastDate
    },
    months,
    dailyBalances,
    categories,
    largestExpenses,
    largestIncome,
    rawTransactions: transactions
  };
}

// Enhanced category detection for Nigerian transactions
function detectCategory(narration) {
  const n = narration.toLowerCase();
  
  // Betting
  if (n.includes('sporty') || n.includes('bet') || n.includes('betting') || n.includes('betano')) {
    return 'Betting';
  }
  
  // Transfers
  if (n.includes('transfer') || n.includes('trf') || n.includes('from') || n.includes('to')) {
    return 'Transfers';
  }
  
  // ATM
  if (n.includes('atm') || n.includes('withdrawal') || n.includes('cash')) {
    return 'Cash Withdrawal';
  }
  
  // POS
  if (n.includes('pos') || n.includes('purchase') || n.includes('payment')) {
    return 'POS Payments';
  }
  
  // Online payments
  if (n.includes('paystack') || n.includes('flutterwave') || n.includes('interswitch')) {
    return 'Online Payments';
  }
  
  // Airtime/Data
  if (n.includes('airtime') || n.includes('mtn') || n.includes('glo') || 
      n.includes('airtel') || n.includes('9mobile') || n.includes('data')) {
    return 'Airtime/Data';
  }
  
  // Utilities
  if (n.includes('electric') || n.includes('eko') || n.includes('ibadan') || 
      n.includes('water') || n.includes('utility') || n.includes('phcn')) {
    return 'Utilities';
  }
  
  // Cable TV
  if (n.includes('dstv') || n.includes('gotv') || n.includes('startimes')) {
    return 'Cable TV';
  }
  
  // Transport
  if (n.includes('uber') || n.includes('bolt') || n.includes('taxi') || 
      n.includes('transport') || n.includes('fuel') || n.includes('petrol')) {
    return 'Transport';
  }
  
  // Shopping
  if (n.includes('jumi') || n.includes('konga') || n.includes('market') || 
      n.includes('shop') || n.includes('store') || n.includes('supermarket')) {
    return 'Shopping';
  }
  
  // Food
  if (n.includes('food') || n.includes('restaurant') || n.includes('eatery') || 
      n.includes('canteen') || n.includes('chicken') || n.includes('pizza')) {
    return 'Food';
  }
  
  // Health
  if (n.includes('hospital') || n.includes('pharm') || n.includes('drug') || 
      n.includes('medical') || n.includes('health')) {
    return 'Healthcare';
  }
  
  // Education
  if (n.includes('school') || n.includes('university') || n.includes('college') || 
      n.includes('tuition') || n.includes('education')) {
    return 'Education';
  }
  
  // Income
  if (n.includes('salary') || n.includes('income') || n.includes('payment') || 
      n.includes('freelance') || n.includes('business')) {
    return 'Income';
  }
  
  // Default
  return 'Other';
}