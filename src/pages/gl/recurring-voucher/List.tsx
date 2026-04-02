import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Group,
  Badge,
  Select,
  TextInput,
  Stack,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEye, IconEdit } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format } from 'date-fns';

// Mock data for recurring vouchers
interface RecurringVoucher {
  RecurringId: number;
  Prefix: string;
  RecurringNo: string;
  Description: string;
  RecurringType: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  StartDate: string;
  EndDate?: string;
  NextRunDate: string;
  Status: 'Active' | 'Inactive';
  LastRunDate?: string;
  UserModified: string;
}

const mockData: RecurringVoucher[] = [
  {
    RecurringId: 1,
    Prefix: 'RC',
    RecurringNo: 'RC001',
    Description: 'Monthly Rent Expense',
    RecurringType: 'Monthly',
    StartDate: '2024-01-01',
    EndDate: '2024-12-31',
    NextRunDate: '2024-05-01',
    Status: 'Active',
    LastRunDate: '2024-04-01',
    UserModified: 'admin',
  },
  {
    RecurringId: 2,
    Prefix: 'RC',
    RecurringNo: 'RC002',
    Description: 'Weekly Payroll',
    RecurringType: 'Weekly',
    StartDate: '2024-01-01',
    NextRunDate: '2024-05-06',
    Status: 'Active',
    LastRunDate: '2024-04-29',
    UserModified: 'admin',
  },
  {
    RecurringId: 3,
    Prefix: 'RC',
    RecurringNo: 'RC003',
    Description: 'Quarterly Insurance',
    RecurringType: 'Monthly',
    StartDate: '2024-01-01',
    NextRunDate: '2024-07-01',
    Status: 'Inactive',
    UserModified: 'admin',
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function RecurringVoucherList() {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [recurringType, setRecurringType] = useState<'All' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.Description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.RecurringNo.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || item.Status === status;
      const matchesType = recurringType === 'All' || item.RecurringType === recurringType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [debouncedSearch, status, recurringType]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'RecurringNo' as const,
        header: 'Recurring No.',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'Description' as const,
        header: 'Description',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'RecurringType' as const,
        header: 'Type',
        cell: (info: { getValue: () => string }) => (
          <Badge variant="light" color="blue">
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: 'NextRunDate' as const,
        header: 'Next Run',
        cell: (info: { getValue: () => string }) => format(new Date(info.getValue()), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'Status' as const,
        header: 'Status',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          return (
            <Badge color={value === 'Active' ? 'green' : 'gray'}>
              {value}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'UserModified' as const,
        header: 'Modified By',
        cell: (info: { getValue: () => string }) => info.getValue() || '-',
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: RecurringVoucher } }) => {
          const rv = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon
                  variant="light"
                  onClick={() => navigate(`/gl/recurring-voucher/${rv.RecurringId}`)}
                >
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => navigate(`/gl/recurring-voucher/${rv.RecurringId}/edit`)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ],
    [navigate]
  );

  return (
    <Stack gap="md">
      <PageHeader
        title="Recurring Vouchers"
        subtitle="Manage recurring journal vouchers"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Recurring Vouchers' },
        ]}
        actions={
          <Button 
            leftSection={<IconPlus size={16} />} 
            onClick={() => navigate('/gl/recurring-voucher/new')}
          >
            Create Recurring
          </Button>
        }
      />

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search recurring vouchers..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val as typeof status)}
              data={['All', 'Active', 'Inactive']}
              clearable
            />
            <Select
              label="Type"
              value={recurringType}
              onChange={(val) => setRecurringType(val as typeof recurringType)}
              data={['All', 'Daily', 'Weekly', 'Monthly', 'Yearly']}
              clearable
            />
          </Group>
        </Stack>
      </Box>

      {/* Table */}
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
