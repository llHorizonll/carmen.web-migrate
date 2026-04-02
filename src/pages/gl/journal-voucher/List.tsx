import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Group,
  Text,
  Badge,
  Select,
  TextInput,
  Stack,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEye } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { useJvList } from '../../../hooks/useJournalVoucher';
import type { JournalVoucher, JvFilterParams } from '../../../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function JournalVoucherList() {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [mode, setMode] = useState<'Open Period' | 'Period Date' | 'All'>('Open Period');
  const [status, setStatus] = useState<'All' | 'Normal' | 'Void'>('Normal');
  const [prefix, setPrefix] = useState('All');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  // Build filter params
  const filterParams: JvFilterParams = useMemo(() => {
    const base: JvFilterParams = {
      Page: page,
      Limit: pageSize,
      WhereLike: debouncedSearch,
      Status: status === 'All' ? undefined : status,
    };

    if (mode === 'Period Date' && dateRange[0] && dateRange[1]) {
      return {
        ...base,
        FromDate: format(dateRange[0], 'yyyy-MM-dd'),
        ToDate: format(dateRange[1], 'yyyy-MM-dd'),
      };
    }

    return base;
  }, [page, pageSize, debouncedSearch, status, mode, dateRange]);

  // Fetch data
  const { data, isLoading } = useJvList(filterParams);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'JvhNo' as const,
        header: 'JV No.',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'JvhDate' as const,
        header: 'Date',
        cell: (info: { getValue: () => string }) => format(new Date(info.getValue()), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'Prefix' as const,
        header: 'Prefix',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'Description' as const,
        header: 'Description',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'Status' as const,
        header: 'Status',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          return (
            <Badge color={value === 'Normal' ? 'green' : value === 'Void' ? 'red' : 'gray'}>
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
        cell: ({ row }: { row: { original: JournalVoucher } }) => {
          const jv = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon
                  variant="light"
                  onClick={() => navigate(`/gl/journal-voucher/${jv.JvhSeq}`)}
                >
                  <IconEye size={16} />
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
      {/* Header */}
      <Group justify="space-between" align="center">
        <Text fw={700} size="xl">
          Journal Vouchers
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/gl/journal-voucher/create')}>
          Create JV
        </Button>
      </Group>

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={mode}
              onChange={(val) => setMode(val as typeof mode)}
              data={['Open Period', 'Period Date', 'All']}
            />
            {mode === 'Period Date' && (
              <>
                <DatePickerInput
                  value={dateRange[0]}
                  onChange={(date) => setDateRange([date as Date | null, dateRange[1]])}
                  placeholder="Start Date"
                />
                <DatePickerInput
                  value={dateRange[1]}
                  onChange={(date) => setDateRange([dateRange[0], date as Date | null])}
                  placeholder="End Date"
                />
              </>
            )}
          </Group>
          <Group>
            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val as typeof status)}
              data={['All', 'Normal', 'Void']}
            />
            <Select
              label="Prefix"
              value={prefix}
              onChange={(val) => setPrefix(val || 'All')}
              data={['All', 'JV', 'AD', 'AJ']}
            />
          </Group>
        </Stack>
      </Box>

      {/* Table */}
      <DataTable
        data={data?.Data || []}
        columns={columns}
        isLoading={isLoading}
        totalRecords={data?.Total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </Stack>
  );
}
