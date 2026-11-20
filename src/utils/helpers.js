export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094, label: 'GBP (£)' }
};

export const formatCurrency = (amountInInr, currencyCode = 'INR') => {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = Math.round(Number(amountInInr) * curr.rate);
  return curr.symbol + converted.toLocaleString(currencyCode === 'INR' ? 'en-IN' : 'en-US');
};

export const inr = (amount) => formatCurrency(amount, 'INR');
