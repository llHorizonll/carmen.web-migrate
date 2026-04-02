import { useState, useMemo } from 'react';
import {
  Table,
  Checkbox,
  ScrollArea,
  Box,
  Text,
  LoadingOverlay,
  Pagination,
  Select,
  Group,
  TextInput,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { IconSearch, IconChevronDown, IconChevronUp, IconSelector, IconDownload, IconSettings } from '@tabler/icons-react';
import classes from './DataTable.module.css';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  totalRecords?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowClick?: (row: TData) => void;
  enableRowSelection?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  title?: string;
  toolbar?: React.ReactNode;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  totalRecords = 0,
  page = 1,
  pageSize = 15,
  pageSizeOptions = [15, 50, 100],
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortingChange,
  onRowClick,
  enableRowSelection = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found',
  title,
  toolbar,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  // Memoize columns with optional row selection
  const tableColumns = useMemo(() => {
    if (!enableRowSelection) return columns;
    
    const selectColumn: ColumnDef<TData, any> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
    };
    return [selectColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalRecords / pageSize),
  });

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Effect for debounced search
  useMemo(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const totalPages = Math.ceil(totalRecords / pageSize);
  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalRecords);

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group>
          {title && <Text fw={600} size="lg">{title}</Text>}
          <TextInput
            placeholder={searchPlaceholder}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            style={{ width: 250 }}
          />
        </Group>
        <Group>
          {toolbar}
          <ActionIcon variant="subtle" size="lg">
            <IconDownload size={20} />
          </ActionIcon>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <IconSettings size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Toggle Columns</Menu.Label>
              {table.getAllLeafColumns().map((column) => (
                <Menu.Item
                  key={column.id}
                  onClick={column.getToggleVisibilityHandler()}
                  disabled={!column.getCanHide()}
                >
                  <Group>
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={() => {}}
                      size="xs"
                    />
                    <Text size="sm">{column.columnDef.header as string || column.id}</Text>
                  </Group>
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Table */}
      <ScrollArea>
        <Box pos="relative">
          <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={classes.headerCell}
                    >
                      {header.isPlaceholder ? null : (
                        <Group
                          gap="xs"
                          onClick={header.column.getToggleSortingHandler()}
                          className={header.column.getCanSort() ? classes.sortable : undefined}
                        >
                          <Text size="sm" fw={500}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Text>
                          {header.column.getCanSort() && (
                            <ActionIcon variant="transparent" size="xs">
                              {header.column.getIsSorted() === 'asc' ? (
                                <IconChevronUp size={14} />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <IconChevronDown size={14} />
                              ) : (
                                <IconSelector size={14} />
                              )}
                            </ActionIcon>
                          )}
                        </Group>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {data.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={table.getAllColumns().length}>
                    <Text ta="center" c="dimmed" py="xl">
                      {emptyMessage}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Table.Tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={onRowClick ? classes.clickableRow : undefined}
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
        </Box>
      </ScrollArea>

      {/* Pagination */}
      {totalRecords > 0 && (
        <Group justify="space-between" mt="md">
          <Text size="sm" c="dimmed">
            Showing {startRecord} to {endRecord} of {totalRecords} records
          </Text>
          <Group>
            <Select
              value={pageSize.toString()}
              onChange={(value) => onPageSizeChange?.(Number(value))}
              data={pageSizeOptions.map((size) => ({ value: size.toString(), label: `${size} / page` }))}
              style={{ width: 100 }}
              size="sm"
            />
            <Pagination
              value={page}
              onChange={onPageChange}
              total={totalPages}
              size="sm"
              withEdges
            />
          </Group>
        </Group>
      )}
    </Box>
  );
}