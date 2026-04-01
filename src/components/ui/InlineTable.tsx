/**
 * InlineTable Component
 * Excel-like inline editing table for voucher details
 * Supports copy/paste, keyboard navigation, and real-time calculations
 */

import {
  Table,
  TextInput,
  NumberInput,
  Select,
  ActionIcon,
  Group,
  Box,
} from '@mantine/core';
import { useState, useCallback, useRef, useEffect } from 'react';
import { IconTrash, IconPlus } from '@tabler/icons-react';

export type InlineColumnType = 'text' | 'number' | 'date' | 'select' | 'autocomplete';

export interface InlineColumn<T> {
  key: keyof T | string;
  header: string;
  type: InlineColumnType;
  width?: number;
  minWidth?: number;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: unknown, row: T) => string | undefined;
  format?: (value: unknown) => string;
  parse?: (value: string) => unknown;
  editable?: boolean;
}

export interface InlineTableProps<T extends { id: string | number }> {
  data: T[];
  columns: InlineColumn<T>[];
  onChange: (data: T[]) => void;
  onRowAdd?: () => void;
  onRowDelete?: (index: number) => void;
  readOnly?: boolean;
  maxHeight?: number | string;
  showAddButton?: boolean;
  showDeleteButton?: boolean;
  stickyHeader?: boolean;
  summaryRow?: React.ReactNode;
}

interface EditingCell {
  rowIndex: number;
  columnKey: string;
}

export function InlineTable<T extends { id: string | number }>({
  data,
  columns,
  onChange,
  onRowAdd,
  onRowDelete,
  readOnly = false,
  showAddButton = true,
  showDeleteButton = true,
  stickyHeader = true,
  summaryRow,
}: InlineTableProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleCellChange = useCallback(
    (rowIndex: number, columnKey: keyof T | string, value: unknown) => {
      const column = columns.find((c) => c.key === columnKey);
      if (!column) return;

      // Validate
      if (column.validation) {
        const error = column.validation(value, data[rowIndex]);
        if (error) {
          setValidationErrors((prev) => ({
            ...prev,
            [`${rowIndex}-${String(columnKey)}`]: error,
          }));
          return;
        }
      }

      // Clear error
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${rowIndex}-${String(columnKey)}`];
        return newErrors;
      });

      // Update data
      const newData = [...data];
      newData[rowIndex] = { ...newData[rowIndex], [columnKey]: value };
      onChange(newData);
    },
    [data, columns, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (!editingCell) return;

      const numRows = data.length;
      const numCols = columns.length;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            // Previous cell
            if (colIndex > 0) {
              setEditingCell({ rowIndex, columnKey: String(columns[colIndex - 1].key) });
            } else if (rowIndex > 0) {
              setEditingCell({
                rowIndex: rowIndex - 1,
                columnKey: String(columns[numCols - 1].key),
              });
            }
          } else {
            // Next cell
            if (colIndex < numCols - 1) {
              setEditingCell({ rowIndex, columnKey: String(columns[colIndex + 1].key) });
            } else if (rowIndex < numRows - 1) {
              setEditingCell({ rowIndex: rowIndex + 1, columnKey: String(columns[0].key) });
            }
          }
          break;
        case 'Enter':
          e.preventDefault();
          setEditingCell(null);
          break;
        case 'Escape':
          e.preventDefault();
          setEditingCell(null);
          break;
        case 'ArrowDown':
          if (rowIndex < numRows - 1) {
            setEditingCell({
              rowIndex: rowIndex + 1,
              columnKey: String(columns[colIndex].key),
            });
          }
          break;
        case 'ArrowUp':
          if (rowIndex > 0) {
            setEditingCell({
              rowIndex: rowIndex - 1,
              columnKey: String(columns[colIndex].key),
            });
          }
          break;
      }
    },
    [editingCell, data.length, columns]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, startRowIndex: number, startColIndex: number) => {
      if (readOnly) return;
      e.preventDefault();

      const text = e.clipboardData.getData('text/plain');
      const rows = text.split('\n').filter((row) => row.trim());

      const newData = [...data];

      rows.forEach((rowText, rowOffset) => {
        const cells = rowText.split('\t');
        const targetRowIndex = startRowIndex + rowOffset;

        if (targetRowIndex >= newData.length) return;

        cells.forEach((cellValue, colOffset) => {
          const targetColIndex = startColIndex + colOffset;
          if (targetColIndex >= columns.length) return;

          const column = columns[targetColIndex];
          if (!column.editable && column.editable !== undefined) return;

          const parsedValue = column.parse ? column.parse(cellValue.trim()) : cellValue.trim();
          newData[targetRowIndex] = {
            ...newData[targetRowIndex],
            [column.key]: parsedValue,
          };
        });
      });

      onChange(newData);
    },
    [data, columns, onChange, readOnly]
  );

  const renderCell = (row: T, rowIndex: number, column: InlineColumn<T>, colIndex: number) => {
    const value = row[column.key as keyof T];
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.columnKey === String(column.key);
    const errorKey = `${rowIndex}-${String(column.key)}`;
    const hasError = validationErrors[errorKey];

    if (readOnly || !column.editable) {
      return (
        <Box
          px="xs"
          py={4}
          style={{
            minHeight: 32,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {column.format ? column.format(value) : String(value ?? '')}
        </Box>
      );
    }

    if (isEditing) {
      switch (column.type) {
        case 'number':
          return (
            <NumberInput
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={value as number}
              onChange={(val) => handleCellChange(rowIndex, column.key, val)}
              onBlur={() => setEditingCell(null)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              size="xs"
              hideControls
              error={hasError}
              styles={{ input: { minHeight: 32 } }}
            />
          );
        case 'select':
          return (
            <Select
              value={value as string}
              onChange={(val) => {
                handleCellChange(rowIndex, column.key, val);
                setEditingCell(null);
              }}
              onBlur={() => setEditingCell(null)}
              data={column.options || []}
              size="xs"
              error={hasError}
              searchable
              comboboxProps={{ zIndex: 1000 }}
            />
          );
        default:
          return (
            <TextInput
              ref={inputRef}
              value={value as string}
              onChange={(e) => handleCellChange(rowIndex, column.key, e.target.value)}
              onBlur={() => setEditingCell(null)}
              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              size="xs"
              error={hasError}
              styles={{ input: { minHeight: 32 } }}
            />
          );
      }
    }

    return (
      <Box
        px="xs"
        py={4}
        onClick={() => setEditingCell({ rowIndex, columnKey: String(column.key) })}
        style={{
          minHeight: 32,
          cursor: 'pointer',
          border: hasError ? '1px solid var(--mantine-color-red-5)' : undefined,
          borderRadius: 4,
        }}
      >
        {column.format ? column.format(value) : String(value ?? '')}
      </Box>
    );
  };

  return (
    <Box>
      <Table
        striped
        withTableBorder
        withColumnBorders
        stickyHeader={stickyHeader}
        stickyHeaderOffset={0}
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th
                key={String(column.key)}
                style={{
                  width: column.width,
                  minWidth: column.minWidth || 80,
                  whiteSpace: 'nowrap',
                }}
              >
                {column.header}
                {column.required && <span style={{ color: 'red' }}>*</span>}
              </Table.Th>
            ))}
            {showDeleteButton && <Table.Th style={{ width: 40 }} />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row, rowIndex) => (
            <Table.Tr key={row.id}>
              {columns.map((column, colIndex) => (
                <Table.Td
                  key={String(column.key)}
                  p={0}
                  onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                >
                  {renderCell(row, rowIndex, column, colIndex)}
                </Table.Td>
              ))}
              {showDeleteButton && (
                <Table.Td p={0} ta="center">
                  {!readOnly && onRowDelete && (
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => onRowDelete(rowIndex)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Table.Td>
              )}
            </Table.Tr>
          ))}
          {summaryRow && (
            <Table.Tr style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
              {summaryRow}
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {!readOnly && showAddButton && onRowAdd && (
        <Group mt="xs">
          <ActionIcon variant="light" color="blue" onClick={onRowAdd}>
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      )}
    </Box>
  );
}
