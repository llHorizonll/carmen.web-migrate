import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, TextInput, NumberInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import {
  useArReceiptDetail,
  useUpdateArReceipt,
} from '../../../hooks/useArReceipt';
import { formatDate, toISODate, fromMySqlDate, formatCurrency } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ArReceiptDetail } from '../../../types';

const schema = z.object({
  RcptDate: z.date({ required_error: 'Date is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurRate: z.number().min(0.0001, 'Rate must be greater than 0'),
  BankCode: z.string().optional(),
  ChqNo: z.string().optional(),
  ChqDate: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  ArRcptdSeq: number;
  ArRcptSeq: number;
  ArInvhSeq: number;
  InvNo: string;
  InvAmount: number;
  InvBalance: number;
  RcptAmount: number;
}

export default function ArReceiptEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ArRcptSeq = parseInt(id ?? '0', 10);

  const { data: receipt, isLoading } = useArReceiptDetail(ArRcptSeq);
  const updateMutation = useUpdateArReceipt();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      RcptDate: new Date(),
      Description: '',
      CurRate: 1,
      BankCode: '',
      ChqNo: '',
      ChqDate: null,
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (receipt) {
      form.setValues({
        RcptDate: fromMySqlDate(receipt.RcptDate) ?? new Date(),
        Description: receipt.Description,
        CurRate: receipt.CurRate,
        BankCode: receipt.BankCode ?? '',
        ChqNo: receipt.ChqNo ?? '',
        ChqDate: receipt.ChqDate ? fromMySqlDate(receipt.ChqDate) : null,
      });
      const lines = (receipt.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [receipt]);

  const detailColumns: InlineColumn<DetailLine>[] = [
    {
      key: 'InvNo',
      header: 'Invoice No',
      type: 'text',
      width: 150,
      editable: true,
    },
    {
      key: 'InvAmount',
      header: 'Invoice Amount',
      type: 'number',
      width: 130,
      editable: false,
      format: (value) => formatCurrency(value as number),
    },
    {
      key: 'InvBalance',
      header: 'Balance',
      type: 'number',
      width: 130,
      editable: false,
      format: (value) => formatCurrency(value as number),
    },
    {
      key: 'RcptAmount',
      header: 'Receipt Amount',
      type: 'number',
      width: 130,
      editable: true,
      format: (value) => formatCurrency(value as number),
    },
  ];

  const handleAddRow = () => {
    const newRow: DetailLine = {
      id: nextId,
      ArRcptdSeq: 0,
      ArRcptSeq,
      ArInvhSeq: 0,
      InvNo: '',
      InvAmount: 0,
      InvBalance: 0,
      RcptAmount: 0,
    };
    setDetailLines((prev) => [...prev, newRow]);
    setNextId((prev) => prev + 1);
  };

  const handleDeleteRow = (index: number) => {
    setDetailLines((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return detailLines.reduce(
      (acc, line) => ({
        rcptAmount: acc.rcptAmount + line.RcptAmount,
      }),
      { rcptAmount: 0 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (!receipt) return;

    try {
      const totals = calculateTotals();
      const detailData: ArReceiptDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
      }));

      await updateMutation.mutateAsync({
        ...receipt,
        RcptDate: toISODate(values.RcptDate),

        Description: values.Description,
        CurRate: values.CurRate,
        RcptAmount: totals.rcptAmount,
        RcptAmountBase: totals.rcptAmount * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        ChqDate: values.ChqDate ? toISODate(values.ChqDate) : undefined,
        Detail: detailData,
      });
      navigate('/ar/receipt');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ar/receipt');
  };

  const receiptNo = receipt?.RcptNo ?? '...';
  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title={`Edit AR Receipt: ${receiptNo}`}
        subtitle={`Created: ${formatDate(receipt?.RcptDate)} | Customer: ${receipt?.ProfileName ?? ''}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Receipts', href: '/ar/receipt' },
          { label: receiptNo },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Date"
                  placeholder="Select date"
                  required
                  {...form.getInputProps('RcptDate')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Customer"
                  value={receipt?.ProfileName ?? ''}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Currency"
                  value={receipt?.CurCode ?? 'THB'}
                  readOnly
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md">
              <Grid.Col span={2}>
                <NumberInput
                  label="Exchange Rate"
                  placeholder="Enter rate"
                  required
                  min={0.0001}
                  decimalScale={4}
                  {...form.getInputProps('CurRate')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Bank Code"
                  placeholder="Enter bank code"
                  {...form.getInputProps('BankCode')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Cheque No"
                  placeholder="Enter cheque no"
                  {...form.getInputProps('ChqNo')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Cheque Date"
                  placeholder="Select cheque date"
                  clearable
                  {...form.getInputProps('ChqDate')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <TextInput
                  label="Description"
                  placeholder="Enter description"
                  required
                  {...form.getInputProps('Description')}
                />
              </Grid.Col>
            </Grid>

            <InlineTable
              data={detailLines}
              columns={detailColumns}
              onChange={setDetailLines}
              onRowAdd={handleAddRow}
              onRowDelete={handleDeleteRow}
              maxHeight={400}
            />

            <Paper withBorder p="md">
              <Grid gutter="md">
                <Grid.Col span={4}>
                  <TextInput
                    label="Total Receipt Amount"
                    value={formatCurrency(totals.rcptAmount, receipt?.CurCode)}
                    readOnly
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Group justify="flex-end">
              <Button
                variant="subtle"
                leftSection={<IconX size={16} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<IconCheck size={16} />}
                loading={updateMutation.isPending}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
