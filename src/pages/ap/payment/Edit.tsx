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
  useApPaymentDetail,
  useUpdateApPayment,
} from '../../../hooks/useApPayment';
import { formatDate, toISODate, fromMySqlDate, formatCurrency } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ApPaymentDetail } from '../../../types';

const schema = z.object({
  PmtDate: z.date({ required_error: 'Date is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurRate: z.number().min(0.0001, 'Rate must be greater than 0'),
  BankCode: z.string().optional(),
  ChqNo: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  ApPmtdSeq: number;
  ApPmtSeq: number;
  ApInvhSeq: number;
  InvNo: string;
  InvAmount: number;
  InvBalance: number;
  PmtAmount: number;
}

export default function ApPaymentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ApPmtSeq = parseInt(id ?? '0', 10);

  const { data: payment, isLoading } = useApPaymentDetail(ApPmtSeq);
  const updateMutation = useUpdateApPayment();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      PmtDate: new Date(),
      Description: '',
      CurRate: 1,
      BankCode: '',
      ChqNo: '',
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (payment) {
      form.setValues({
        PmtDate: fromMySqlDate(payment.PmtDate) ?? new Date(),
        Description: payment.Description,
        CurRate: payment.CurRate,
        BankCode: payment.BankCode ?? '',
        ChqNo: payment.ChqNo ?? '',
      });
      const lines = (payment.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [payment]);

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
      width: 150,
      editable: true,
    },
    {
      key: 'InvBalance',
      header: 'Balance',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      key: 'PmtAmount',
      header: 'Payment Amount',
      type: 'number',
      width: 150,
      editable: true,
    },
  ];

  const handleAddRow = () => {
    const newRow: DetailLine = {
      id: nextId,
      ApPmtdSeq: 0,
      ApPmtSeq,
      ApInvhSeq: 0,
      InvNo: '',
      InvAmount: 0,
      InvBalance: 0,
      PmtAmount: 0,
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
        pmtAmount: acc.pmtAmount + line.PmtAmount,
      }),
      { pmtAmount: 0 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (!payment) return;

    try {
      const totals = calculateTotals();
      const detailData: ApPaymentDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
      }));

      await updateMutation.mutateAsync({
        ...payment,
        PmtDate: toISODate(values.PmtDate),
        Description: values.Description,
        CurRate: values.CurRate,
        PmtAmount: totals.pmtAmount,
        PmtAmountBase: totals.pmtAmount * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        Detail: detailData,
      });
      navigate('/ap/payment');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ap/payment');
  };

  const paymentNo = payment?.PmtNo ?? '...';
  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title={`Edit AP Payment: ${paymentNo}`}
        subtitle={`Created: ${formatDate(payment?.PmtDate)} | Vendor: ${payment?.VendorName ?? ''}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Payments', href: '/ap/payment' },
          { label: paymentNo },
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
                  {...form.getInputProps('PmtDate')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Vendor"
                  value={payment?.VendorName ?? ''}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Currency"
                  value={payment?.CurCode ?? 'THB'}
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
                  label="Bank"
                  placeholder="Select bank"
                  {...form.getInputProps('BankCode')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Cheque No"
                  placeholder="Enter cheque number"
                  {...form.getInputProps('ChqNo')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
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
                <Grid.Col span={3}>
                  <TextInput
                    label="Total Payment Amount"
                    value={formatCurrency(totals.pmtAmount, payment?.CurCode)}
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
