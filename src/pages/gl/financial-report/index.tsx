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
  
  NumberFormatter,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconDownload, IconPrinter, IconReport } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format, startOfMonth, endOfMonth } from 'date-fns';

// Mock data for financial reports
interface FinancialReportItem {
  LineNo: number;
  Description: string;
  CurrentPeriod: number;
  YTD: number;
  LastYear: number;
  IsBold?: boolean;
  IsSubtotal?: boolean;
}

const incomeStatementData: FinancialReportItem[] = [
  { LineNo: 1, Description: 'REVENUE', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 2, Description: 'Sales Revenue', CurrentPeriod: 125000, YTD: 450000, LastYear: 380000 },
  { LineNo: 3, Description: 'Service Revenue', CurrentPeriod: 35000, YTD: 120000, LastYear: 95000 },
  { LineNo: 4, Description: 'Other Revenue', CurrentPeriod: 5000, YTD: 15000, LastYear: 12000 },
  { LineNo: 5, Description: 'Total Revenue', CurrentPeriod: 165000, YTD: 585000, LastYear: 487000, IsBold: true, IsSubtotal: true },
  { LineNo: 6, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 7, Description: 'COST OF SALES', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 8, Description: 'Cost of Goods Sold', CurrentPeriod: 60000, YTD: 220000, LastYear: 185000 },
  { LineNo: 9, Description: 'Direct Labor', CurrentPeriod: 25000, YTD: 90000, LastYear: 75000 },
  { LineNo: 10, Description: 'Total Cost of Sales', CurrentPeriod: 85000, YTD: 310000, LastYear: 260000, IsBold: true, IsSubtotal: true },
  { LineNo: 11, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 12, Description: 'GROSS PROFIT', CurrentPeriod: 80000, YTD: 275000, LastYear: 227000, IsBold: true, IsSubtotal: true },
  { LineNo: 13, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 14, Description: 'OPERATING EXPENSES', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 15, Description: 'Salaries and Benefits', CurrentPeriod: 35000, YTD: 130000, LastYear: 115000 },
  { LineNo: 16, Description: 'Rent Expense', CurrentPeriod: 12000, YTD: 48000, LastYear: 45000 },
  { LineNo: 17, Description: 'Utilities', CurrentPeriod: 5000, YTD: 20000, LastYear: 18500 },
  { LineNo: 18, Description: 'Marketing', CurrentPeriod: 8000, YTD: 30000, LastYear: 25000 },
  { LineNo: 19, Description: 'Depreciation', CurrentPeriod: 5000, YTD: 20000, LastYear: 18000 },
  { LineNo: 20, Description: 'Other Expenses', CurrentPeriod: 3000, YTD: 12000, LastYear: 10000 },
  { LineNo: 21, Description: 'Total Operating Expenses', CurrentPeriod: 68000, YTD: 260000, LastYear: 231500, IsBold: true, IsSubtotal: true },
  { LineNo: 22, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 23, Description: 'NET INCOME', CurrentPeriod: 12000, YTD: 15000, LastYear: -4500, IsBold: true, IsSubtotal: true },
];

const balanceSheetData: FinancialReportItem[] = [
  { LineNo: 1, Description: 'ASSETS', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 2, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 3, Description: 'Current Assets', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 4, Description: 'Cash and Cash Equivalents', CurrentPeriod: 125000, YTD: 125000, LastYear: 95000 },
  { LineNo: 5, Description: 'Accounts Receivable', CurrentPeriod: 90000, YTD: 90000, LastYear: 75000 },
  { LineNo: 6, Description: 'Inventory', CurrentPeriod: 75000, YTD: 75000, LastYear: 65000 },
  { LineNo: 7, Description: 'Prepaid Expenses', CurrentPeriod: 15000, YTD: 15000, LastYear: 12000 },
  { LineNo: 8, Description: 'Total Current Assets', CurrentPeriod: 305000, YTD: 305000, LastYear: 247000, IsBold: true, IsSubtotal: true },
  { LineNo: 9, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 10, Description: 'Non-Current Assets', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 11, Description: 'Property, Plant & Equipment', CurrentPeriod: 600000, YTD: 600000, LastYear: 500000 },
  { LineNo: 12, Description: 'Less: Accumulated Depreciation', CurrentPeriod: -120000, YTD: -120000, LastYear: -100000 },
  { LineNo: 13, Description: 'Net Fixed Assets', CurrentPeriod: 480000, YTD: 480000, LastYear: 400000, IsSubtotal: true },
  { LineNo: 14, Description: 'Intangible Assets', CurrentPeriod: 50000, YTD: 50000, LastYear: 45000 },
  { LineNo: 15, Description: 'Total Non-Current Assets', CurrentPeriod: 530000, YTD: 530000, LastYear: 445000, IsBold: true, IsSubtotal: true },
  { LineNo: 16, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 17, Description: 'TOTAL ASSETS', CurrentPeriod: 835000, YTD: 835000, LastYear: 692000, IsBold: true, IsSubtotal: true },
  { LineNo: 18, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 19, Description: 'LIABILITIES', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 20, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 21, Description: 'Current Liabilities', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 22, Description: 'Accounts Payable', CurrentPeriod: 65000, YTD: 65000, LastYear: 55000 },
  { LineNo: 23, Description: 'Accrued Expenses', CurrentPeriod: 30000, YTD: 30000, LastYear: 25000 },
  { LineNo: 24, Description: 'Short-term Debt', CurrentPeriod: 25000, YTD: 25000, LastYear: 30000 },
  { LineNo: 25, Description: 'Total Current Liabilities', CurrentPeriod: 120000, YTD: 120000, LastYear: 110000, IsBold: true, IsSubtotal: true },
  { LineNo: 26, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 27, Description: 'Non-Current Liabilities', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 28, Description: 'Long-term Debt', CurrentPeriod: 150000, YTD: 150000, LastYear: 180000 },
  { LineNo: 29, Description: 'Deferred Tax Liability', CurrentPeriod: 15000, YTD: 15000, LastYear: 12000 },
  { LineNo: 30, Description: 'Total Non-Current Liabilities', CurrentPeriod: 165000, YTD: 165000, LastYear: 192000, IsBold: true, IsSubtotal: true },
  { LineNo: 31, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 32, Description: 'TOTAL LIABILITIES', CurrentPeriod: 285000, YTD: 285000, LastYear: 302000, IsBold: true, IsSubtotal: true },
  { LineNo: 33, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 34, Description: 'EQUITY', CurrentPeriod: 0, YTD: 0, LastYear: 0, IsBold: true },
  { LineNo: 35, Description: 'Share Capital', CurrentPeriod: 400000, YTD: 400000, LastYear: 400000 },
  { LineNo: 36, Description: 'Retained Earnings', CurrentPeriod: 150000, YTD: 150000, LastYear: -10000 },
  { LineNo: 37, Description: 'TOTAL EQUITY', CurrentPeriod: 550000, YTD: 550000, LastYear: 390000, IsBold: true, IsSubtotal: true },
  { LineNo: 38, Description: '', CurrentPeriod: 0, YTD: 0, LastYear: 0 },
  { LineNo: 39, Description: 'TOTAL LIABILITIES & EQUITY', CurrentPeriod: 835000, YTD: 835000, LastYear: 692000, IsBold: true, IsSubtotal: true },
];

export default function FinancialReport() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);
  const [reportType, setReportType] = useState<'income' | 'balance' | 'cashflow'>('income');

  const reportData = useMemo(() => {
    switch (reportType) {
      case 'income':
        return incomeStatementData;
      case 'balance':
        return balanceSheetData;
      default:
        return incomeStatementData;
    }
  }, [reportType]);

  const reportTitle = useMemo(() => {
    switch (reportType) {
      case 'income':
        return 'Income Statement';
      case 'balance':
        return 'Balance Sheet';
      case 'cashflow':
        return 'Cash Flow Statement';
      default:
        return 'Financial Report';
    }
  }, [reportType]);

  return (
    <Stack gap="md">
      <PageHeader
        title="Financial Reports"
        subtitle="View and generate financial statements"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Financial Reports' },
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
            <Select
              label="Report Type"
              value={reportType}
              onChange={(val) => setReportType(val as typeof reportType)}
              data={[
                { value: 'income', label: 'Income Statement' },
                { value: 'balance', label: 'Balance Sheet' },
                { value: 'cashflow', label: 'Cash Flow Statement' },
              ]}
              leftSection={<IconReport size={16} />}
            />
          </Grid.Col>
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
            <Button leftSection={<IconSearch size={16} />} fullWidth>
              Generate Report
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Report Content */}
      <Paper withBorder>
        <Box p="md" bg="gray.0">
          <Group justify="space-between">
            <div>
              <Title order={4}>{reportTitle}</Title>
              <Text size="sm" c="dimmed">
                Period: {dateRange[0] ? format(dateRange[0], 'dd/MM/yyyy') : '-'} to {dateRange[1] ? format(dateRange[1], 'dd/MM/yyyy') : '-'}
              </Text>
            </div>
            <Group>
              <Text size="sm" c="dimmed">Currency: USD</Text>
            </Group>
          </Group>
        </Box>
        
        <Table withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Current Period</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Year to Date</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Last Year</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {reportData.map((item) => (
              <Table.Tr 
                key={item.LineNo}
                style={{
                  backgroundColor: item.IsSubtotal ? '#f8f9fa' : undefined,
                  borderTop: item.IsSubtotal ? '2px solid #dee2e6' : undefined,
                }}
              >
                <Table.Td>
                  <Text 
                    fw={item.IsBold ? 700 : item.IsSubtotal ? 600 : 400}
                    pl={item.IsBold && !item.IsSubtotal ? 0 : item.IsSubtotal ? 0 : 16}
                  >
                    {item.Description}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {item.CurrentPeriod !== 0 ? (
                    <Text fw={item.IsSubtotal ? 700 : 400}>
                      <NumberFormatter
                        value={item.CurrentPeriod}
                        prefix="$ "
                        thousandSeparator
                      />
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {item.YTD !== 0 ? (
                    <Text fw={item.IsSubtotal ? 700 : 400}>
                      <NumberFormatter 
                        value={item.YTD} 
                        prefix="$ " 
                        thousandSeparator 
                      />
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  {item.LastYear !== 0 ? (
                    <Text fw={item.IsSubtotal ? 700 : 400}>
                      <NumberFormatter 
                        value={item.LastYear} 
                        prefix="$ " 
                        thousandSeparator 
                      />
                    </Text>
                  ) : (
                    ''
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
