import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Group,
  Text,
  Badge,
  TextInput,
  Stack,
  Tooltip,
  ActionIcon,
  Paper,
  Grid,
  Title,
  Checkbox,
  Table,
  Divider,
  Accordion,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconPlus, IconEdit, IconTrash, IconShield,  IconCopy } from '@tabler/icons-react';
import { DataTable } from '../../../components/DataTable';
import { PageHeader } from '../../../components/ui/PageHeader';

// Mock data for roles and permissions
interface Permission {
  Module: string;
  Functions: {
    Name: string;
    View: boolean;
    Create: boolean;
    Edit: boolean;
    Delete: boolean;
    Approve: boolean;
  }[];
}

interface Role {
  RoleId: number;
  RoleName: string;
  Description: string;
  UserCount: number;
  IsSystem: boolean;
  Permissions: Permission[];
}

const mockRoles: Role[] = [
  {
    RoleId: 1,
    RoleName: 'Administrator',
    Description: 'Full system access with all permissions',
    UserCount: 1,
    IsSystem: true,
    Permissions: [
      {
        Module: 'General Ledger',
        Functions: [
          { Name: 'Journal Voucher', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Allocation Voucher', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Chart of Accounts', View: true, Create: true, Edit: true, Delete: false, Approve: true },
        ],
      },
      {
        Module: 'Accounts Payable',
        Functions: [
          { Name: 'Vendor', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Invoice', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Payment', View: true, Create: true, Edit: true, Delete: true, Approve: true },
        ],
      },
      {
        Module: 'Accounts Receivable',
        Functions: [
          { Name: 'Customer', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Invoice', View: true, Create: true, Edit: true, Delete: true, Approve: true },
          { Name: 'Receipt', View: true, Create: true, Edit: true, Delete: true, Approve: true },
        ],
      },
    ],
  },
  {
    RoleId: 2,
    RoleName: 'Accountant',
    Description: 'Can create and edit transactions but cannot approve',
    UserCount: 2,
    IsSystem: true,
    Permissions: [
      {
        Module: 'General Ledger',
        Functions: [
          { Name: 'Journal Voucher', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Allocation Voucher', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Chart of Accounts', View: true, Create: false, Edit: false, Delete: false, Approve: false },
        ],
      },
      {
        Module: 'Accounts Payable',
        Functions: [
          { Name: 'Vendor', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Invoice', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Payment', View: true, Create: true, Edit: true, Delete: false, Approve: false },
        ],
      },
      {
        Module: 'Accounts Receivable',
        Functions: [
          { Name: 'Customer', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Invoice', View: true, Create: true, Edit: true, Delete: false, Approve: false },
          { Name: 'Receipt', View: true, Create: true, Edit: true, Delete: false, Approve: false },
        ],
      },
    ],
  },
  {
    RoleId: 3,
    RoleName: 'Manager',
    Description: 'Can view all data and approve transactions',
    UserCount: 1,
    IsSystem: false,
    Permissions: [
      {
        Module: 'General Ledger',
        Functions: [
          { Name: 'Journal Voucher', View: true, Create: false, Edit: false, Delete: false, Approve: true },
          { Name: 'Chart of Accounts', View: true, Create: false, Edit: false, Delete: false, Approve: false },
        ],
      },
      {
        Module: 'Accounts Payable',
        Functions: [
          { Name: 'Vendor', View: true, Create: false, Edit: false, Delete: false, Approve: false },
          { Name: 'Invoice', View: true, Create: false, Edit: false, Delete: false, Approve: true },
          { Name: 'Payment', View: true, Create: false, Edit: false, Delete: false, Approve: true },
        ],
      },
    ],
  },
  {
    RoleId: 4,
    RoleName: 'Viewer',
    Description: 'Read-only access to all modules',
    UserCount: 1,
    IsSystem: false,
    Permissions: [
      {
        Module: 'General Ledger',
        Functions: [
          { Name: 'Journal Voucher', View: true, Create: false, Edit: false, Delete: false, Approve: false },
          { Name: 'Chart of Accounts', View: true, Create: false, Edit: false, Delete: false, Approve: false },
        ],
      },
      {
        Module: 'Accounts Payable',
        Functions: [
          { Name: 'Vendor', View: true, Create: false, Edit: false, Delete: false, Approve: false },
          { Name: 'Invoice', View: true, Create: false, Edit: false, Delete: false, Approve: false },
          { Name: 'Payment', View: true, Create: false, Edit: false, Delete: false, Approve: false },
        ],
      },
    ],
  },
];

const PAGE_SIZE_OPTIONS = [15, 50, 100];

export default function ConfigPermissions() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [selectedRole, setSelectedRole] = useState<Role | null>(mockRoles[0]);

  // Filter data
  const filteredData = useMemo(() => {
    return mockRoles.filter((item) => {
      return debouncedSearch === '' || 
        item.RoleName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.Description.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
  }, [debouncedSearch]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'RoleName' as const,
        header: 'Role Name',
        cell: (info: { getValue: () => string; row: { original: Role } }) => {
          const role = info.row.original;
          return (
            <Group gap="xs">
              <IconShield size={20} color={role.IsSystem ? 'red' : 'blue'} />
              <Text fw={600}>{info.getValue()}</Text>
              {role.IsSystem && <Badge size="xs" color="red">System</Badge>}
            </Group>
          );
        },
      },
      {
        accessorKey: 'Description' as const,
        header: 'Description',
        cell: (info: { getValue: () => string }) => (
          <Text size="sm" c="dimmed">{info.getValue()}</Text>
        ),
      },
      {
        accessorKey: 'UserCount' as const,
        header: 'Users',
        cell: (info: { getValue: () => number }) => (
          <Badge variant="dot">{info.getValue()} users</Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: Role } }) => {
          const role = row.original;
          return (
            <Group gap="xs" justify="flex-end">
              <Tooltip label="Edit Permissions">
                <ActionIcon 
                  variant="light" 
                  color="blue"
                  onClick={() => setSelectedRole(role)}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Duplicate">
                <ActionIcon variant="light" color="green">
                  <IconCopy size={16} />
                </ActionIcon>
              </Tooltip>
              {!role.IsSystem && (
                <Tooltip label="Delete">
                  <ActionIcon variant="light" color="red">
                    <IconTrash size={16} />
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
        title="Role & Permission Management"
        subtitle="Configure user roles and access permissions"
        breadcrumbs={[
          { label: 'Config', href: '/config' },
          { label: 'Permissions' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            Create Role
          </Button>
        }
      />

      <Grid>
        <Grid.Col span={5}>
          <Stack gap="md">
            {/* Roles List */}
            <Box p="md" bg="gray.0" style={{ borderRadius: 8 }}>
              <TextInput
                placeholder="Search roles..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

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
        </Grid.Col>

        <Grid.Col span={7}>
          <Paper withBorder p="md">
            {selectedRole ? (
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Title order={4}>{selectedRole.RoleName}</Title>
                    <Text size="sm" c="dimmed">{selectedRole.Description}</Text>
                  </div>
                  <Button size="sm" leftSection={<IconEdit size={16} />}>
                    Edit
                  </Button>
                </Group>

                <Divider />

                <Title order={5}>Permissions</Title>

                <Accordion variant="separated">
                  {selectedRole.Permissions.map((perm) => (
                    <Accordion.Item key={perm.Module} value={perm.Module}>
                      <Accordion.Control>
                        <Group>
                          <Text fw={500}>{perm.Module}</Text>
                          <Badge size="xs">{perm.Functions.length} functions</Badge>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Table withTableBorder>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Function</Table.Th>
                              <Table.Th style={{ textAlign: 'center' }}>View</Table.Th>
                              <Table.Th style={{ textAlign: 'center' }}>Create</Table.Th>
                              <Table.Th style={{ textAlign: 'center' }}>Edit</Table.Th>
                              <Table.Th style={{ textAlign: 'center' }}>Delete</Table.Th>
                              <Table.Th style={{ textAlign: 'center' }}>Approve</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {perm.Functions.map((func) => (
                              <Table.Tr key={func.Name}>
                                <Table.Td>{func.Name}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                  <Checkbox checked={func.View} readOnly />
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                  <Checkbox checked={func.Create} readOnly />
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                  <Checkbox checked={func.Edit} readOnly />
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                  <Checkbox checked={func.Delete} readOnly />
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                  <Checkbox checked={func.Approve} readOnly />
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Stack>
            ) : (
              <Stack align="center" gap="md" py="xl">
                <IconShield size={64} color="gray" />
                <Text c="dimmed">Select a role to view permissions</Text>
              </Stack>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
