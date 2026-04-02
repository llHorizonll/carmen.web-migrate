import { useState, useMemo } from 'react';
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
  Paper,
  Grid,
  
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEye, IconEdit, IconFileInvoice } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format } from 'date-fns';

// Mock data for asset disposal
interface AssetDisposalItem {
  DisposalId: number;
  DisposalNo: string;
  AssetId: number;
  AssetCode: string;
  AssetName: string;
  CategoryName: string;
  OriginalCost: number;
  AccumulatedDepreciation: number;
  NetBookValue: number;
  DisposalDate: string;
  DisposalType: 'Sale' | 'Scrap' | 'Donation' | 'Transfer';
  SaleProceeds: number;
  GainLoss: number;
  DisposedTo?: string;
  Notes?: string;
  Status: 'Draft' | 'Posted' | 'Cancelled';
  UserModified: string;
}

const mockData: AssetDisposalItem[] = [
  {
    DisposalId: 1,
    DisposalNo: 'DSP001',
    AssetId: 1,
    AssetCode: 'AST001',
    AssetName: 'Dell Laptop Inspiron 15',
    CategoryName: 'IT Equipment',
    OriginalCost: 45000,
    AccumulatedDepreciation: 36000,
    NetBookValue: 9000,
    DisposalDate: '2024-04-15',
    DisposalType: 'Sale',
    SaleProceeds: 12000,
    GainLoss: 3000,
    DisposedTo: 'Second Hand Shop',
    Notes: 'Upgraded to new model',
    Status: 'Posted',
    UserModified: 'admin',
  },
  {
    DisposalId: 2,
    DisposalNo: 'DSP002',
    AssetId: 2,
    AssetCode: 'AST002',
    AssetName: 'HP Printer LaserJet',
    CategoryName: 'IT Equipment',
    OriginalCost: 18000,
    AccumulatedDepreciation: 18000,
    NetBookValue: 0,
    DisposalDate: '2024-04-20',
    DisposalType: 'Scrap',
    SaleProceeds: 0,
    GainLoss: 0,
    Notes: 'Broken beyond repair',
    Status: 'Posted',
    UserModified: 'admin',
  },
  {
    DisposalId: 3,
    DisposalNo: 'DSP003',
    AssetId: 3,
    AssetCode: 'AST003',
    AssetName: 'Office Chair Set',
    CategoryName: 'Furniture',
    OriginalCost: 25000,
    AccumulatedDepreciation: 15000,
    NetBookValue: 10000,
    DisposalDate: '2024-05-01',
    DisposalType: 'Donation',
    SaleProceeds: 0,
    GainLoss: -10000,
    DisposedTo: 'Local Charity',
    Notes: 'Donated to charity',
    Status: 'Draft',
    UserModified: 'admin',
  },
  {
    DisposalId: 4,
    DisposalNo: 'DSP004',
    AssetId: 4,
    AssetCode: 'AST004',
    AssetName: 'Toyota Camry 2019',
    CategoryName: 'Vehicle',
    OriginalCost: 1200000,
    AccumulatedDepreciation: 400000,
    NetBookValue: 800000,
    DisposalDate: '2024-05-15',
    DisposalType: 'Sale',
    SaleProceeds: 850000,
    GainLoss: 50000,
    DisposedTo: 'Used Car Dealer',
    Notes: 'Sold to upgrade fleet',
    Status: 'Posted',
    UserModified: 'admin',
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function AssetDisposal() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Draft' | 'Posted' | 'Cancelled'>('All');
  const [disposalType, setDisposalType] = useState<'All' | 'Sale' | 'Scrap' | 'Donation' | 'Transfer'>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.AssetName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.DisposalNo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.AssetCode.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || item.Status === status;
      const matchesType = disposalType === 'All' || item.DisposalType === disposalType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [debouncedSearch, status, disposalType]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'yellow';
      case 'Posted': return 'green';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sale': return 'blue';
      case 'Scrap': return 'gray';
      case 'Donation': return 'teal';
      case 'Transfer': return 'orange';
      default: return 'gray';
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'DisposalNo' as const,
        header: 'Disposal No.',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'DisposalDate' as const,
        header: 'Date',
        cell: (info: { getValue: () => string }) => format(new Date(info.getValue()), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'AssetCode' as const,
        header: 'Asset Code',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'AssetName' as const,
        header: 'Asset Name',
        cell: (info: { getValue: () => string }) => (
          <Text fw={500}>{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'CategoryName' as const,
        header: 'Category',
        cell: (info: { getValue: () => string }) => (
          <Badge variant="light">{info.getValue()}</Badge>
        ),
      },
      {
        accessorKey: 'DisposalType' as const,
        header: 'Type',
        cell: (info: { getValue: () => string }) => (
          <Badge color={getTypeColor(info.getValue())}>
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: 'NetBookValue' as const,
        header: 'Net Book Value',
        cell: (info: { getValue: () => number }) => (
          <Text>{info.getValue().toLocaleString()}</Text>
        ),
      },
      {
        accessorKey: 'SaleProceeds' as const,
        header: 'Proceeds',
        cell: (info: { getValue: () => number }) => (
          <Text>{info.getValue().toLocaleString()}</Text>
        ),
      },
      {
        accessorKey: 'GainLoss' as const,
        header: 'Gain/Loss',
        cell: (info: { getValue: () => number }) => {
          const value = info.getValue();
          return (
            <Text c={value >= 0 ? 'green' : 'red'} fw={600}>
              {value >= 0 ? '+' : ''}{value.toLocaleString()}
            </Text>
          );
        },
      },
      {
        accessorKey: 'Status' as const,
        header: 'Status',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          return (
            <Badge color={getStatusColor(value)}>
              {value}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: AssetDisposalItem } }) => {
          const item = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon variant="light">
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              {item.Status === 'Draft' && (
                <>
                  <Tooltip label="Edit">
                    <ActionIcon variant="light" color="blue">
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Post">
                    <ActionIcon variant="light" color="green">
                      <IconFileInvoice size={16} />
                    </ActionIcon>
                  </Tooltip>
                </>
              )}
            </Group>
          );
        },
      },
    ],
    []
  );

  // Calculate totals
  const totalProceeds = filteredData.reduce((sum, item) => sum + item.SaleProceeds, 0);
  const totalGainLoss = filteredData.reduce((sum, item) => sum + item.GainLoss, 0);

  return (
    <Stack gap="md">
      <PageHeader
        title="Asset Disposal"
        subtitle="Manage asset disposals, sales, and write-offs"
        breadcrumbs={[
          { label: 'Asset', href: '/asset' },
          { label: 'Disposal' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            New Disposal
          </Button>
        }
      />

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Disposals</Text>
            <Text size="xl" fw={700}>{mockData.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Posted</Text>
            <Text size="xl" fw={700} c="green">{mockData.filter(a => a.Status === 'Posted').length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Proceeds</Text>
            <Text size="xl" fw={700} c="blue">{totalProceeds.toLocaleString()}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Gain/Loss</Text>
            <Text size="xl" fw={700} c={totalGainLoss >= 0 ? 'teal' : 'red'}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toLocaleString()}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search disposals..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val as typeof status)}
              data={['All', 'Draft', 'Posted', 'Cancelled']}
              clearable
            />
            <Select
              label="Disposal Type"
              value={disposalType}
              onChange={(val) => setDisposalType(val as typeof disposalType)}
              data={['All', 'Sale', 'Scrap', 'Donation', 'Transfer']}
              clearable
            />
          </Group>
        </Stack>
      </Box>

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
