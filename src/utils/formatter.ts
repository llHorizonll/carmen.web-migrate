/**
 * Formatting Utilities
 * Based on original src/utils/formatter.js
 */

import { format, parseISO, isValid } from 'date-fns';

// ============================================================================
// Date Formatting
// ============================================================================

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  displayDateTime: 'dd/MM/yyyy HH:mm',
  iso: 'yyyy-MM-dd',
  isoDateTime: 'yyyy-MM-dd HH:mm:ss',
  monthYear: 'MMM yyyy',
  full: 'dd MMMM yyyy',
} as const;

/**
 * Format date for display (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, DATE_FORMATS.display);
}

/**
 * Format date time for display (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, DATE_FORMATS.displayDateTime);
}

/**
 * Format date to ISO format (YYYY-MM-DD) for API
 */
export function toISODate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';
  return format(d, DATE_FORMATS.iso);
}

/**
 * Convert MySQL date string to Date object
 */
export function fromMySqlDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  return isValid(date) ? date : null;
}

/**
 * Convert Date to MySQL date string
 */
export function toMySqlDate(date: Date | string | null | undefined): string {
  return toISODate(date);
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with thousand separators
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency with symbol
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency = 'THB',
  decimals = 2
): string {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  const symbols: Record<string, string> = {
    THB: '฿',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  
  const symbol = symbols[currency] || currency;
  return `${symbol}${formatted}`;
}

/**
 * Parse formatted number string to number
 */
export function parseNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const cleaned = value.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Round number to specified decimals
 */
export function roundNumber(value: number, decimals = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// ============================================================================
// Percentage Formatting
// ============================================================================

/**
 * Format as percentage
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Parse percentage string to decimal
 */
export function parsePercent(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const cleaned = value.replace('%', '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num / 100;
}

// ============================================================================
// Account Code Formatting
// ============================================================================

/**
 * Format account code with separator
 */
export function formatAccountCode(code: string, separator = '-'): string {
  if (!code) return '';
  // Assuming format like XXX-XX-XXXX
  const cleaned = code.replace(/[^0-9]/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 3)}${separator}${cleaned.slice(3)}`;
  }
  return `${cleaned.slice(0, 3)}${separator}${cleaned.slice(3, 5)}${separator}${cleaned.slice(5)}`;
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string | null | undefined, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
