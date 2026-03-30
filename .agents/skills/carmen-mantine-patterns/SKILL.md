---
name: carmen-mantine-patterns
description: Carmen.Web specific Mantine UI patterns for accounting ERP. Use when creating forms, tables, dialogs, and layouts for the Carmen.Web accounting system with Mantine 8.x.
---

# Carmen Mantine Patterns

This skill provides patterns and best practices for building UI components in the Carmen.Web accounting ERP system using Mantine 8.x.

## Project Context

- **Mantine Version**: 8.3.x
- **Theme**: Located at `@lib/mantine.ts`
- **Primary Color**: Blue (#228be6)
- **Default Size**: sm (small)

## Common Patterns

### Form Layout Pattern

Accounting forms typically have:
- Header section (Date, Number, Status)
- Detail grid/table (inline editing)
- Summary/Footer section
- Action buttons

```tsx
import { Paper, Grid, TextInput, DatePickerInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';

export function VoucherForm() {
  const form = useForm({
    initialValues: {
      date: new Date(),
      prefix: '',
      description: '',
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {/* Header */}
      <Paper withBorder p="md" mb="md">
        <Grid gutter="md">
          <Grid.Col span={3}>
            <DatePickerInput
              label="Date"
              required
              {...form.getInputProps('date')}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              label="Prefix"
              required
              {...form.getInputProps('prefix')}
            />
          </Grid.Col>
          <Grid.Col span={7}>
            <TextInput
              label="Description"
              {...form.getInputProps('description')}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Detail Table */}
      <Paper withBorder p="md" mb="md">
        {/* Inline table component */}
      </Paper>

      {/* Footer Actions */}
      <Group justify="flex-end">
        <Button variant="default">Cancel</Button>
        <Button type="submit" color="blue">Save</Button>
      </Group>
    </form>
  );
}
```

### Status Badge Pattern

```tsx
import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: 'Draft' | 'Normal' | 'Void';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    Draft: 'gray',
    Normal: 'blue',
    Void: 'red',
  };

  return (
    <Badge color={colors[status]} variant="filled">
      {status}
    </Badge>
  );
}
```

### Permission-Based UI Pattern

```tsx
import { hasPermission } from '@utils/constants';
import type { Permission } from '@utils/constants';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const userPermissions = useUserPermissions(); // From auth context
  
  if (!hasPermission(userPermissions, permission)) {
    return fallback;
  }
  
  return children;
}

// Usage
<PermissionGuard permission="GL.Jv">
  <Button>New Journal Voucher</Button>
</PermissionGuard>
```

### DataTable Pattern (List Views)

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, ScrollArea } from '@mantine/core';

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ScrollArea>
      <Table striped highlightOnHover>
        <Table.Thead>
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
  );
}
```

### Dialog Pattern

```tsx
import { modals } from '@mantine/modals';

// Open confirmation dialog
const openDeleteModal = () =>
  modals.openConfirmModal({
    title: 'Delete voucher',
    children: (
      <Text size="sm">
        Are you sure you want to delete this voucher? This action cannot be undone.
      </Text>
    ),
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    onConfirm: () => deleteVoucher(),
  });

// Open custom modal
const openDetailModal = (data: JournalVoucher) =>
  modals.open({
    title: 'Journal Voucher Details',
    size: 'xl',
    children: <JVDetailView data={data} />,
  });
```

### Notification Pattern

```tsx
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

// Success notification
notifications.show({
  title: 'Success',
  message: 'Journal voucher saved successfully',
  color: 'green',
  icon: <IconCheck size={16} />,
});

// Error notification
notifications.show({
  title: 'Error',
  message: error.message || 'An error occurred',
  color: 'red',
  icon: <IconX size={16} />,
});
```

### Loading States Pattern

```tsx
import { Skeleton, Button } from '@mantine/core';

// Button loading
<Button loading={isPending}>
  Save
</Button>

// Form loading
{isLoading ? (
  <>
    <Skeleton height={50} mb="md" />
    <Skeleton height={50} mb="md" />
    <Skeleton height={200} />
  </>
) : (
  <ActualForm />
)}

// Table loading
<Table>
  <Table.Thead>{/* headers */}</Table.Thead>
  <Table.Tbody>
    {isLoading ? (
      Array(5).fill(0).map((_, i) => (
        <Table.Tr key={i}>
          <Table.Td><Skeleton height={30} /></Table.Td>
          {/* more cells */}
        </Table.Tr>
      ))
    ) : (
      data.map((row) => <TableRow key={row.id} data={row} />)
    )}
  </Table.Tbody>
</Table>
```

### Filter Panel Pattern

```tsx
import { Paper, Grid, TextInput, Select, DatePickerInput, Group, Button } from '@mantine/core';

export function FilterPanel({ filters, onChange, onApply, onReset }: FilterPanelProps) {
  return (
    <Paper withBorder p="md" mb="md">
      <Grid gutter="md">
        <Grid.Col span={3}>
          <DatePickerInput
            label="From Date"
            value={filters.fromDate}
            onChange={(date) => onChange({ ...filters, fromDate: date })}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <DatePickerInput
            label="To Date"
            value={filters.toDate}
            onChange={(date) => onChange({ ...filters, toDate: date })}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            label="Status"
            value={filters.status}
            onChange={(value) => onChange({ ...filters, status: value })}
            data={[
              { value: 'All', label: 'All' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Void', label: 'Void' },
            ]}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="Search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search..."
          />
        </Grid.Col>
      </Grid>
      <Group justify="flex-end" mt="md">
        <Button variant="subtle" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onApply}>
          Apply Filters
        </Button>
      </Group>
    </Paper>
  );
}
```

## Icon Usage

Use Tabler Icons for consistency:

```tsx
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconDownload,
  IconPrinter,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
```

## Responsive Breakpoints

```tsx
// Mantine default breakpoints
// xs: 576px
// sm: 768px
// md: 992px
// lg: 1200px
// xl: 1400px

// Grid responsive
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
    {/* Content */}
  </Grid.Col>
</Grid>

// Hide on mobile
<Box visibleFrom="sm">
  Desktop only content
</Box>

// Hide on desktop
<Box hiddenFrom="sm">
  Mobile only content
</Box>
```
