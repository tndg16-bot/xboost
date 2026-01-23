/**
 * Validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate URL is HTTPS
 */
export function isSecureUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  return url.startsWith('https://');
}

/**
 * Validate Twitter/X username format
 */
export function isValidTwitterUsername(username: string): boolean {
  // Twitter usernames: 1-15 characters, alphanumeric and underscore only
  const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;
  return twitterRegex.test(username);
}

/**
 * Validate password strength
 * Returns: { isValid: boolean, strength: 'weak' | 'medium' | 'strong' | 'very-strong' }
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score < 3) {
    strength = 'weak';
  } else if (score < 5) {
    strength = 'medium';
  } else if (score < 6) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  return {
    isValid: password.length >= 8,
    strength,
  };
}

/**
 * Validate phone number (simple validation)
 */
export function isValidPhone(phone: string, countryCode: string = 'JP'): boolean {
  const patterns: Record<string, RegExp> = {
    JP: /^(\+81|0)\d{9,10}$/,
    US: /^(\+1)?\d{10}$/,
    UK: /^(\+44)?\d{10}$/,
  };

  const pattern = patterns[countryCode] || patterns.JP;
  return pattern.test(phone.replace(/\D/g, ''));
}

/**
 * Validate Japanese postal code
 */
export function isValidJapanPostalCode(code: string): boolean {
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  return postalCodeRegex.test(code);
}

/**
 * Check if string is empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if number is within range
 */
export function isInRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Check if value is a valid date
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate Japanese ZIP code format
 */
export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^\d{3}-?\d{4}$/;
  return zipRegex.test(zip);
}

/**
 * Check if string contains only whitespace
 */
export function isWhitespace(str: string): boolean {
  return /^\s*$/.test(str);
}

/**
 * Validate URL has valid protocol
 */
export function hasValidProtocol(url: string): boolean {
  const validProtocols = ['http://', 'https://', 'ftp://', 'file://'];
  return validProtocols.some((protocol) => url.startsWith(protocol));
}

/**
 * Check if string is a valid JSON
 */
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate array has no duplicates
 */
export function hasNoDuplicates<T>(arr: T[]): boolean {
  return new Set(arr).size === arr.length;
}

/**
 * Check if value is null or undefined
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is not null or undefined
 */
export function isNotNil<T>(value: T | null | undefined): value is T {
  return !isNil(value);
}
