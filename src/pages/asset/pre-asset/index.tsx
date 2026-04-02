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
import { IconSearch, IconPlus, IconEye, IconCheck, IconX } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format } from 'date-fns';

// Mock data for pre-asset
interface PreAsset {
  PreAssetId: number;
  PreAssetCode: string;
  AssetName: string;
  Description: string;
  CategoryId: number;
  CategoryName: string;
  DepartmentId: number;
  DepartmentName: string;
  VendorId?: number;
  VendorName?: string;
  PurchaseDate: string;
  PurchasePrice: number;
  CurCode: string;
  Status: 'Pending' | 'Approved' | 'Rejected' | 'Converted';
  RequestedBy: string;
  RequestDate: string;
  ApprovedBy?: string;
  ApprovedDate?: string;
}

const mockData: PreAsset[] = [
  {
    PreAssetId: 1,
    PreAssetCode: 'PRE001',
    AssetName: 'Dell Laptop XPS 15',
    Description: 'Development laptop for new developer',
    CategoryId: 1,
    CategoryName: 'IT Equipment',
    DepartmentId: 1,
    DepartmentName: 'IT Department',
    VendorId: 1,
    VendorName: 'Dell Thailand',
    PurchaseDate: '2024-04-15',
    PurchasePrice: 65000,
    CurCode: 'THB',
    Status: 'Approved',
    RequestedBy: 'John Doe',
    RequestDate: '2024-04-10',
    ApprovedBy: 'Jane Smith',
    ApprovedDate: '2024-04-12',
  },
  {
    PreAssetId: 2,
    PreAssetCode: 'PRE002',
    AssetName: 'HP LaserJet Printer',
    Description: 'Network printer for accounting department',
    CategoryId: 1,
    CategoryName: 'IT Equipment',
    DepartmentId: 2,
    DepartmentName: 'Accounting',
    VendorId: 2,
    VendorName: 'HP Thailand',
    PurchaseDate: '2024-04-20',
    PurchasePrice: 25000,
    CurCode: 'THB',
    Status: 'Pending',
    RequestedBy: 'Alice Brown',
    RequestDate: '2024-04-18',
  },
  {
    PreAssetId: 3,
    PreAssetCode: 'PRE003',
    AssetName: 'Conference Room Furniture Set',
    Description: 'Table and chairs for main conference room',
    CategoryId: 2,
    CategoryName: 'Furniture',
    DepartmentId: 3,
    DepartmentName: 'Administration',
    VendorId: 3,
    VendorName: 'IKEA Thailand',
    PurchaseDate: '2024-05-01',
    PurchasePrice: 45000,
    CurCode: 'THB',
    Status: 'Rejected',
    RequestedBy: 'Bob Wilson',
    RequestDate: '2024-04-15',
    ApprovedBy: 'Jane Smith',
    ApprovedDate: '2024-04-16',
  },
  {
    PreAssetId: 4,
    PreAssetCode: 'PRE004',
    AssetName: 'Air Conditioner 24000 BTU',
    Description: 'New AC unit for server room',
    CategoryId: 3,
    CategoryName: 'Building Equipment',
    DepartmentId: 1,
    DepartmentName: 'IT Department',
    VendorId: 4,
    VendorName: 'Carrier Thailand',
    PurchaseDate: '2024-05-15',
    PurchasePrice: 35000,
    CurCode: 'THB',
    Status: 'Converted',
    RequestedBy: 'John Doe',
    RequestDate: '2024-04-20',
    ApprovedBy: 'Jane Smith',
    ApprovedDate: '2024-04-22',
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function AssetPreAsset() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Converted'>('All');
  const [category, setCategory] = useState<'All' | string>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.AssetName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.PreAssetCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.Description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || item.Status === status;
      const matchesCategory = category === 'All' || item.CategoryName === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [debouncedSearch, status, category]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'yellow';
      case 'Approved': return 'blue';
      case 'Rejected': return 'red';
      case 'Converted': return 'green';
      default: return 'gray';
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'PreAssetCode' as const,
        header: 'Pre-Asset Code',
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
        accessorKey: 'Description' as const,
        header: 'Description',
        cell: (info: { getValue: () => string }) => (
          <Text size="sm" c="dimmed" lineClamp={1}>{info.getValue()}</Text>
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
        accessorKey: 'PurchasePrice' as const,
        header: 'Price',
        cell: (info: { getValue: () => number; row: { original: PreAsset } }) => {
          const value = info.getValue();
          const item = info.row.original;
          return <Text>{value.toLocaleString()} {item.CurCode}</Text>;
        },
      },
      {
        accessorKey: 'PurchaseDate' as const,
        header: 'Purchase Date',
        cell: (info: { getValue: () => string }) => format(new Date(info.getValue()), 'dd/MM/yyyy'),
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
        accessorKey: 'RequestedBy' as const,
        header: 'Requested By',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: PreAsset } }) => {
          const item = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon variant="light">
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              {item.Status === 'Pending' && (
                <>
                  <Tooltip label="Approve">
                    <ActionIcon variant="light" color="green">
                      <IconCheck size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Reject">
                    <ActionIcon variant="light" color="red">
                      <IconX size={16} />
                    </ActionIcon>
                  </Tooltip>
                </>
              )}
              {item.Status === 'Approved' && (
                <Tooltip label="Convert to Asset">
                  <ActionIcon variant="light" color="teal">
                    <IconCheck size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
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
        title="Pre-Asset Management"
        subtitle="Manage asset acquisition requests before registration"
        breadcrumbs={[
          { label: 'Asset', href: '/asset' },
          { label: 'Pre-Asset' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            New Pre-Asset Request
          </Button>
        }
      />

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Requests</Text>
            <Text size="xl" fw={700}>{mockData.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Pending</Text>
            <Text size="xl" fw={700} c="yellow">{mockData.filter(a => a.Status === 'Pending').length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Approved</Text>
            <Text size="xl" fw={700} c="blue">{mockData.filter(a => a.Status === 'Approved').length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Converted</Text>
            <Text size="xl" fw={700} c="green">{mockData.filter(a => a.Status === 'Converted').length}</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search pre-assets..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val as typeof status)}
              data={['All', 'Pending', 'Approved', 'Rejected', 'Converted']}
              clearable
            />
            <Select
              label="Category"
              value={category}
              onChange={(val) => setCategory(val || 'All')}
              data={['All', 'IT Equipment', 'Furniture', 'Building Equipment', 'Vehicle']}
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

