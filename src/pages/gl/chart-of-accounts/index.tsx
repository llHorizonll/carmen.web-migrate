import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Group,
  Text,
  Select,
  Stack,
  Paper,
  Grid,
  
  
  Badge,
  ActionIcon,
  Tooltip,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEdit, IconEye, IconDownload } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';

// Mock data for chart of accounts
interface ChartOfAccount {
  AccId: number;
  AccCode: string;
  AccName: string;
  AccType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  ParentId?: number;
  ParentName?: string;
  Level: number;
  IsActive: boolean;
  IsPostable: boolean;
  CurCode: string;
}

const mockData: ChartOfAccount[] = [
  { AccId: 1, AccCode: '1000', AccName: 'Assets', AccType: 'Asset', Level: 1, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 2, AccCode: '1100', AccName: 'Current Assets', AccType: 'Asset', ParentId: 1, ParentName: 'Assets', Level: 2, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 3, AccCode: '1110', AccName: 'Cash and Cash Equivalents', AccType: 'Asset', ParentId: 2, ParentName: 'Current Assets', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 4, AccCode: '1120', AccName: 'Accounts Receivable', AccType: 'Asset', ParentId: 2, ParentName: 'Current Assets', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 5, AccCode: '1130', AccName: 'Inventory', AccType: 'Asset', ParentId: 2, ParentName: 'Current Assets', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 6, AccCode: '1500', AccName: 'Fixed Assets', AccType: 'Asset', ParentId: 1, ParentName: 'Assets', Level: 2, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 7, AccCode: '1510', AccName: 'Property, Plant & Equipment', AccType: 'Asset', ParentId: 6, ParentName: 'Fixed Assets', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 8, AccCode: '1520', AccName: 'Accumulated Depreciation', AccType: 'Asset', ParentId: 6, ParentName: 'Fixed Assets', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 9, AccCode: '2000', AccName: 'Liabilities', AccType: 'Liability', Level: 1, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 10, AccCode: '2100', AccName: 'Current Liabilities', AccType: 'Liability', ParentId: 9, ParentName: 'Liabilities', Level: 2, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 11, AccCode: '2110', AccName: 'Accounts Payable', AccType: 'Liability', ParentId: 10, ParentName: 'Current Liabilities', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 12, AccCode: '2120', AccName: 'Accrued Expenses', AccType: 'Liability', ParentId: 10, ParentName: 'Current Liabilities', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 13, AccCode: '3000', AccName: 'Equity', AccType: 'Equity', Level: 1, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 14, AccCode: '3100', AccName: 'Share Capital', AccType: 'Equity', ParentId: 13, ParentName: 'Equity', Level: 2, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 15, AccCode: '3200', AccName: 'Retained Earnings', AccType: 'Equity', ParentId: 13, ParentName: 'Equity', Level: 2, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 16, AccCode: '4000', AccName: 'Revenue', AccType: 'Revenue', Level: 1, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 17, AccCode: '4100', AccName: 'Sales Revenue', AccType: 'Revenue', ParentId: 16, ParentName: 'Revenue', Level: 2, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 18, AccCode: '4200', AccName: 'Service Revenue', AccType: 'Revenue', ParentId: 16, ParentName: 'Revenue', Level: 2, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 19, AccCode: '5000', AccName: 'Expenses', AccType: 'Expense', Level: 1, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 20, AccCode: '5100', AccName: 'Cost of Goods Sold', AccType: 'Expense', ParentId: 19, ParentName: 'Expenses', Level: 2, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 21, AccCode: '5200', AccName: 'Operating Expenses', AccType: 'Expense', ParentId: 19, ParentName: 'Expenses', Level: 2, IsActive: true, IsPostable: false, CurCode: 'USD' },
  { AccId: 22, AccCode: '5210', AccName: 'Salaries and Benefits', AccType: 'Expense', ParentId: 21, ParentName: 'Operating Expenses', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
  { AccId: 23, AccCode: '5220', AccName: 'Rent Expense', AccType: 'Expense', ParentId: 21, ParentName: 'Operating Expenses', Level: 3, IsActive: true, IsPostable: true, CurCode: 'USD' },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function ChartOfAccounts() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [accType, setAccType] = useState<'All' | 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'>('All');
  const [level, setLevel] = useState<'All' | '1' | '2' | '3'>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.AccCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.AccName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = accType === 'All' || item.AccType === accType;
      const matchesLevel = level === 'All' || item.Level.toString() === level;
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [debouncedSearch, accType, level]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const getAccTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'blue';
      case 'Liability': return 'red';
      case 'Equity': return 'green';
      case 'Revenue': return 'teal';
      case 'Expense': return 'orange';
      default: return 'gray';
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'AccCode' as const,
        header: 'Account Code',
        cell: (info: { getValue: () => string; row: { original: ChartOfAccount } }) => {
          const value = info.getValue();
          const item = info.row.original;
          const indent = item.Level * 16;
          return (
            <Text fw={item.Level === 1 ? 700 : 400} pl={indent}>
              {value}
            </Text>
          );
        },
      },
      {
        accessorKey: 'AccName' as const,
        header: 'Account Name',
        cell: (info: { getValue: () => string; row: { original: ChartOfAccount } }) => {
          const value = info.getValue();
          const item = info.row.original;
          return (
            <Text fw={item.Level === 1 ? 700 : item.IsPostable ? 400 : 500}>
              {value}
              {!item.IsPostable && <Text span size="xs" c="dimmed" ml="xs">(Group)</Text>}
            </Text>
          );
        },
      },
      {
        accessorKey: 'AccType' as const,
        header: 'Type',
        cell: (info: { getValue: () => string }) => (
          <Badge color={getAccTypeColor(info.getValue())}>
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: 'Level' as const,
        header: 'Level',
        cell: (info: { getValue: () => number }) => info.getValue(),
      },
      {
        accessorKey: 'IsPostable' as const,
        header: 'Postable',
        cell: (info: { getValue: () => boolean }) => {
          const value = info.getValue();
          return <Badge color={value ? 'green' : 'gray'} variant="light">{value ? 'Yes' : 'No'}</Badge>;
        },
      },
      {
        accessorKey: 'IsActive' as const,
        header: 'Status',
        cell: (info: { getValue: () => boolean }) => {
          const value = info.getValue();
          return <Badge color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Badge>;
        },
      },
      {
        accessorKey: 'CurCode' as const,
        header: 'Currency',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        id: 'actions',
        header: '',
        cell: () => {
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon variant="light">
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit">
                <ActionIcon variant="light" color="blue">
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <PageHeader
        title="Chart of Accounts"
        subtitle="Manage your chart of accounts"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Chart of Accounts' },
        ]}
        actions={
          <Group>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Import
            </Button>
            <Button leftSection={<IconPlus size={16} />}>
              Add Account
            </Button>
          </Group>
        }
      />

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search accounts..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label="Account Type"
              value={accType}
              onChange={(val) => setAccType(val as typeof accType)}
              data={[
                { value: 'All', label: 'All Types' },
                { value: 'Asset', label: 'Asset' },
                { value: 'Liability', label: 'Liability' },
                { value: 'Equity', label: 'Equity' },
                { value: 'Revenue', label: 'Revenue' },
                { value: 'Expense', label: 'Expense' },
              ]}
              clearable
            />
            <Select
              label="Level"
              value={level}
              onChange={(val) => setLevel(val as typeof level)}
              data={[
                { value: 'All', label: 'All Levels' },
                { value: '1', label: 'Level 1 - Header' },
                { value: '2', label: 'Level 2 - Sub-header' },
                { value: '3', label: 'Level 3 - Postable' },
              ]}
              clearable
            />
          </Group>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={2}>
          <Paper withBorder p="sm" ta="center">
            <Text size="xs" c="dimmed">Total Accounts</Text>
            <Text size="xl" fw={700}>{mockData.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}>
          <Paper withBorder p="sm" ta="center">
            <Text size="xs" c="dimmed">Postable</Text>
            <Text size="xl" fw={700} c="green">{mockData.filter(a => a.IsPostable).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}>
          <Paper withBorder p="sm" ta="center">
            <Text size="xs" c="dimmed">Headers</Text>
            <Text size="xl" fw={700} c="blue">{mockData.filter(a => !a.IsPostable).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}>
          <Paper withBorder p="sm" ta="center">
            <Text size="xs" c="dimmed">Active</Text>
            <Text size="xl" fw={700} c="teal">{mockData.filter(a => a.IsActive).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={2}>
          <Paper withBorder p="sm" ta="center">
            <Text size="xs" c="dimmed">Inactive</Text>
            <Text size="xl" fw={700} c="red">{mockData.filter(a => !a.IsActive).length}</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Data Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        isLoading={false}
        totalRecords={filteredData.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </Stack>
  );
}
