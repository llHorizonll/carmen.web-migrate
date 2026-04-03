import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Box,
  Button,
  Group,
  Text,
  Stack,
  Paper,
  Grid,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { DataTable } from '../../../components/ui/DataTable';
import { useArFolioList, useArFolioBalance } from '../../../hooks/useArProfile';
import type { ArFolio, ArFolioFilterParams } from '../../../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const PAGE_SIZE = 50;

export default function ArFolioList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileIdParam = searchParams.get('profileId');
  const profileId = profileIdParam ? parseInt(profileIdParam, 10) : 0;

  // Redirect to profile list if no profileId provided
  if (profileId === 0) {
    return (
      <Box p="md">
        <Stack gap="md" align="center" py="xl">
          <Text size="xl" fw={600}>AR Folio</Text>
          <Text c="dimmed">Please select a profile to view folio</Text>
          <Button onClick={() => navigate('/ar/profile')}>
            Go to AR Profiles
          </Button>
        </Stack>
      </Box>
    );
  }

  // Filter states
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  // Calculate filter params
  const filterParams: ArFolioFilterParams = useMemo(() => {
    const params: ArFolioFilterParams = {
      ProfileId: profileId,
    };

    if (dateRange[0]) {
      params.FromDate = format(dateRange[0], 'yyyy-MM-dd');
    }
    if (dateRange[1]) {
      params.ToDate = format(dateRange[1], 'yyyy-MM-dd');
    }

    return params;
  }, [profileId, dateRange]);

  // Fetch folio data and balance
  const { data: folioData, isLoading, error } = useArFolioList(filterParams);
  const { data: balanceData } = useArFolioBalance(profileId);

  // Handle error
  if (error) {
    notifications.show({
      title: 'Error',
      message: error.message || 'Failed to load AR folio',
      color: 'red',
    });
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'TransDate',
        header: 'Date',
        size: 100,
        cell: ({ row }: { row: { original: ArFolio } }) => {
          const date = row.original.TransDate;
          return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
        },
      },
      {
        accessorKey: 'TransType',
        header: 'Type',
        size: 80,
      },
      {
        accessorKey: 'TransNo',
        header: 'Document No.',
        size: 120,
      },
      {
        accessorKey: 'Description',
        header: 'Description',
        size: 300,
        cell: ({ row }: { row: { original: ArFolio } }) => (
          <Text truncate size="sm" style={{ maxWidth: 280 }}>
            {row.original.Description}
          </Text>
        ),
      },
      {
        accessorKey: 'Debit',
        header: 'Debit',
        size: 120,
        cell: ({ row }: { row: { original: ArFolio } }) => (
          <Text size="sm" ta="right">
            {row.original.Debit > 0
              ? row.original.Debit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '-'}
          </Text>
        ),
      },
      {
        accessorKey: 'Credit',
        header: 'Credit',
        size: 120,
        cell: ({ row }: { row: { original: ArFolio } }) => (
          <Text size="sm" ta="right">
            {row.original.Credit > 0
              ? row.original.Credit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '-'}
          </Text>
        ),
      },
      {
        accessorKey: 'Balance',
        header: 'Balance',
        size: 120,
        cell: ({ row }: { row: { original: ArFolio } }) => {
          const balance = row.original.Balance;
          return (
            <Text
              size="sm"
              ta="right"
              fw={500}
              c={balance > 0 ? 'red' : balance < 0 ? 'green' : 'dimmed'}
            >
              {balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          );
        },
      },
    ],
    []
  );

  const records = folioData || [];
  const totalRecords = records.length;

  // Calculate totals
  const totals = useMemo(() => {
    return records.reduce(
      (acc, item) => ({
        debit: acc.debit + (item.Debit || 0),
        credit: acc.credit + (item.Credit || 0),
      }),
      { debit: 0, credit: 0 }
    );
  }, [records]);

  return (
    <Box p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/ar/profile')}
            >
              Back
            </Button>
            <Text size="xl" fw={600}>
              AR Folio
            </Text>
          </Group>
        </Group>

        {/* Profile Info */}
        {balanceData && (
          <Paper p="md" withBorder>
            <Grid>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Profile Code</Text>
                <Text fw={500}>{balanceData.ProfileCode}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Profile Name</Text>
                <Text fw={500}>{balanceData.ProfileName}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Current Balance</Text>
                <Text
                  fw={600}
                  size="lg"
                  c={balanceData.Balance > 0 ? 'red' : balanceData.Balance < 0 ? 'green' : 'dimmed'}
                >
                  {balanceData.Balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </Grid.Col>
            </Grid>
          </Paper>
        )}

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
          emptyMessage="No folio transactions found"
        />

        {/* Totals */}
        {records.length > 0 && (
          <Paper p="md" withBorder>
            <Group justify="flex-end">
              <Stack gap={4} style={{ minWidth: 250 }}>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Total Debit:</Text>
                  <Text size="sm" fw={500}>
                    {totals.debit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Total Credit:</Text>
                  <Text size="sm" fw={500}>
                    {totals.credit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
