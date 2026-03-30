/**
 * Component Prop Types
 * Reusable type definitions for component props
 */

import type { ReactNode } from 'react';
import type { Status } from './models';

// ============================================================================
// Layout Types
// ============================================================================

export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  permit?: string;
  children?: NavItem[];
}

export interface UserMenuProps {
  user: {
    UserName: string;
    FullName: string;
    Email: string;
  } | null;
  onLogout: () => void;
  onChangePassword: () => void;
  onProfile: () => void;
}

// ============================================================================
// Table Types
// ============================================================================

export interface DataTableColumn<TData> {
  accessorKey: keyof TData | string;
  header: string;
  cell?: (info: { row: { original: TData } }) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  meta?: {
    align?: 'left' | 'center' | 'right';
    width?: number | string;
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortDesc: boolean;
    onSort: (sortBy: string, sortDesc: boolean) => void;
  };
  selection?: {
    selectedRows: T[];
    onSelectionChange: (rows: T[]) => void;
    enableMultiSelect?: boolean;
  };
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export interface InlineTableCell {
  rowId: string | number;
  columnId: string;
  value: unknown;
}

export interface InlineTableProps<T> {
  data: T[];
  columns: InlineTableColumn<T>[];
  onChange: (data: T[]) => void;
  onCellChange?: (cell: InlineTableCell, value: unknown) => void;
  stickyHeader?: boolean;
  stickyColumns?: number;
  maxHeight?: number | string;
  readOnly?: boolean;
}

export interface InlineTableColumn<T> {
  accessorKey: keyof T | string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'autocomplete';
  editable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  options?: { value: string; label: string }[];
  validation?: (value: unknown, row: T) => string | undefined;
  format?: (value: unknown) => string;
  parse?: (value: string) => unknown;
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'autocomplete';
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string | undefined;
  };
}

export interface FormSection {
  title?: string;
  fields: FormField[];
  columns?: 1 | 2 | 3 | 4;
}

// ============================================================================
// Dialog Types
// ============================================================================

export interface DialogConfig {
  title: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  withCloseButton?: boolean;
}

export interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'blue' | 'red' | 'green';
  onConfirm: () => void;
  onCancel: () => void;
}

// ============================================================================
// Status & Badge Types
// ============================================================================

export interface StatusBadgeProps {
  status: Status | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline';
}

// ============================================================================
// Filter Types
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dateRange' | 'select' | 'multiselect' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
}

export interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onReset: () => void;
  onApply: () => void;
  loading?: boolean;
}

// ============================================================================
// Action Menu Types
// ============================================================================

export interface ActionMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray';
  divider?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  position?: 'left' | 'right';
}
