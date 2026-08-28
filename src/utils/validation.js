// Lightweight validation helpers used by Login / Register / EditProfile forms.

export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone = '') {
  return /^[+]?[\d\s-]{7,15}$/.test(phone);
}

export function isNonEmpty(value = '') {
  return value.trim().length > 0;
}
