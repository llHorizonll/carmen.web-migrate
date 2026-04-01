import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useAmortizationVoucherList } from '../../../hooks/useAmortizationVoucher';
import { formatDate, formatNumber } from '../../../utils/formatter';
import type { AmortizationVoucher } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function AmortizationVoucherList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useAmortizationVoucherList(filters);

  const filterFields: FilterField[] = useMemo(
    () => [
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

  const columns: ColumnDef<AmortizationVoucher>[] = useMemo(
    () => [
      {
        accessorKey: 'FJvhNo',
        header: 'Voucher No',
      },
      {
        accessorKey: 'FJvhDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.FJvhDate),
      },
      {
        accessorKey: 'Description',
        header: 'Description',
      },
      {
        accessorKey: 'StartDate',
        header: 'Start Date',
        cell: ({ row }) => formatDate(row.original.StartDate),
      },
      {
        accessorKey: 'EndDate',
        header: 'End Date',
        cell: ({ row }) => formatDate(row.original.EndDate),
      },
      {
        accessorKey: 'TotalPeriod',
        header: 'Total Period',
        cell: ({ row }) => formatNumber(row.original.TotalPeriod, 0),
      },
    ],
    []
  );

  const handleRowClick = (row: AmortizationVoucher) => {
    navigate(`/gl/amortization-voucher/${row.FJvhSeq}`);
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

  const vouchers = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="Amortization Vouchers"
        subtitle="Manage amortization journal vouchers"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Amortization Vouchers' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/gl/amortization-voucher/new')}
          >
            New Voucher
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
          emptyMessage="No amortization vouchers found"
        />
      </Paper>
    </div>
  );
}
