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
  
  Avatar,
  
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEye, IconEdit, IconTrash, IconLock } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';
import { format } from 'date-fns';

// Mock data for users
interface User {
  UserId: number;
  UserName: string;
  FullName: string;
  Email: string;
  Department: string;
  Role: string;
  IsActive: boolean;
  LastLogin?: string;
  CreatedAt: string;
  Phone?: string;
  DefaultLanguage: string;
}

const mockData: User[] = [
  {
    UserId: 1,
    UserName: 'admin',
    FullName: 'System Administrator',
    Email: 'admin@carmen.co.th',
    Department: 'IT',
    Role: 'Administrator',
    IsActive: true,
    LastLogin: '2024-04-20T09:30:00',
    CreatedAt: '2024-01-01',
    Phone: '081-123-4567',
    DefaultLanguage: 'en-US',
  },
  {
    UserId: 2,
    UserName: 'johndoe',
    FullName: 'John Doe',
    Email: 'john.doe@carmen.co.th',
    Department: 'Accounting',
    Role: 'Accountant',
    IsActive: true,
    LastLogin: '2024-04-19T16:45:00',
    CreatedAt: '2024-01-15',
    Phone: '082-234-5678',
    DefaultLanguage: 'en-US',
  },
  {
    UserId: 3,
    UserName: 'janesmith',
    FullName: 'Jane Smith',
    Email: 'jane.smith@carmen.co.th',
    Department: 'Finance',
    Role: 'Manager',
    IsActive: true,
    LastLogin: '2024-04-20T08:15:00',
    CreatedAt: '2024-01-20',
    Phone: '083-345-6789',
    DefaultLanguage: 'th-TH',
  },
  {
    UserId: 4,
    UserName: 'aliceb',
    FullName: 'Alice Brown',
    Email: 'alice.brown@carmen.co.th',
    Department: 'HR',
    Role: 'User',
    IsActive: false,
    CreatedAt: '2024-02-01',
    DefaultLanguage: 'en-US',
  },
  {
    UserId: 5,
    UserName: 'bobw',
    FullName: 'Bob Wilson',
    Email: 'bob.wilson@carmen.co.th',
    Department: 'Sales',
    Role: 'User',
    IsActive: true,
    LastLogin: '2024-04-18T14:20:00',
    CreatedAt: '2024-02-15',
    Phone: '085-567-8901',
    DefaultLanguage: 'en-US',
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function ConfigUsers() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [status, setStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [role, setRole] = useState<'All' | string>('All');
  const [department, setDepartment] = useState<'All' | string>('All');

  // Filter data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch = debouncedSearch === '' || 
        item.UserName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.FullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.Email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = status === 'All' || (status === 'Active' ? item.IsActive : !item.IsActive);
      const matchesRole = role === 'All' || item.Role === role;
      const matchesDept = department === 'All' || item.Department === department;
      return matchesSearch && matchesStatus && matchesRole && matchesDept;
    });
  }, [debouncedSearch, status, role, department]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: 'avatar',
        header: '',
        cell: ({ row }: { row: { original: User } }) => (
          <Avatar color="blue" radius="xl">
            {row.original.FullName.split(' ').map(n => n[0]).join('')}
          </Avatar>
        ),
      },
      {
        accessorKey: 'UserName' as const,
        header: 'Username',
        cell: (info: { getValue: () => string }) => (
          <Text fw={500}>{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'FullName' as const,
        header: 'Full Name',
        cell: (info: { getValue: () => string }) => info.getValue(),
      },
      {
        accessorKey: 'Email' as const,
        header: 'Email',
        cell: (info: { getValue: () => string }) => (
          <Text size="sm" c="dimmed">{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'Department' as const,
        header: 'Department',
        cell: (info: { getValue: () => string }) => (
          <Badge variant="light">{info.getValue()}</Badge>
        ),
      },
      {
        accessorKey: 'Role' as const,
        header: 'Role',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          let color = 'gray';
          if (value === 'Administrator') color = 'red';
          if (value === 'Manager') color = 'blue';
          if (value === 'Accountant') color = 'green';
          return <Badge color={color}>{value}</Badge>;
        },
      },
      {
        accessorKey: 'IsActive' as const,
        header: 'Status',
        cell: (info: { getValue: () => boolean }) => {
          const value = info.getValue();
          return (
            <Badge color={value ? 'green' : 'red'} variant="dot">
              {value ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'LastLogin' as const,
        header: 'Last Login',
        cell: (info: { getValue: () => string }) => {
          const value = info.getValue();
          return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : 'Never';
        },
      },
      {
        id: 'actions',
        header: '',
        cell: () => {
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="View">
                <ActionIcon variant="light">
                  <IconEye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit">
                <ActionIcon variant="light" color="blue">
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Reset Password">
                <ActionIcon variant="light" color="orange">
                  <IconLock size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete">
                <ActionIcon variant="light" color="red">
                  <IconTrash size={16} />
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
        title="User Management"
        subtitle="Manage system users and their access"
        breadcrumbs={[
          { label: 'Config', href: '/config' },
          { label: 'Users' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            Add User
          </Button>
        }
      />

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Total Users</Text>
            <Text size="xl" fw={700}>{mockData.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Active</Text>
            <Text size="xl" fw={700} c="green">{mockData.filter(u => u.IsActive).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Inactive</Text>
            <Text size="xl" fw={700} c="red">{mockData.filter(u => !u.IsActive).length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder p="md">
            <Text size="xs" c="dimmed" tt="uppercase">Logged In Today</Text>
            <Text size="xl" fw={700} c="blue">{mockData.filter(u => u.LastLogin && new Date(u.LastLogin).toDateString() === new Date().toDateString()).length}</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filters */}
      <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Search users..."
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
              label="Role"
              value={role}
              onChange={(val) => setRole(val || 'All')}
              data={['All', 'Administrator', 'Manager', 'Accountant', 'User']}
              clearable
            />
            <Select
              label="Department"
              value={department}
              onChange={(val) => setDepartment(val || 'All')}
              data={['All', 'IT', 'Accounting', 'Finance', 'HR', 'Sales']}
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
