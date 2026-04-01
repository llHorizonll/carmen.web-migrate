import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useAssetRegisterList } from '../../../hooks/useAssetRegister';
import { formatDate, formatCurrency } from '../../../utils/formatter';
import type { AssetRegister } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function AssetRegisterList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    Page: number;
    Limit: number;
    Status: string;
    Search?: string;
  }>({
    Page: 1,
    Limit: 20,
    Status: 'All',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useAssetRegisterList({
    Page: filters.Page,
    Limit: filters.Limit,
    Status: filters.Status === 'All' ? undefined : filters.Status,
    Search: searchQuery || undefined,
  });

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'Status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'All', label: 'All' },
          { value: 'Active', label: 'Active' },
          { value: 'Disposed', label: 'Disposed' },
          { value: 'Impaired', label: 'Impaired' },
        ],
      },
    ],
    []
  );

  const columns: ColumnDef<AssetRegister>[] = useMemo(
    () => [
      {
        accessorKey: 'AssetCode',
        header: 'Asset Code',
      },
      {
        accessorKey: 'AssetName',
        header: 'Asset Name',
      },
      {
        accessorKey: 'CategoryName',
        header: 'Category',
      },
      {
        accessorKey: 'DepartmentName',
        header: 'Department',
      },
      {
        accessorKey: 'PurchaseDate',
        header: 'Purchase Date',
        cell: ({ row }) => formatDate(row.original.PurchaseDate),
      },
      {
        accessorKey: 'PurchasePrice',
        header: 'Purchase Price',
        cell: ({ row }) => formatCurrency(row.original.PurchasePrice, row.original.CurCode),
      },
      {
        accessorKey: 'NetBookValue',
        header: 'Net Book Value',
        cell: ({ row }) => formatCurrency(row.original.NetBookValue, row.original.CurCode),
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.Status} />,
      },
    ],
    []
  );

  const handleRowClick = (row: AssetRegister) => {
    navigate(`/asset/register/${row.AssetId}`);
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev, Page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      Page: 1,
      Limit: 20,
      Status: 'All',
    });
    setSearchQuery('');
  };

  const handlePageChange = (pageIndex: number) => {
    setFilters((prev) => ({ ...prev, Page: pageIndex + 1 }));
  };

  const assets = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="Asset Register"
        subtitle="Manage fixed assets and depreciation"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Asset Register' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/asset/register/new')}
          >
            New Asset
          </Button>
        }
      />

      <FilterPanel
        fields={filterFields}
        values={filters}
        onChange={(values) => setFilters((prev) => ({ ...prev, ...values } as typeof prev))}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search assets..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={assets}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No assets found"
        />
      </Paper>
    </div>
  );
}
