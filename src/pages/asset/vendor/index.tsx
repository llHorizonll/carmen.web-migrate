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
import { IconSearch, IconPlus, IconEye, IconEdit, IconMail, IconPhone } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';

// Mock data for asset vendors
interface AssetVendor {
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  ContactPerson: string;
  Phone: string;
  Email: string;
  Address: string;
  TaxId: string;
  PaymentTerms: string;
  CurCode: string;
  IsActive: boolean;
  TotalAssetsPurchased: number;
  TotalAmount: number;
}

const mockData: AssetVendor[] = [
  {
    VendorId: 1,
    VendorCode: 'VEN001',
    VendorName: 'Dell Thailand',
    ContactPerson: 'Somchai Dell',
    Phone: '02-123-4567',
    Email: 'sales@dell.co.th',
    Address: '123 Sukhumvit Road, Bangkok 10110',
    TaxId: '0105551001234',
    PaymentTerms: 'Net 30',
    CurCode: 'THB',
    IsActive: true,
    TotalAssetsPurchased: 15,
    TotalAmount: 850000,
  },
  {
    VendorId: 2,
    VendorCode: 'VEN002',
    VendorName: 'HP Thailand',
    ContactPerson: 'Suthida HP',
    Phone: '02-234-5678',
    Email: 'sales@hp.co.th',
    Address: '456 Silom Road, Bangkok 10500',
    TaxId: '0105552005678',
    PaymentTerms: 'Net 30',
    CurCode: 'THB',
    IsActive: true,
    TotalAssetsPurchased: 8,
    TotalAmount: 320000,
  },
  {
    VendorId: 3,
    VendorCode: 'VEN003',
    VendorName: 'IKEA Thailand',
    ContactPerson: 'Pramote IKEA',
    Phone: '02-345-6789',
    Email: 'b2b@ikea.co.th',
    Address: '789 Bangna-Trad Road, Bangkok 10260',
    TaxId: '0105553009012',
    PaymentTerms: 'Net 15',
    CurCode: 'THB',
    IsActive: true,
    TotalAssetsPurchased: 25,
    TotalAmount: 450000,
  },
  {
    VendorId: 4,
    VendorCode: 'VEN004',
    VendorName: 'Carrier Thailand',
    ContactPerson: 'Wanna Carrier',
    Phone: '02-456-7890',
    Email: 'sales@carrier.co.th',
    Address: '321 Ratchada Road, Bangkok 10310',
    TaxId: '0105554003456',
    PaymentTerms: 'Net 45',
    CurCode: 'THB',
    IsActive: false,
    TotalAssetsPurchased: 5,
    TotalAmount: 180000,
  },
  {
    VendorId: 5,
    VendorCode: 'VEN005',
    VendorName: 'Toyota Leasing',
    ContactPerson: 'Manop Toyota',
    Phone: '02-567-8901',
    Email: 'fleet@toyota.co.th',
    Address: '654 Rama 9 Road, Bangkok 10320',
    TaxId: '0105555007890',
    PaymentTerms: 'Net 60',
    CurCode: 'THB',
    IsActive: true,
    TotalAssetsPurchased: 3,
    TotalAmount: 3500000,
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function AssetVendor() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.VendorName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.VendorCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.ContactPerson.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || (status === 'Active' ? item.IsActive : !item.IsActive);
      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, status]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'VendorCode' as const,
        header: 'Vendor Code',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'VendorName' as const,
        header: 'Vendor Name',
        cell: (info: { getValue: () => string }) => (
          <Text fw={500}>{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'ContactPerson' as const,
        header: 'Contact Person',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'Phone' as const,
        header: 'Contact',
        cell: (info: { getValue: () => string; row: { original: AssetVendor } }) => {
          const item = info.row.original;
          return (
            <Stack gap={0}>
              <Text size="sm"><IconPhone size={12} /> {item.Phone}</Text>
              <Text size="xs" c="dimmed"><IconMail size={12} /> {item.Email}</Text>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'PaymentTerms' as const,
        header: 'Payment Terms',
        cell: (info: { getValue: () => string }) => (
          <Badge variant="light" color="blue">{info.getValue()}</Badge>
        ),
      },
      {
        accessorKey: 'TotalAssetsPurchased' as const,
        header: 'Assets',
        cell: (info: { getValue: () => number }) => (
          <Text ta="center">{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'TotalAmount' as const,
        header: 'Total Amount',
        cell: (info: { getValue: () => number; row: { original: AssetVendor } }) => {
          const value = info.getValue();
          const item = info.row.original;
          return (
            <Text fw={500}>{value.toLocaleString()} {item.CurCode}</Text>
          );
        },
      },
      {
        accessorKey: 'IsActive' as const,
        header: 'Status',
        cell: (info: { getValue: () => boolean }) => {
          const value = info.getValue();
          return (
            <Badge color={value ? 'green' : 'red'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: AssetVendor } }) => {
          const vendor = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View Details">
                <ActionIcon variant="light">
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit">
                <ActionIcon variant="light" color="blue">
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Email">
                <ActionIcon 
                  variant="light" 
                  color="teal"
                  component="a"
                  href={`mailto:${vendor.Email}`}
                >
                  <IconMail size={16} />
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
        title="Asset Vendors"
        subtitle="Manage vendors for asset purchases"
        breadcrumbs={[
          { label: 'Asset', href: '/asset' },
          { label: 'Vendors' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            Add Vendor
          </Button>
        }
      />

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Vendors</Text>
            <Text size="xl" fw={700}>{mockData.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Active Vendors</Text>
            <Text size="xl" fw={700} c="green">{mockData.filter(v => v.IsActive).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Assets</Text>
            <Text size="xl" fw={700} c="blue">{mockData.reduce((sum, v) => sum + v.TotalAssetsPurchased, 0)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Purchases</Text>
            <Text size="xl" fw={700} c="teal">
              {(mockData.reduce((sum, v) => sum + v.TotalAmount, 0) / 1000000).toFixed(2)}M THB
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search vendors..."
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
