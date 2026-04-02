import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Group,
  Text,
  Stack,
  ActionIcon,
  Tooltip,
  Select,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconPlus, IconEye, IconEdit } from '@tabler/icons-react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useArReceiptList } from '../../../hooks/useArReceipt';
import type { ArReceipt, ArReceiptFilterParams } from '../../../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const PAGE_SIZE = 50;

export default function ArReceiptList() {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Draft' | 'Normal' | 'Void'>('Normal');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  // Calculate filter params
  const filterParams: ArReceiptFilterParams = useMemo(() => {
    const params: ArReceiptFilterParams = {
      Limit: PAGE_SIZE,
      Page: page + 1,
      OrderBy: 'RcptDate desc',
    };

    // Build WhereGroupList
    const whereGroupList = [];

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      whereGroupList.push({
        AndOr: 'And' as const,
        ConditionList: [
          {
            AndOr: 'And' as const,
            Field: 'RcptDate',
            Operator: '>=',
            Value: format(dateRange[0], 'yyyy-MM-dd'),
          },
          {
            AndOr: 'And' as const,
            Field: 'RcptDate',
            Operator: '<=',
            Value: format(dateRange[1], 'yyyy-MM-dd'),
          },
        ],
      });
    }

    // Status filter
    if (status !== 'All') {
      const statusValue = status === 'Normal' ? '1' : status === 'Void' ? '9' : '0';
      if (whereGroupList.length > 0) {
        whereGroupList[0].ConditionList.push({
          AndOr: 'And' as const,
          Field: 'Status',
          Operator: '=',
          Value: statusValue,
        });
      }
    }

    // Search filter
    if (debouncedSearch) {
      params.WhereLike = `%${debouncedSearch}%`;
      params.WhereLikeFields = 'RcptNo,ProfileName,Description';
    }

    if (whereGroupList.length > 0) {
      params.WhereGroupList = whereGroupList;
    }

    params.Exclude = ['Detail'];

    return params;
  }, [page, status, dateRange, debouncedSearch]);

  // Fetch data
  const { data, isLoading, error } = useArReceiptList(filterParams);

  // Handle error
  if (error) {
    notifications.show({
      title: 'Error',
      message: error.message || 'Failed to load AR receipts',
      color: 'red',
    });
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: '',
        size: 80,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <Group gap={4}>
            <Tooltip label="View">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => navigate(`/ar/receipt/${row.original.ArRcptSeq}`)}
              >
                <IconEye size={18} />
              </ActionIcon>
            </Tooltip>
            {row.original.Status !== 'Void' && (
              <Tooltip label="Edit">
                <ActionIcon
                  variant="subtle"
                  color="green"
                  onClick={() => navigate(`/ar/receipt/${row.original.ArRcptSeq}/edit`)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        ),
      },
      {
        accessorKey: 'RcptDate',
        header: 'Date',
        size: 100,
        cell: ({ row }: { row: { original: ArReceipt } }) => {
          const date = row.original.RcptDate;
          return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
        },
      },
      {
        accessorKey: 'RcptNo',
        header: 'Receipt No.',
        size: 120,
      },
      {
        accessorKey: 'ProfileName',
        header: 'Customer',
        size: 200,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <Tooltip label={row.original.ProfileName} position="top" withArrow>
            <Text truncate size="sm" style={{ maxWidth: 180 }}>
              {row.original.ProfileName}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'Description',
        header: 'Description',
        size: 250,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <Tooltip label={row.original.Description} position="top" withArrow>
            <Text truncate size="sm" style={{ maxWidth: 230 }}>
              {row.original.Description}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'CurCode',
        header: 'Currency',
        size: 80,
      },
      {
        accessorKey: 'RcptAmount',
        header: 'Amount',
        size: 120,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <Text size="sm" ta="right">
            {row.original.RcptAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        ),
      },
      {
        accessorKey: 'RcptAmountBase',
        header: 'Base Amount',
        size: 120,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <Text size="sm" ta="right">
            {row.original.RcptAmountBase.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        ),
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        size: 90,
        cell: ({ row }: { row: { original: ArReceipt } }) => (
          <StatusBadge status={row.original.Status} />
        ),
      },
    ],
    [navigate]
  );

  const records = data?.Data || [];
  const totalRecords = data?.Total || 0;

  return (
    <Box p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Text size="xl" fw={600}>
            AR Receipt
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate('/ar/receipt/create')}
          >
            Create
          </Button>
        </Group>

        {/* Filters */}
        <Group gap="sm" align="flex-end">
          <DatePickerInput
            label="From Date"
            value={dateRange[0]}
            onChange={(value) => {
              setDateRange([value as Date | null, dateRange[1]]);
              setPage(0);
            }}
            style={{ width: 140 }}
          />
          <DatePickerInput
            label="To Date"
            value={dateRange[1]}
            onChange={(value) => {
              setDateRange([dateRange[0], value as Date | null]);
              setPage(0);
            }}
            minDate={dateRange[0] || undefined}
            style={{ width: 140 }}
          />

          <Select
            label="Status"
            value={status}
            onChange={(value) => {
              setStatus((value as typeof status) || 'Normal');
              setPage(0);
            }}
            data={[
              { value: 'All', label: 'All' },
              { value: 'Draft', label: 'Draft' },
              { value: 'Normal', label: 'Normal' },
              { value: 'Void', label: 'Void' },
            ]}
            style={{ width: 120 }}
          />

          <TextInput
            label="Search"
            placeholder="Search receipt, customer..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(0);
            }}
            style={{ width: 250 }}
          />
        </Group>

        {/* Data Table */}
        <DataTable
          data={records}
          columns={columns}
          loading={isLoading}
          totalRows={totalRecords}
          pagination={{
            pageIndex: page,
            pageSize: PAGE_SIZE,
            onPageChange: setPage,
          }}
          emptyMessage="No AR receipts found"
        />
      </Stack>
    </Box>
  );
}
