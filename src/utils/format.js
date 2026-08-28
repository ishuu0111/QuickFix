// Small formatting helpers shared across screens.

export function formatCurrency(amount) {
  const value = Math.round(Number(amount) || 0);
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatCompactNumber(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export function truncate(text = '', max = 60) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
