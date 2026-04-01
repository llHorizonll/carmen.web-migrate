import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useApPaymentList } from '../../../hooks/useApPayment';
import { formatDate, formatNumber } from '../../../utils/formatter';
import type { ApPayment } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ApPaymentList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useApPaymentList(filters);

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        key: 'VendorId',
        label: 'Vendor',
        type: 'select',
        options: [], // Will be populated from API
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
      {
        key: 'Status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'Draft', label: 'Draft' },
          { value: 'Normal', label: 'Normal' },
          { value: 'Void', label: 'Void' },
          { value: 'All', label: 'All' },
        ],
      },
    ],
    []
  );

  const columns: ColumnDef<ApPayment>[] = useMemo(
    () => [
      {
        accessorKey: 'PmtNo',
        header: 'Payment No',
      },
      {
        accessorKey: 'PmtDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.PmtDate),
      },
      {
        accessorKey: 'VendorName',
        header: 'Vendor',
      },
      {
        accessorKey: 'PmtAmount',
        header: 'Amount',
        cell: ({ row }) => formatNumber(row.original.PmtAmount),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'BankCode',
        header: 'Bank',
      },
      {
        accessorKey: 'ChqNo',
        header: 'Cheque No',
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.Status} />,
      },
    ],
    []
  );

  const handleRowClick = (row: ApPayment) => {
    navigate(`/ap/payment/${row.ApPmtSeq}`);
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

  const payments = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="AP Payments"
        subtitle="Manage accounts payable payments"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Payments' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/ap/payment/new')}
          >
            New Payment
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
        searchPlaceholder="Search payments..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={payments}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No payments found"
        />
      </Paper>
    </div>
  );
}
