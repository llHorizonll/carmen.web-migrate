import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useAllocationVoucherList } from '../../../hooks/useAllocationVoucher';
import { formatDate } from '../../../utils/formatter';
import type { AllocationVoucher } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function AllocationVoucherList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    Page: number;
    Limit: number;
    Status: 'Draft' | 'Normal' | 'Void' | 'All';
    FromDate?: Date | null;
    ToDate?: Date | null;
  }>({
    Page: 1,
    Limit: 20,
    Status: 'All',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useAllocationVoucherList({
    Page: filters.Page,
    Limit: filters.Limit,
    Status: filters.Status,
    FromDate: filters.FromDate ? formatDate(filters.FromDate) : undefined,
    ToDate: filters.ToDate ? formatDate(filters.ToDate) : undefined,
  });

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'Status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'All', label: 'All' },
          { value: 'Draft', label: 'Draft' },
          { value: 'Normal', label: 'Normal' },
          { value: 'Void', label: 'Void' },
        ],
      },
      {
        key: 'FromDate',
        label: 'From Date',
        type: 'date',
      },
      {
        key: 'ToDate',
        label: 'To Date',
        type: 'date',
      },
    ],
    []
  );

  const columns: ColumnDef<AllocationVoucher>[] = useMemo(
    () => [
      {
        accessorKey: 'AJvhNo',
        header: 'Voucher No',
      },
      {
        accessorKey: 'AJvhDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.AJvhDate),
      },
      {
        accessorKey: 'Prefix',
        header: 'Prefix',
      },
      {
        accessorKey: 'Description',
        header: 'Description',
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.Status} />,
      },
    ],
    []
  );

  const handleRowClick = (row: AllocationVoucher) => {
    navigate(`/gl/allocation-voucher/${row.AJvhSeq}`);
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

  const vouchers = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="Allocation Vouchers"
        subtitle="Manage allocation journal vouchers"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Allocation Vouchers' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/gl/allocation-voucher/new')}
          >
            New Voucher
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
        searchPlaceholder="Search vouchers..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={vouchers}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No allocation vouchers found"
        />
      </Paper>
    </div>
  );
}
