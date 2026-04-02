import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Group,
  Text,
  Select,
  TextInput,
  Stack,
  Paper,
  Grid,
  Title,
  Badge,
  NumberFormatter,
  Tabs,
  Tooltip,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconDownload, IconPrinter, IconChartBar, IconCopy } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';

// Mock data for budget
interface BudgetItem {
  BudgetId: number;
  BudgetYear: number;
  AccCode: string;
  AccName: string;
  DeptCode: string;
  DeptName: string;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
  Total: number;
  Actual: number;
  Variance: number;
  VariancePct: number;
}

const mockData: BudgetItem[] = [
  { BudgetId: 1, BudgetYear: 2024, AccCode: '5000', AccName: 'Cost of Goods Sold', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 50000, Q2: 55000, Q3: 60000, Q4: 55000, Total: 220000, Actual: 210000, Variance: 10000, VariancePct: 4.5 },
  { BudgetId: 2, BudgetYear: 2024, AccCode: '5210', AccName: 'Salaries and Benefits', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 30000, Q2: 32000, Q3: 34000, Q4: 34000, Total: 130000, Actual: 128000, Variance: 2000, VariancePct: 1.5 },
  { BudgetId: 3, BudgetYear: 2024, AccCode: '5220', AccName: 'Rent Expense', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 12000, Q2: 12000, Q3: 12000, Q4: 12000, Total: 48000, Actual: 48000, Variance: 0, VariancePct: 0 },
  { BudgetId: 4, BudgetYear: 2024, AccCode: '5230', AccName: 'Utilities', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 5000, Q2: 5000, Q3: 5000, Q4: 5000, Total: 20000, Actual: 19500, Variance: 500, VariancePct: 2.5 },
  { BudgetId: 5, BudgetYear: 2024, AccCode: '5240', AccName: 'Marketing', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 8000, Q2: 8000, Q3: 7000, Q4: 7000, Total: 30000, Actual: 28500, Variance: 1500, VariancePct: 5.0 },
  { BudgetId: 6, BudgetYear: 2024, AccCode: '5250', AccName: 'Depreciation', DeptCode: 'HQ', DeptName: 'Headquarters', Q1: 5000, Q2: 5000, Q3: 5000, Q4: 5000, Total: 20000, Actual: 20000, Variance: 0, VariancePct: 0 },
  { BudgetId: 7, BudgetYear: 2024, AccCode: '5210', AccName: 'Salaries and Benefits', DeptCode: 'BR1', DeptName: 'Branch 1', Q1: 20000, Q2: 22000, Q3: 22000, Q4: 22000, Total: 86000, Actual: 85000, Variance: 1000, VariancePct: 1.2 },
  { BudgetId: 8, BudgetYear: 2024, AccCode: '5220', AccName: 'Rent Expense', DeptCode: 'BR1', DeptName: 'Branch 1', Q1: 8000, Q2: 8000, Q3: 8000, Q4: 8000, Total: 32000, Actual: 32000, Variance: 0, VariancePct: 0 },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function Budget() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [budgetYear, setBudgetYear] = useState<string>('2024');
  const [deptCode, setDeptCode] = useState<'All' | string>('All');
  const [activeTab, setActiveTab] = useState<string>('list');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.AccCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.AccName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.DeptCode.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesYear = item.BudgetYear.toString() === budgetYear;
      const matchesDept = deptCode === 'All' || item.DeptCode === deptCode;
      return matchesSearch && matchesYear && matchesDept;
    });
  }, [debouncedSearch, budgetYear, deptCode]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        Q1: acc.Q1 + item.Q1,
        Q2: acc.Q2 + item.Q2,
        Q3: acc.Q3 + item.Q3,
        Q4: acc.Q4 + item.Q4,
        Total: acc.Total + item.Total,
        Actual: acc.Actual + item.Actual,
        Variance: acc.Variance + item.Variance,
      }),
      { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Total: 0, Actual: 0, Variance: 0 }
    );
  }, [filteredData]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'AccCode' as const,
        header: 'Account Code',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'AccName' as const,
        header: 'Account Name',
        cell: (info: { getValue: () => string }) => (
          <Text fw={500}>{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'DeptCode' as const,
        header: 'Dept',
        cell: (info: { getValue: () => string; row: { original: BudgetItem } }) => (
          <Tooltip label={info.row.original.DeptName}>
            <Badge variant="light">{info.getValue()}</Badge>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'Q1' as const,
        header: 'Q1',
        cell: (info: { getValue: () => number }) => (
          <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
        ),
      },
      {
        accessorKey: 'Q2' as const,
        header: 'Q2',
        cell: (info: { getValue: () => number }) => (
          <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
        ),
      },
      {
        accessorKey: 'Q3' as const,
        header: 'Q3',
        cell: (info: { getValue: () => number }) => (
          <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
        ),
      },
      {
        accessorKey: 'Q4' as const,
        header: 'Q4',
        cell: (info: { getValue: () => number }) => (
          <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
        ),
      },
      {
        accessorKey: 'Total' as const,
        header: 'Budget Total',
        cell: (info: { getValue: () => number }) => (
          <Text fw={600}>
            <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
          </Text>
        ),
      },
      {
        accessorKey: 'Actual' as const,
        header: 'Actual',
        cell: (info: { getValue: () => number }) => (
          <NumberFormatter value={info.getValue()} prefix="$ " thousandSeparator />
        ),
      },
      {
        accessorKey: 'VariancePct' as const,
        header: 'Var %',
        cell: (info: { getValue: () => number }) => {
          const value = info.getValue();
          return (
            <Badge color={value > 0 ? 'green' : value < 0 ? 'red' : 'gray'} variant="light">
              {value.toFixed(1)}%
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <PageHeader
        title="Budget Management"
        subtitle="Manage and track budget vs actual"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Budget' },
        ]}
        actions={
          <Group>
            <Button variant="light" leftSection={<IconCopy size={16} />}>
              Copy Budget
            </Button>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Import
            </Button>
            <Button leftSection={<IconPlus size={16} />}>
              Add Budget
            </Button>
          </Group>
        }
      />

      <Tabs value={activeTab} onChange={(val) => setActiveTab(val || 'list')}>
        <Tabs.List>
          <Tabs.Tab value="list" leftSection={<IconChartBar size={16} />}>Budget List</Tabs.Tab>
          <Tabs.Tab value="summary" leftSection={<IconPrinter size={16} />}>Summary Report</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list" pt="md">
          <Stack gap="md">
            {/* Filters */}
            <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
              <Group grow>
                <TextInput
                  placeholder="Search accounts..."
                  leftSection={<IconSearch size={16} />}
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
                <Select
                  label="Budget Year"
                  value={budgetYear}
                  onChange={(val) => setBudgetYear(val || '2024')}
                  data={['2024', '2023', '2025']}
                />
                <Select
                  label="Department"
                  value={deptCode}
                  onChange={(val) => setDeptCode(val || 'All')}
                  data={[
                    { value: 'All', label: 'All Departments' },
                    { value: 'HQ', label: 'Headquarters' },
                    { value: 'BR1', label: 'Branch 1' },
                    { value: 'BR2', label: 'Branch 2' },
                  ]}
                  clearable
                />
              </Group>
            </Box>

            {/* Summary Cards */}
            <Grid>
              <Grid.Col span={3}>
                <Paper withBorder p="md">
                  <Text size="xs" c="dimmed" tt="uppercase">Total Budget</Text>
                  <Text size="xl" fw={700} c="blue">
                    <NumberFormatter value={totals.Total} prefix="$ " thousandSeparator />
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={3}>
                <Paper withBorder p="md">
                  <Text size="xs" c="dimmed" tt="uppercase">Actual</Text>
                  <Text size="xl" fw={700} c="green">
                    <NumberFormatter value={totals.Actual} prefix="$ " thousandSeparator />
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={3}>
                <Paper withBorder p="md">
                  <Text size="xs" c="dimmed" tt="uppercase">Variance</Text>
                  <Text size="xl" fw={700} c={totals.Variance >= 0 ? 'teal' : 'red'}>
                    <NumberFormatter value={totals.Variance} prefix="$ " thousandSeparator />
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={3}>
                <Paper withBorder p="md">
                  <Text size="xs" c="dimmed" tt="uppercase">Utilization</Text>
                  <Text size="xl" fw={700} c="orange">
                    {totals.Total > 0 ? ((totals.Actual / totals.Total) * 100).toFixed(1) : 0}%
                  </Text>
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
        </Tabs.Panel>

        <Tabs.Panel value="summary" pt="md">
          <Paper withBorder p="xl">
            <Stack align="center" gap="md">
              <IconChartBar size={64} color="gray" />
              <Title order={3}>Budget Summary Report</Title>
              <Text c="dimmed" ta="center" maw={500}>
                Comprehensive budget vs actual analysis with charts and detailed variance reporting.
              </Text>
              <Button leftSection={<IconPrinter size={16} />}>
                Generate Summary Report
              </Button>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
