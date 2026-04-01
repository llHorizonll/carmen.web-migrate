import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useArProfileList } from '../../../hooks/useArProfile';
import { formatCurrency } from '../../../utils/formatter';
import type { ArProfile } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ArProfileList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    Page: number;
    Limit: number;
    IsActive?: boolean;
  }>({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useArProfileList({
    Page: filters.Page,
    Limit: filters.Limit,
    IsActive: filters.IsActive,
    Search: searchQuery || undefined,
  });

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'IsActive',
        label: 'Status',
        type: 'select',
        options: [
          { value: '', label: 'All' },
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ],
      },
    ],
    []
  );

  const columns: ColumnDef<ArProfile>[] = useMemo(
    () => [
      {
        accessorKey: 'ProfileCode',
        header: 'Code',
      },
      {
        accessorKey: 'ProfileName',
        header: 'Name',
      },
      {
        accessorKey: 'ArTypeName',
        header: 'Type',
      },
      {
        accessorKey: 'CreditLimit',
        header: 'Credit Limit',
        cell: ({ row }) => formatCurrency(row.original.CreditLimit, row.original.CurCode),
      },
      {
        accessorKey: 'CurCode',
        header: 'Currency',
      },
      {
        accessorKey: 'IsActive',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge status={row.original.IsActive ? 'Active' : 'Inactive'} />
        ),
      },
    ],
    []
  );

  const handleRowClick = (row: ArProfile) => {
    navigate(`/ar/profile/${row.ProfileId}`);
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev, Page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      Page: 1,
      Limit: 20,
    });
    setSearchQuery('');
  };

  const handlePageChange = (pageIndex: number) => {
    setFilters((prev) => ({ ...prev, Page: pageIndex + 1 }));
  };

  const profiles = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="AR Profiles"
        subtitle="Manage customer profiles"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Profiles' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/ar/profile/new')}
          >
            New Profile
          </Button>
        }
      />

      <FilterPanel
        fields={filterFields}
        values={filters}
        onChange={(values) =>
          setFilters((prev) => ({
            ...prev,
            ...values,
            IsActive:
              values.IsActive === ''
                ? undefined
                : values.IsActive === 'true',
          }))
        }
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search profiles..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={profiles}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No AR profiles found"
        />
      </Paper>
    </div>
  );
}
