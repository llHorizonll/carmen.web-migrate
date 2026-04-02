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
  Title,
  Table,
  Badge,
  NumberFormatter,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconDownload, IconPrinter } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format, startOfMonth, endOfMonth } from 'date-fns';

// Mock data for account summary
interface AccountSummaryItem {
  AccCode: string;
  AccName: string;
  AccType: string;
  OpeningBalance: number;
  PeriodDebit: number;
  PeriodCredit: number;
  ClosingBalance: number;
}

const mockData: AccountSummaryItem[] = [
  {
    AccCode: '1000',
    AccName: 'Cash',
    AccType: 'Asset',
    OpeningBalance: 100000.00,
    PeriodDebit: 50000.00,
    PeriodCredit: 25000.00,
    ClosingBalance: 125000.00,
  },
  {
    AccCode: '1100',
    AccName: 'Accounts Receivable',
    AccType: 'Asset',
    OpeningBalance: 75000.00,
    PeriodDebit: 45000.00,
    PeriodCredit: 30000.00,
    ClosingBalance: 90000.00,
  },
  {
    AccCode: '1500',
    AccName: 'Fixed Assets',
    AccType: 'Asset',
    OpeningBalance: 500000.00,
    PeriodDebit: 100000.00,
    PeriodCredit: 0.00,
    ClosingBalance: 600000.00,
  },
  {
    AccCode: '2000',
    AccName: 'Accounts Payable',
    AccType: 'Liability',
    OpeningBalance: 50000.00,
    PeriodDebit: 20000.00,
    PeriodCredit: 35000.00,
    ClosingBalance: 65000.00,
  },
  {
    AccCode: '2100',
    AccName: 'Accrued Expenses',
    AccType: 'Liability',
    OpeningBalance: 25000.00,
    PeriodDebit: 10000.00,
    PeriodCredit: 15000.00,
    ClosingBalance: 30000.00,
  },
  {
    AccCode: '3000',
    AccName: 'Share Capital',
    AccType: 'Equity',
    OpeningBalance: 600000.00,
    PeriodDebit: 0.00,
    PeriodCredit: 0.00,
    ClosingBalance: 600000.00,
  },
  {
    AccCode: '4000',
    AccName: 'Sales Revenue',
    AccType: 'Revenue',
    OpeningBalance: 0.00,
    PeriodDebit: 0.00,
    PeriodCredit: 125000.00,
    ClosingBalance: 125000.00,
  },
  {
    AccCode: '5000',
    AccName: 'Cost of Goods Sold',
    AccType: 'Expense',
    OpeningBalance: 0.00,
    PeriodDebit: 60000.00,
    PeriodCredit: 0.00,
    ClosingBalance: 60000.00,
  },
  {
    AccCode: '6000',
    AccName: 'Operating Expenses',
    AccType: 'Expense',
    OpeningBalance: 0.00,
    PeriodDebit: 45000.00,
    PeriodCredit: 0.00,
    ClosingBalance: 45000.00,
  },
];

export default function AccountSummary() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);
  const [accType, setAccType] = useState<'All' | 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      return accType === 'All' || item.AccType === accType;
    });
  }, [accType]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        OpeningBalance: acc.OpeningBalance + item.OpeningBalance,
        PeriodDebit: acc.PeriodDebit + item.PeriodDebit,
        PeriodCredit: acc.PeriodCredit + item.PeriodCredit,
        ClosingBalance: acc.ClosingBalance + item.ClosingBalance,
      }),
      { OpeningBalance: 0, PeriodDebit: 0, PeriodCredit: 0, ClosingBalance: 0 }
    );
  }, [filteredData]);

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

  return (
    <Stack gap="md">
      <PageHeader
        title="Account Summary"
        subtitle="View account balances and movements"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Account Summary' },
        ]}
        actions={
          <Group>
            <Button variant="light" leftSection={<IconPrinter size={16} />}>
              Print
            </Button>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              Export
            </Button>
          </Group>
        }
      />

      {/* Filters */}
      <Paper withBorder p="md">
        <Grid align="flex-end">
          <Grid.Col span={3}>
            <DatePickerInput
              label="From Date"
              placeholder="Select start date"
              value={dateRange[0]}
              onChange={(date) => setDateRange([date as Date | null, dateRange[1]])}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <DatePickerInput
              label="To Date"
              placeholder="Select end date"
              value={dateRange[1]}
              onChange={(date) => setDateRange([dateRange[0], date as Date | null])}
            />
          </Grid.Col>
          <Grid.Col span={3}>
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
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Button leftSection={<IconSearch size={16} />} fullWidth>
              Generate Report
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Opening Balance</Text>
            <Text size="xl" fw={700} c="blue">
              <NumberFormatter value={totals.OpeningBalance} prefix="$ " thousandSeparator />
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Period Debit</Text>
            <Text size="xl" fw={700} c="green">
              <NumberFormatter value={totals.PeriodDebit} prefix="$ " thousandSeparator />
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Period Credit</Text>
            <Text size="xl" fw={700} c="orange">
              <NumberFormatter value={totals.PeriodCredit} prefix="$ " thousandSeparator />
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Closing Balance</Text>
            <Text size="xl" fw={700} c="teal">
              <NumberFormatter value={totals.ClosingBalance} prefix="$ " thousandSeparator />
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Data Table */}
      <Paper withBorder>
        <Box p="md" bg="gray.0">
          <Title order={5}>Account Summary Report</Title>
          <Text size="sm" c="dimmed">
            Period: {dateRange[0] ? format(dateRange[0], 'dd/MM/yyyy') : '-'} to {dateRange[1] ? format(dateRange[1], 'dd/MM/yyyy') : '-'}
          </Text>
        </Box>
        <Table withTableBorder striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Account Code</Table.Th>
              <Table.Th>Account Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Opening Balance</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Period Debit</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Period Credit</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Closing Balance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.map((item) => (
              <Table.Tr key={item.AccCode}>
                <Table.Td>{item.AccCode}</Table.Td>
                <Table.Td><Text fw={500}>{item.AccName}</Text></Table.Td>
                <Table.Td>
                  <Badge color={getAccTypeColor(item.AccType)}>
                    {item.AccType}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <NumberFormatter value={item.OpeningBalance} prefix="$ " thousandSeparator />
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <NumberFormatter value={item.PeriodDebit} prefix="$ " thousandSeparator />
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <NumberFormatter value={item.PeriodCredit} prefix="$ " thousandSeparator />
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={700}>
                    <NumberFormatter value={item.ClosingBalance} prefix="$ " thousandSeparator />
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
              <Table.Td colSpan={3}>
                <Text fw={700}>Total</Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>
                  <NumberFormatter value={totals.OpeningBalance} prefix="$ " thousandSeparator />
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>
                  <NumberFormatter value={totals.PeriodDebit} prefix="$ " thousandSeparator />
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>
                  <NumberFormatter value={totals.PeriodCredit} prefix="$ " thousandSeparator />
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: 'right' }}>
                <Text fw={700}>
                  <NumberFormatter value={totals.ClosingBalance} prefix="$ " thousandSeparator />
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      </Paper>
    </Stack>
  );
}
