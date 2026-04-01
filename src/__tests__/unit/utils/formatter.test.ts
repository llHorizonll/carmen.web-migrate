import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  toISODate,
  fromMySqlDate,
  toMySqlDate,
  formatNumber,
  formatCurrency,
  parseNumber,
  roundNumber,
  formatPercent,
  parsePercent,
  formatAccountCode,
  truncate,
  toTitleCase,
  formatFileSize,
  DATE_FORMATS,
} from '@/utils/formatter';

describe('formatter utilities', () => {
  describe('DATE_FORMATS', () => {
    it('should have correct date format constants', () => {
      expect(DATE_FORMATS.display).toBe('dd/MM/yyyy');
      expect(DATE_FORMATS.displayDateTime).toBe('dd/MM/yyyy HH:mm');
      expect(DATE_FORMATS.iso).toBe('yyyy-MM-dd');
      expect(DATE_FORMATS.isoDateTime).toBe('yyyy-MM-dd HH:mm:ss');
      expect(DATE_FORMATS.monthYear).toBe('MMM yyyy');
      expect(DATE_FORMATS.full).toBe('dd MMMM yyyy');
    });
  });

  describe('formatDate', () => {
    it('should format Date object to display format', () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('should format ISO string to display format', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
      expect(formatDate('2024-01-15T10:30:00')).toBe('15/01/2024');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object to display datetime format', () => {
      const date = new Date(2024, 0, 15, 10, 30); // Jan 15, 2024 10:30
      expect(formatDateTime(date)).toBe('15/01/2024 10:30');
    });

    it('should format ISO string to display datetime format', () => {
      expect(formatDateTime('2024-01-15T10:30:00')).toBe('15/01/2024 10:30');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatDateTime(null)).toBe('');
      expect(formatDateTime(undefined)).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDateTime('invalid')).toBe('');
    });
  });

  describe('toISODate', () => {
    it('should convert Date to ISO format', () => {
      const date = new Date(2024, 0, 15);
      expect(toISODate(date)).toBe('2024-01-15');
    });

    it('should convert string to ISO format', () => {
      expect(toISODate('2024-01-15')).toBe('2024-01-15');
      expect(toISODate('2024-01-15T10:30:00')).toBe('2024-01-15');
    });

    it('should return empty string for null/undefined', () => {
      expect(toISODate(null)).toBe('');
      expect(toISODate(undefined)).toBe('');
    });

    it('should return empty string for invalid date', () => {
      expect(toISODate('invalid')).toBe('');
    });
  });

  describe('fromMySqlDate', () => {
    it('should convert MySQL date string to Date object', () => {
      const result = fromMySqlDate('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January
      expect(result?.getDate()).toBe(15);
    });

    it('should convert MySQL datetime string to Date object', () => {
      const result = fromMySqlDate('2024-01-15 10:30:00');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should return null for null/undefined', () => {
      expect(fromMySqlDate(null)).toBeNull();
      expect(fromMySqlDate(undefined)).toBeNull();
    });

    it('should return null for invalid date string', () => {
      expect(fromMySqlDate('invalid')).toBeNull();
    });
  });

  describe('toMySqlDate', () => {
    it('should convert Date to MySQL date format', () => {
      const date = new Date(2024, 0, 15);
      expect(toMySqlDate(date)).toBe('2024-01-15');
    });

    it('should return empty string for null/undefined', () => {
      expect(toMySqlDate(null)).toBe('');
      expect(toMySqlDate(undefined)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
      expect(formatNumber(1000)).toBe('1,000.00');
      expect(formatNumber(0)).toBe('0.00');
    });

    it('should format number string', () => {
      expect(formatNumber('1234567.89')).toBe('1,234,567.89');
    });

    it('should respect decimal places parameter', () => {
      expect(formatNumber(1234.567, 0)).toBe('1,235');
      expect(formatNumber(1234.567, 1)).toBe('1,234.6');
      expect(formatNumber(1234.567, 3)).toBe('1,234.567');
    });

    it('should return empty string for null/undefined/empty', () => {
      expect(formatNumber(null)).toBe('');
      expect(formatNumber(undefined)).toBe('');
      expect(formatNumber('')).toBe('');
    });

    it('should return empty string for NaN', () => {
      expect(formatNumber('not a number')).toBe('');
      expect(formatNumber(NaN)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with THB symbol by default', () => {
      expect(formatCurrency(1234.56)).toBe('฿1,234.56');
    });

    it('should format currency with specified symbol', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
      expect(formatCurrency(1234.56, 'JPY')).toBe('¥1,234.56');
    });

    it('should use currency code as symbol if not in mapping', () => {
      expect(formatCurrency(1234.56, 'SGD')).toBe('SGD1,234.56');
    });

    it('should return empty string for null/undefined/empty', () => {
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
      expect(formatCurrency('')).toBe('');
    });

    it('should return empty string for NaN', () => {
      expect(formatCurrency('invalid')).toBe('');
    });
  });

  describe('parseNumber', () => {
    it('should parse formatted number string', () => {
      expect(parseNumber('1,234,567.89')).toBe(1234567.89);
      expect(parseNumber('1,000')).toBe(1000);
    });

    it('should return number as-is', () => {
      expect(parseNumber(1234.56)).toBe(1234.56);
    });

    it('should return 0 for null/undefined/empty', () => {
      expect(parseNumber(null)).toBe(0);
      expect(parseNumber(undefined)).toBe(0);
      expect(parseNumber('')).toBe(0);
    });

    it('should return 0 for invalid number', () => {
      expect(parseNumber('not a number')).toBe(0);
    });
  });

  describe('roundNumber', () => {
    it('should round to specified decimal places', () => {
      expect(roundNumber(1234.567, 2)).toBe(1234.57);
      expect(roundNumber(1234.564, 2)).toBe(1234.56);
      expect(roundNumber(1234.5, 0)).toBe(1235);
    });

    it('should default to 2 decimal places', () => {
      expect(roundNumber(1234.567)).toBe(1234.57);
    });

    it('should handle negative numbers', () => {
      expect(roundNumber(-1234.567, 2)).toBe(-1234.57);
    });
  });

  describe('formatPercent', () => {
    it('should format decimal as percentage', () => {
      expect(formatPercent(0.1567)).toBe('15.67%');
      expect(formatPercent(0.15)).toBe('15.00%');
      expect(formatPercent(1)).toBe('100.00%');
    });

    it('should format string as percentage', () => {
      expect(formatPercent('0.1567')).toBe('15.67%');
    });

    it('should respect decimal places parameter', () => {
      expect(formatPercent(0.1567, 1)).toBe('15.7%');
      expect(formatPercent(0.1567, 0)).toBe('16%');
    });

    it('should return empty string for null/undefined/empty', () => {
      expect(formatPercent(null)).toBe('');
      expect(formatPercent(undefined)).toBe('');
      expect(formatPercent('')).toBe('');
    });

    it('should return empty string for NaN', () => {
      expect(formatPercent('invalid')).toBe('');
    });
  });

  describe('parsePercent', () => {
    it('should parse percentage string to decimal', () => {
      expect(parsePercent('15.67%')).toBe(0.1567);
      expect(parsePercent('100%')).toBe(1);
      expect(parsePercent('50%')).toBe(0.5);
    });

    it('should return number as-is', () => {
      expect(parsePercent(0.1567)).toBe(0.1567);
    });

    it('should return 0 for null/undefined/empty', () => {
      expect(parsePercent(null)).toBe(0);
      expect(parsePercent(undefined)).toBe(0);
      expect(parsePercent('')).toBe(0);
    });

    it('should return 0 for invalid input', () => {
      expect(parsePercent('invalid')).toBe(0);
    });
  });

  describe('formatAccountCode', () => {
    it('should format account code with default separator', () => {
      expect(formatAccountCode('12345678')).toBe('123-45-678');
      expect(formatAccountCode('12345')).toBe('123-45');
      expect(formatAccountCode('123')).toBe('123');
    });

    it('should format account code with custom separator', () => {
      expect(formatAccountCode('12345678', '.')).toBe('123.45.678');
      expect(formatAccountCode('12345678', '/')).toBe('123/45/678');
    });

    it('should remove non-numeric characters before formatting', () => {
      expect(formatAccountCode('123-45-678')).toBe('123-45-678');
      expect(formatAccountCode('123.45.678')).toBe('123-45-678');
    });

    it('should return empty string for empty input', () => {
      expect(formatAccountCode('')).toBe('');
      expect(formatAccountCode(null as unknown as string)).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('This is a very long text', 10)).toBe('This is a ...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
      expect(truncate('Hello World', 20)).toBe('Hello World');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should return empty string for null/undefined', () => {
      expect(truncate(null, 10)).toBe('');
      expect(truncate(undefined, 10)).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hElLo WoRlD')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should return empty string for null/undefined', () => {
      expect(toTitleCase(null)).toBe('');
      expect(toTitleCase(undefined)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(512)).toBe('512 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
    });
  });
});
