// Format decimal string amounts from API (e.g. "8.40000000") for display
export const formatAmount = (amount: string | number | undefined, decimals = 2): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  if (isNaN(num)) return (0).toFixed(decimals);
  return num.toFixed(decimals);
};

// Format with sign for ledger (positive = green, negative = red)
export const formatAmountWithSign = (
  amount: string | number | undefined,
): { text: string; isPositive: boolean } => {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  const isPositive = num >= 0;
  return {
    text: (isPositive ? '+' : '') + num.toFixed(2),
    isPositive,
  };
};
