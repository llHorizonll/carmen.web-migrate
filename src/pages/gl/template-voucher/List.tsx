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
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconPlus, IconEye, IconEdit, IconCopy } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format } from 'date-fns';

// Mock data for template vouchers
interface TemplateVoucher {
  TemplateId: number;
  TemplateCode: string;
  TemplateName: string;
  Description: string;
  Category: string;
  IsActive: boolean;
  UserModified: string;
  DateModified?: string;
}

const mockData: TemplateVoucher[] = [
  {
    TemplateId: 1,
    TemplateCode: 'TEMP001',
    TemplateName: 'Standard Expense',
    Description: 'Standard template for expense vouchers',
    Category: 'Expense',
    IsActive: true,
    UserModified: 'admin',
    DateModified: '2024-04-15',
  },
  {
    TemplateId: 2,
    TemplateCode: 'TEMP002',
    TemplateName: 'Monthly Closing',
    Description: 'End of month closing entries',
    Category: 'Closing',
    IsActive: true,
    UserModified: 'admin',
    DateModified: '2024-04-10',
  },
  {
    TemplateId: 3,
    TemplateCode: 'TEMP003',
    TemplateName: 'Asset Purchase',
    Description: 'Template for fixed asset acquisition',
    Category: 'Asset',
    IsActive: false,
    UserModified: 'admin',
    DateModified: '2024-03-20',
  },
  {
    TemplateId: 4,
    TemplateCode: 'TEMP004',
    TemplateName: 'Revenue Recognition',
    Description: 'Standard revenue journal entries',
    Category: 'Revenue',
    IsActive: true,
    UserModified: 'admin',
    DateModified: '2024-04-18',
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function TemplateVoucherList() {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [category, setCategory] = useState<'All' | string>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.TemplateName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.TemplateCode.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.Description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || (status === 'Active' ? item.IsActive : !item.IsActive);
      const matchesCategory = category === 'All' || item.Category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [debouncedSearch, status, category]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'TemplateCode' as const,
        header: 'Template Code',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'TemplateName' as const,
        header: 'Template Name',
        cell: (info: { getValue: () => string }) => (
          <Text fw={500}>{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'Category' as const,
        header: 'Category',
        cell: (info: { getValue: () => string }) => (
          <Badge variant="light" color="blue">
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: 'Description' as const,
        header: 'Description',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'IsActive' as const,
        header: 'Status',
        cell: (info: { getValue: () => boolean }) => {
          const value = info.getValue();
          return (
            <Badge color={value ? 'green' : 'gray'}>
              {value ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'DateModified' as const,
        header: 'Last Modified',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          return value ? format(new Date(value), 'dd/MM/yyyy') : '-';
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: TemplateVoucher } }) => {
          const tv = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon
                  variant="light"
                  onClick={() => navigate(`/gl/template-voucher/${tv.TemplateId}`)}
                >
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => navigate(`/gl/template-voucher/${tv.TemplateId}/edit`)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Duplicate">
                <ActionIcon
                  variant="light"
                  color="green"
                  onClick={() => {
                    notifications.show({
                      title: 'Duplicated',
                      message: `Template ${tv.TemplateCode} duplicated`,
                      color: 'green',
                    });
                  }}
                >
                  <IconCopy size={16} />
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
        title="Template Vouchers"
        subtitle="Manage journal voucher templates"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Template Vouchers' },
        ]}
        actions={
          <Button 
            leftSection={<IconPlus size={16} />} 
            onClick={() => navigate('/gl/template-voucher/new')}
          >
            Create Template
          </Button>
        }
      />

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search templates..."
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
              label="Category"
              value={category}
              onChange={(val) => setCategory(val || 'All')}
              data={['All', 'Expense', 'Revenue', 'Asset', 'Closing', 'Other']}
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
