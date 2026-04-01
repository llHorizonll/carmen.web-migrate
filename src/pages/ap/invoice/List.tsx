import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useApInvoiceList } from '../../../hooks/useApInvoice';
import { formatDate, formatNumber } from '../../../utils/formatter';
import type { ApInvoice } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ApInvoiceList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useApInvoiceList(filters);

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

  const columns: ColumnDef<ApInvoice>[] = useMemo(
    () => [
      {
        accessorKey: 'InvNo',
        header: 'Invoice No',
      },
      {
        accessorKey: 'InvDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.InvDate),
      },
      {
        accessorKey: 'VendorName',
        header: 'Vendor',
      },
      {
        accessorKey: 'InvAmount',
        header: 'Amount',
        cell: ({ row }) => formatNumber(row.original.InvAmount),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'VatAmount',
        header: 'VAT',
        cell: ({ row }) => formatNumber(row.original.VatAmount),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'NetAmount',
        header: 'Net Amount',
        cell: ({ row }) => formatNumber(row.original.NetAmount),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.Status} />,
      },
    ],
    []
  );

  const handleRowClick = (row: ApInvoice) => {
    navigate(`/ap/invoice/${row.ApInvhSeq}`);
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

  const invoices = data?.Data ?? [];
  const totalRows = data?.Total ?? 0;

  return (
    <div>
      <PageHeader
        title="AP Invoices"
        subtitle="Manage accounts payable invoices"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Invoices' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/ap/invoice/new')}
          >
            New Invoice
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
        searchPlaceholder="Search invoices..."
      />

      <Paper withBorder p="md">
        <DataTable
          data={invoices}
          columns={columns}
          loading={isLoading}
          totalRows={totalRows}
          pagination={{
            pageIndex: (filters.Page ?? 1) - 1,
            pageSize: filters.Limit ?? 20,
            onPageChange: handlePageChange,
          }}
          onRowClick={handleRowClick}
          emptyMessage="No invoices found"
        />
      </Paper>
    </div>
  );
}
