import { useState, useMemo } from 'react';
import { Paper, Select, Group, Text } from '@mantine/core';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { FilterPanel, type FilterField } from '../../../components/ui/FilterPanel';
import { useArFolioList } from '../../../hooks/useArProfile';
import { useArProfileList } from '../../../hooks/useArProfile';
import { formatDate, formatCurrency } from '../../../utils/formatter';
import type { ArFolio } from '../../../types';
import type { ColumnDef } from '@tanstack/react-table';

export default function ArFolioList() {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [filters, setFilters] = useState<{
    FromDate?: Date | null;
    ToDate?: Date | null;
  }>({});

  // Get profiles for dropdown
  const { data: profilesData } = useArProfileList({
    Page: 1,
    Limit: 1000,
    IsActive: true,
  });

  const { data: folioData, isLoading } = useArFolioList({
    ProfileId: selectedProfileId ?? 0,
    FromDate: filters.FromDate ? formatDate(filters.FromDate) : undefined,
    ToDate: filters.ToDate ? formatDate(filters.ToDate) : undefined,
  });

  const profileOptions = useMemo(() => {
    const profiles = profilesData?.Data ?? [];
    return [
      { value: '', label: 'Select Customer' },
      ...profiles.map((p) => ({ value: String(p.ProfileId), label: `${p.ProfileCode} - ${p.ProfileName}` })),
    ];
  }, [profilesData]);

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

  const columns: ColumnDef<ArFolio>[] = useMemo(
    () => [
      {
        accessorKey: 'TransDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.TransDate),
      },
      {
        accessorKey: 'TransType',
        header: 'Type',
      },
      {
        accessorKey: 'TransNo',
        header: 'Document No',
      },
      {
        accessorKey: 'Description',
        header: 'Description',
      },
      {
        accessorKey: 'Debit',
        header: 'Debit',
        cell: ({ row }) => formatCurrency(row.original.Debit),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'Credit',
        header: 'Credit',
        cell: ({ row }) => formatCurrency(row.original.Credit),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'Balance',
        header: 'Balance',
        cell: ({ row }) => formatCurrency(row.original.Balance),
        meta: { align: 'right' },
      },
    ],
    []
  );

  const handleApplyFilters = () => {
    // Filters are applied automatically via state change
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const calculateTotals = () => {
    if (!folioData) return { totalDebit: 0, totalCredit: 0, currentBalance: 0 };
    
    const totalDebit = folioData.reduce((sum, item) => sum + item.Debit, 0);
    const totalCredit = folioData.reduce((sum, item) => sum + item.Credit, 0);
    const currentBalance = folioData.length > 0 
      ? folioData[folioData.length - 1].Balance 
      : 0;
    
    return { totalDebit, totalCredit, currentBalance };
  };

  const { totalDebit, totalCredit, currentBalance } = calculateTotals();
  const selectedProfile = profilesData?.Data?.find(p => p.ProfileId === selectedProfileId);

  return (
    <div>
      <PageHeader
        title="AR Folio"
        subtitle="View customer transaction history and running balance"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Folio' },
        ]}
      />

      <Paper withBorder p="md" mb="md">
        <Group>
          <Select
            label="Customer"
            placeholder="Select customer to view folio"
            data={profileOptions}
            value={selectedProfileId ? String(selectedProfileId) : ''}
            onChange={(value) => setSelectedProfileId(value ? parseInt(value, 10) : null)}
            searchable
            clearable
            style={{ minWidth: 400 }}
          />
          {selectedProfile && (
            <div>
              <Text size="sm" c="dimmed">Credit Limit</Text>
              <Text fw={500}>{formatCurrency(selectedProfile.CreditLimit, selectedProfile.CurCode)}</Text>
            </div>
          )}
        </Group>
      </Paper>

      {selectedProfileId ? (
        <>
          <FilterPanel
            fields={filterFields}
            values={filters}
            onChange={(values) => setFilters((prev) => ({ ...prev, ...values }))}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            loading={isLoading}
            showSearch={false}
          />

          <Paper withBorder p="md">
            <DataTable
              data={folioData ?? []}
              columns={columns}
              loading={isLoading}
              totalRows={folioData?.length ?? 0}
              pagination={{
                pageIndex: 0,
                pageSize: folioData?.length ?? 20,
                onPageChange: () => {},
              }}
              emptyMessage="No transactions found for this customer"
            />
          </Paper>

          <Paper withBorder p="md" mt="md">
            <Group justify="space-between">
              <Group>
                <div>
                  <Text size="sm" c="dimmed">Total Debit</Text>
                  <Text fw={500} c="green">{formatCurrency(totalDebit)}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Total Credit</Text>
                  <Text fw={500} c="red">{formatCurrency(totalCredit)}</Text>
                </div>
              </Group>
              <div>
                <Text size="sm" c="dimmed">Current Balance</Text>
                <Text fw={700} size="lg" c={currentBalance >= 0 ? 'blue' : 'red'}>
                  {formatCurrency(currentBalance)}
                </Text>
              </div>
            </Group>
          </Paper>
        </>
      ) : (
        <Paper withBorder p="xl" ta="center">
          <Text c="dimmed">Select a customer to view their folio</Text>
        </Paper>
      )}
    </div>
  );
}
