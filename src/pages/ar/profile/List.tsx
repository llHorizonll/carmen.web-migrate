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
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconPlus, IconEye, IconEdit } from '@tabler/icons-react';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useArProfileList, useArTypeList } from '../../../hooks/useArProfile';
import type { ArProfile, ArProfileFilterParams } from '../../../types';

const PAGE_SIZE = 50;

export default function ArProfileList() {
  const navigate = useNavigate();

  // Filter states
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [arTypeId, setArTypeId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<string>('true');

  // Fetch AR types for filter
  const { data: arTypes } = useArTypeList();

  // Calculate filter params
  const filterParams: ArProfileFilterParams = useMemo(() => {
    const params: ArProfileFilterParams = {
      Limit: PAGE_SIZE,
      Page: page + 1,
      OrderBy: 'ProfileCode',
    };

    // Build WhereGroupList
    const whereGroupList = [];

    // Active filter
    if (isActive !== 'all') {
      whereGroupList.push({
        AndOr: 'And' as const,
        ConditionList: [
          {
            AndOr: 'And' as const,
            Field: 'IsActive',
            Operator: '=',
            Value: isActive === 'true' ? '1' : '0',
          },
        ],
      });
    }

    // AR Type filter
    if (arTypeId) {
      if (whereGroupList.length > 0) {
        whereGroupList[0].ConditionList.push({
          AndOr: 'And' as const,
          Field: 'ArTypeId',
          Operator: '=',
          Value: arTypeId,
        });
      }
    }

    // Search filter
    if (debouncedSearch) {
      params.WhereLike = `%${debouncedSearch}%`;
      params.WhereLikeFields = 'ProfileCode,ProfileName,ContactPerson,Phone';
    }

    if (whereGroupList.length > 0) {
      params.WhereGroupList = whereGroupList;
    }

    return params;
  }, [page, isActive, arTypeId, debouncedSearch]);

  // Fetch data
  const { data, isLoading, error } = useArProfileList(filterParams);

  // Handle error
  if (error) {
    notifications.show({
      title: 'Error',
      message: error.message || 'Failed to load AR profiles',
      color: 'red',
    });
  }

  // AR Type options
  const arTypeOptions = useMemo(() => {
    const options = [{ value: '', label: 'All Types' }];
    if (arTypes) {
      arTypes.forEach((type) => {
        options.push({
          value: type.ArTypeId.toString(),
          label: type.ArTypeName,
        });
      });
    }
    return options;
  }, [arTypes]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: 'actions',
        header: '',
        size: 80,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <Group gap={4}>
            <Tooltip label="View">
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => navigate(`/ar/profile/${row.original.ProfileId}`)}
              >
                <IconEye size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Edit">
              <ActionIcon
                variant="subtle"
                color="green"
                onClick={() => navigate(`/ar/profile/${row.original.ProfileId}/edit`)}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
      {
        accessorKey: 'ProfileCode',
        header: 'Code',
        size: 100,
      },
      {
        accessorKey: 'ProfileName',
        header: 'Name',
        size: 250,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <Tooltip label={row.original.ProfileName} position="top" withArrow>
            <Text truncate size="sm" style={{ maxWidth: 230 }}>
              {row.original.ProfileName}
            </Text>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'ArTypeName',
        header: 'AR Type',
        size: 120,
      },
      {
        accessorKey: 'ContactPerson',
        header: 'Contact',
        size: 150,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <Text size="sm" truncate>
            {row.original.ContactPerson || '-'}
          </Text>
        ),
      },
      {
        accessorKey: 'Phone',
        header: 'Phone',
        size: 120,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <Text size="sm">{row.original.Phone || '-'}</Text>
        ),
      },
      {
        accessorKey: 'CreditLimit',
        header: 'Credit Limit',
        size: 120,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <Text size="sm" ta="right">
            {(row.original.CreditLimit || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        ),
      },
      {
        accessorKey: 'CurCode',
        header: 'Currency',
        size: 80,
      },
      {
        accessorKey: 'IsActive',
        header: 'Status',
        size: 90,
        cell: ({ row }: { row: { original: ArProfile } }) => (
          <StatusBadge
            status={row.original.IsActive ? 'Active' : 'Inactive'}
            variant="light"
          />
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
            AR Profile
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => navigate('/ar/profile/create')}
          >
            Create
          </Button>
        </Group>

        {/* Filters */}
        <Group gap="sm" align="flex-end">
          <Select
            label="AR Type"
            value={arTypeId || ''}
            onChange={(value) => {
              setArTypeId(value || null);
              setPage(0);
            }}
            data={arTypeOptions}
            style={{ width: 150 }}
          />

          <Select
            label="Status"
            value={isActive}
            onChange={(value) => {
              setIsActive(value || 'true');
              setPage(0);
            }}
            data={[
              { value: 'all', label: 'All' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            style={{ width: 120 }}
          />

          <TextInput
            label="Search"
            placeholder="Search code, name, contact..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(0);
            }}
            style={{ width: 280 }}
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
          emptyMessage="No AR profiles found"
        />
      </Stack>
    </Box>
  );
}
