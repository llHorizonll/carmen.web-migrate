import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button, Badge } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useApVendorList } from '../../../hooks/useApVendor';
import type { ApVendor } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ApVendorList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useApVendorList(filters);

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'IsActive',
        label: 'Active',
        type: 'select',
        options: [
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ],
      },
    ],
    []
  );

  const columns: ColumnDef<ApVendor>[] = useMemo(
    () => [
      {
        accessorKey: 'VendorCode',
        header: 'Vendor Code',
      },
      {
        accessorKey: 'VendorName',
        header: 'Vendor Name',
      },
      {
        accessorKey: 'TaxId',
        header: 'Tax ID',
      },
      {
        accessorKey: 'CurCode',
        header: 'Currency',
      },
      {
        accessorKey: 'IsActive',
        header: 'Status',
        cell: ({ row }) =>
          row.original.IsActive ? (
            <Badge color="green" size="sm">
              Active
            </Badge>
          ) : (
            <Badge color="red" size="sm">
              Inactive
            </Badge>
          ),
      },
    ],
    []
  );

  const handleRowClick = (row: ApVendor) => {
    navigate(`/ap/vendor/${row.VendorId}`);
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

  const vendors = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="AP Vendors"
        subtitle="Manage vendor master data"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Vendors' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/ap/vendor/new')}
          >
            New Vendor
          </Button>
        }
      />

      <FilterPanel
        fields={filterFields}
        values={filters}
        onChange={(values) => setFilters((prev) => ({ ...prev, ...values }))}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search vendors..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={vendors}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No vendors found"
        />
      </Paper>
    </div>
  );
}
