import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useArReceiptList } from '../../../hooks/useArReceipt';
import { formatDate, formatCurrency } from '../../../utils/formatter';
import type { ArReceipt } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ArReceiptList() {
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

  const { data, isLoading } = useArReceiptList({
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

  const columns: ColumnDef<ArReceipt>[] = useMemo(
    () => [
      {
        accessorKey: 'RcptNo',
        header: 'Receipt No',
      },
      {
        accessorKey: 'RcptDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.RcptDate),
      },
      {
        accessorKey: 'ProfileName',
        header: 'Customer',
      },
      {
        accessorKey: 'RcptAmount',
        header: 'Amount',
        cell: ({ row }) => formatCurrency(row.original.RcptAmount, row.original.CurCode),
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

  const handleRowClick = (row: ArReceipt) => {
    navigate(`/ar/receipt/${row.ArRcptSeq}`);
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

  const receipts = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="AR Receipts"
        subtitle="Manage accounts receivable receipts"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Receipts' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/ar/receipt/new')}
          >
            New Receipt
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
        searchPlaceholder="Search receipts..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={receipts}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No AR receipts found"
        />
      </Paper>
    </div>
  );
}
