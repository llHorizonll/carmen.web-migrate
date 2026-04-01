/**
 * DataTable Component
 * High-performance table using TanStack Table v8
 * Supports sorting, filtering, pagination, and row selection
 */

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  ScrollArea,
  Pagination,
  Group,
  Text,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { useState, useCallback } from 'react';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  totalRows?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  sorting?: {
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
  };
  filtering?: {
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: (filters: ColumnFiltersState) => void;
  };
  selection?: {
    rowSelection: RowSelectionState;
    onRowSelectionChange: (selection: RowSelectionState) => void;
    enableMultiSelect?: boolean;
  };
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
  maxHeight?: number | string;
  stickyHeader?: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  loading = false,
  totalRows,
  pagination,
  sorting,
  filtering,
  selection,
  onRowClick,
  emptyMessage = 'No data found',
  maxHeight,
  stickyHeader = true,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalFilters, setInternalFilters] = useState<ColumnFiltersState>([]);
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>({});

  const effectiveSorting = sorting?.sorting ?? internalSorting;
  const effectiveFilters = filtering?.columnFilters ?? internalFilters;
  const effectiveSelection = selection?.rowSelection ?? internalSelection;

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updater === 'function' ? updater(effectiveSorting) : updater;
      if (sorting?.onSortingChange) {
        sorting.onSortingChange(newSorting);
      } else {
        setInternalSorting(newSorting);
      }
    },
    [effectiveSorting, sorting]
  );

  const handleFiltersChange = useCallback(
    (updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      const newFilters = typeof updater === 'function' ? updater(effectiveFilters) : updater;
      if (filtering?.onColumnFiltersChange) {
        filtering.onColumnFiltersChange(newFilters);
      } else {
        setInternalFilters(newFilters);
      }
    },
    [effectiveFilters, filtering]
  );

  const handleSelectionChange = useCallback(
    (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
      const newSelection = typeof updater === 'function' ? updater(effectiveSelection) : updater;
      if (selection?.onRowSelectionChange) {
        selection.onRowSelectionChange(newSelection);
      } else {
        setInternalSelection(newSelection);
      }
    },
    [effectiveSelection, selection]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: effectiveSorting,
      columnFilters: effectiveFilters,
      rowSelection: effectiveSelection,
      pagination: pagination
        ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
        : undefined,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleFiltersChange,
    onRowSelectionChange: handleSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination: !!pagination,
    enableRowSelection: !!selection,
    enableMultiRowSelection: selection?.enableMultiSelect ?? true,
  });

  const totalPages = pagination
    ? Math.ceil((totalRows ?? data.length) / pagination.pageSize)
    : 0;

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      
      <ScrollArea h={maxHeight} type="auto">
        <Table
          striped
          highlightOnHover
          withTableBorder
          stickyHeader={stickyHeader}
          stickyHeaderOffset={0}
        >
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th
                    key={header.id}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      width: header.getSize(),
                      whiteSpace: 'nowrap',
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' && ' ↑'}
                    {header.column.getIsSorted() === 'desc' && ' ↓'}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} ta="center" py="xl">
                  <Text c="dimmed">{emptyMessage}</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  bg={row.getIsSelected() ? 'var(--mantine-color-blue-light)' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {pagination && totalPages > 1 && (
        <Group justify="space-between" mt="md">
          <Text size="sm" c="dimmed">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              totalRows ?? data.length
            )}{' '}
            of {totalRows ?? data.length} entries
          </Text>
          <Pagination
            total={totalPages}
            value={pagination.pageIndex + 1}
            onChange={(page) => pagination.onPageChange(page - 1)}
          />
        </Group>
      )}
    </Box>
  );
}
