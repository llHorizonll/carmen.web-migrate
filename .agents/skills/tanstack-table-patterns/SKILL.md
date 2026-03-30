---
name: tanstack-table-patterns
description: High-performance table patterns using TanStack Table v8 and TanStack Virtual for Carmen.Web accounting ERP. Use when building data tables with large datasets, inline editing, or Excel-like features.
---

# TanStack Table Patterns

This skill provides patterns for building high-performance tables in Carmen.Web using TanStack Table v8 and TanStack Virtual.

## Why TanStack Table?

- **Headless**: Full styling control with Mantine
- **Virtualization**: Handle 100k+ rows at 60fps
- **TypeScript**: Full type safety
- **Lightweight**: ~15KB tree-shaken
- **Excel features**: Copy/paste, keyboard nav

## Installation

Already installed in project:
- `@tanstack/react-table@^8.21.2`
- `@tanstack/react-virtual@^3.13.6`

## Basic Data Table (List View)

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Table, ScrollArea, Pagination } from '@mantine/core';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
}

export function DataTable<T>({ data, columns, loading }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Stack>
      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      
      <Pagination
        total={table.getPageCount()}
        value={table.getState().pagination.pageIndex + 1}
        onChange={(page) => table.setPageIndex(page - 1)}
      />
    </Stack>
  );
}
```

## Virtualized Table (100k+ Rows)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function VirtualTable<T>({ data, columns }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Row height estimate
    overscan: 20, // Number of rows to render outside viewport
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        <Table>
          <Table.Thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <Table.Tr
                  key={row.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
```

## Inline Editing Table (Voucher Details)

```tsx
import { useState, useCallback } from 'react';
import { TextInput, NumberInput, Select } from '@mantine/core';

interface InlineTableProps<T> {
  data: T[];
  onChange: (data: T[]) => void;
  columns: EditableColumn<T>[];
}

interface EditableColumn<T> {
  accessorKey: keyof T;
  header: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: { value: string; label: string }[];
  width?: number;
}

export function InlineTable<T extends { id: string | number }>({
  data,
  onChange,
  columns,
}: InlineTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string | number;
    columnKey: keyof T;
  } | null>(null);

  const handleCellChange = useCallback(
    (rowId: string | number, columnKey: keyof T, value: unknown) => {
      const newData = data.map((row) =>
        row.id === rowId ? { ...row, [columnKey]: value } : row
      );
      onChange(newData);
    },
    [data, onChange]
  );

  const renderCell = (row: T, column: EditableColumn<T>) => {
    const value = row[column.accessorKey];
    const isEditing =
      editingCell?.rowId === row.id && editingCell?.columnKey === column.accessorKey;

    if (isEditing) {
      switch (column.type) {
        case 'number':
          return (
            <NumberInput
              value={value as number}
              onChange={(val) => handleCellChange(row.id, column.accessorKey, val)}
              onBlur={() => setEditingCell(null)}
              autoFocus
              hideControls
              size="xs"
            />
          );
        case 'select':
          return (
            <Select
              value={value as string}
              onChange={(val) => {
                handleCellChange(row.id, column.accessorKey, val);
                setEditingCell(null);
              }}
              onBlur={() => setEditingCell(null)}
              data={column.options || []}
              autoFocus
              size="xs"
            />
          );
        default:
          return (
            <TextInput
              value={value as string}
              onChange={(e) =>
                handleCellChange(row.id, column.accessorKey, e.target.value)
              }
              onBlur={() => setEditingCell(null)}
              autoFocus
              size="xs"
            />
          );
      }
    }

    return (
      <div
        onClick={() => setEditingCell({ rowId: row.id, columnKey: column.accessorKey })}
        style={{ minHeight: 30, padding: '4px 8px', cursor: 'pointer' }}
      >
        {value as string}
      </div>
    );
  };

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={String(col.accessorKey)} style={{ width: col.width }}>
              {col.header}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row) => (
          <Table.Tr key={row.id}>
            {columns.map((col) => (
              <Table.Td key={String(col.accessorKey)}>
                {renderCell(row, col)}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
```

## Excel-like Features

### Copy/Paste from Excel

```tsx
export function useExcelPaste<T>(onPaste: (data: T[]) => void) {
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      const rows = text.split('\n').filter((row) => row.trim());
      
      const parsedData = rows.map((row) => {
        // Parse tab-separated values
        return row.split('\t').map((cell) => cell.trim());
      });

      onPaste(parsedData as unknown as T[]);
    },
    [onPaste]
  );

  return { handlePaste };
}
```

### Keyboard Navigation

```tsx
export function useTableKeyboardNavigation(
  rowCount: number,
  columnCount: number,
  onCellChange: (row: number, col: number) => void
) {
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const { row, col } = selectedCell;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCell({ row: Math.max(0, row - 1), col });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCell({ row: Math.min(rowCount - 1, row + 1), col });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedCell({ row, col: Math.max(0, col - 1) });
          break;
        case 'ArrowRight':
        case 'Tab':
          e.preventDefault();
          setSelectedCell({ row, col: Math.min(columnCount - 1, col + 1) });
          break;
        case 'Enter':
          e.preventDefault();
          onCellChange(row, col);
          break;
      }
    },
    [selectedCell, rowCount, columnCount, onCellChange]
  );

  return { selectedCell, setSelectedCell, handleKeyDown };
}
```

## Column Definitions Example

```tsx
import { createColumnHelper } from '@tanstack/react-table';
import { formatDate, formatNumber } from '@utils/formatter';
import { StatusBadge } from '@components/ui/StatusBadge';
import type { JournalVoucher } from '@types';

const columnHelper = createColumnHelper<JournalVoucher>();

export const jvColumns = [
  columnHelper.accessor('JvhNo', {
    header: 'Voucher No',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('JvhDate', {
    header: 'Date',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('Prefix', {
    header: 'Prefix',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('Description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('Status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <ActionMenu
        items={[
          { label: 'Edit', onClick: () => onEdit(info.row.original) },
          { label: 'View', onClick: () => onView(info.row.original) },
          { label: 'Void', onClick: () => onVoid(info.row.original), color: 'red' },
        ]}
      />
    ),
  }),
];
```

## Server-Side Pagination/Filtering

```tsx
import { useState } from 'react';
import { useJvList } from '@hooks/useJournalVoucher';

export function JournalVoucherList() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [filters, setFilters] = useState({
    status: 'All',
    fromDate: null,
    toDate: null,
  });

  const { data, isLoading } = useJvList({
    Limit: pagination.pageSize,
    Page: pagination.pageIndex + 1,
    WhereGroupList: buildWhereClause(filters),
  });

  const table = useReactTable({
    data: data?.Data ?? [],
    columns: jvColumns,
    pageCount: data?.TotalPages ?? 0,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <DataTable
      table={table}
      loading={isLoading}
      totalRows={data?.Total ?? 0}
    />
  );
}
```
