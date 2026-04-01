/**
 * Formatter Utility Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatNumber,
  formatCurrency,
  parseNumber,
  truncate,
} from '../../../utils/formatter';

describe('formatDate', () => {
  it('formats Date object to DD/MM/YYYY', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDate(date)).toBe('15/01/2024');
  });

  it('formats ISO string to DD/MM/YYYY', () => {
    expect(formatDate('2024-01-15')).toBe('15/01/2024');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });
});

describe('formatNumber', () => {
  it('formats number with thousand separators', () => {
    expect(formatNumber(1234567.89)).toBe('1,234,567.89');
  });

  it('formats string number', () => {
    expect(formatNumber('1234.56')).toBe('1,234.56');
  });

  it('returns empty string for null', () => {
    expect(formatNumber(null)).toBe('');
  });

  it('respects decimal places', () => {
    expect(formatNumber(1234.5, 2)).toBe('1,234.50');
  });
});

describe('formatCurrency', () => {
  it('formats with default THB symbol', () => {
    expect(formatCurrency(1234.56)).toBe('฿1,234.56');
  });

  it('formats with USD symbol', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('returns empty string for null', () => {
    expect(formatCurrency(null)).toBe('');
  });
});

describe('parseNumber', () => {
  it('parses formatted number string', () => {
    expect(parseNumber('1,234.56')).toBe(1234.56);
  });

  it('returns number unchanged', () => {
    expect(parseNumber(1234.56)).toBe(1234.56);
  });

  it('returns 0 for empty string', () => {
    expect(parseNumber('')).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(parseNumber(null)).toBe(0);
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('This is a very long string', 10)).toBe('This is a ...');
  });

  it('returns short strings unchanged', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('returns empty string for null', () => {
    expect(truncate(null, 10)).toBe('');
  });
});
