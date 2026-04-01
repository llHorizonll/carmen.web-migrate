import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useStandardVoucherList } from '../../../hooks/useStandardVoucher';
import { formatDate } from '../../../utils/formatter';
import type { StandardVoucher } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function StandardVoucherList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    Page: 1,
    Limit: 20,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useStandardVoucherList(filters);

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

  const columns: ColumnDef<StandardVoucher>[] = useMemo(
    () => [
      {
        accessorKey: 'FJvhNo',
        header: 'Template No',
      },
      {
        accessorKey: 'FJvhDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.FJvhDate),
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
        accessorKey: 'UserModified',
        header: 'Modified By',
      },
    ],
    []
  );

  const handleRowClick = (row: StandardVoucher) => {
    navigate(`/gl/standard-voucher/${row.FJvhSeq}`);
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
        title="Standard Vouchers"
        subtitle="Manage standard/template journal vouchers"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Standard Vouchers' },
        ]}
        actions={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/gl/standard-voucher/new')}
          >
            New Template
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
        searchPlaceholder="Search templates..."
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
          emptyMessage="No standard vouchers found"
        />
      </Paper>
    </div>
  );
}
