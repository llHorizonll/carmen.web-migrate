import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import {
  useApPaymentDetail,
  useUpdateApPayment,
} from '../../../hooks/useApPayment';
import { formatDate, toISODate, fromMySqlDate } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ApPaymentDetail } from '../../../types';

const schema = z.object({
  PmtNo: z.string().min(1, 'Payment number is required'),
  PmtDate: z.date({ required_error: 'Date is required' }),
  VendorId: z.number({ required_error: 'Vendor is required' }),
  CurCode: z.string().min(1, 'Currency is required'),
  CurRate: z.number().min(0.01, 'Rate must be greater than 0'),
  BankCode: z.string().optional(),
  ChqNo: z.string().optional(),
  ChqDate: z.date().optional(),
  Description: z.string().min(1, 'Description is required'),
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
      PmtNo: '',
      PmtDate: new Date(),
      VendorId: 0,
      CurCode: 'THB',
      CurRate: 1,
      BankCode: '',
      ChqNo: '',
      ChqDate: undefined,
      Description: '',
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (payment) {
      form.setValues({
        PmtNo: payment.PmtNo,
        PmtDate: fromMySqlDate(payment.PmtDate) ?? new Date(),
        VendorId: payment.VendorId,
        CurCode: payment.CurCode,
        CurRate: payment.CurRate,
        BankCode: payment.BankCode ?? '',
        ChqNo: payment.ChqNo ?? '',
        ChqDate: payment.ChqDate ? (fromMySqlDate(payment.ChqDate) ?? undefined) : undefined,
        Description: payment.Description,
      });
      const lines = (payment.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [payment]);

  const totalPayment = detailLines.reduce((sum, line) => sum + (line.PmtAmount || 0), 0);

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
    },
    {
      key: 'InvBalance',
      header: 'Balance',
      type: 'number',
      width: 130,
      editable: false,
    },
    {
      key: 'PmtAmount',
      header: 'Payment Amount',
      type: 'number',
      width: 130,
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

  const handleSubmit = async (values: FormValues) => {
    if (!payment) return;

    try {
      const detailData: ApPaymentDetail[] = detailLines.map((line, index) => ({
        ApPmtdSeq: line.ApPmtdSeq,
        ApPmtSeq: line.ApPmtSeq,
        ApInvhSeq: line.ApInvhSeq,
        InvNo: line.InvNo,
        InvAmount: line.InvAmount,
        InvBalance: line.InvBalance,
        PmtAmount: line.PmtAmount,
        index,
      }));

      await updateMutation.mutateAsync({
        ...(payment as NonNullable<typeof payment>),
        PmtNo: values.PmtNo,
        PmtDate: toISODate(values.PmtDate),
        VendorId: values.VendorId,
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        PmtAmount: totalPayment,
        PmtAmountBase: totalPayment * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        ChqDate: values.ChqDate ? toISODate(values.ChqDate) : undefined,
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
  const isVoid = payment?.Status === 'Void';

  return (
    <div>
      <PageHeader
        title={`Edit AP Payment: ${paymentNo}`}
        subtitle={`Date: ${formatDate(payment?.PmtDate)}`}
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
                <TextInput
                  label="Payment No"
                  placeholder="Enter payment number"
                  required
                  readOnly={isVoid}
                  {...form.getInputProps('PmtNo')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Payment Date"
                  placeholder="Select date"
                  required
                  readOnly={isVoid}
                  {...form.getInputProps('PmtDate')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Vendor"
                  placeholder="Select vendor"
                  required
                  data={[]} // Will be populated from API
                  readOnly={isVoid}
                  {...form.getInputProps('VendorId')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  label="Currency"
                  placeholder="Select"
                  required
                  data={[
                    { value: 'THB', label: 'THB' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                  ]}
                  readOnly={isVoid}
                  {...form.getInputProps('CurCode')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label="Exchange Rate"
                  placeholder="Rate"
                  required
                  min={0.01}
                  decimalScale={6}
                  readOnly={isVoid}
                  {...form.getInputProps('CurRate')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Bank Code"
                  placeholder="Enter bank code"
                  readOnly={isVoid}
                  {...form.getInputProps('BankCode')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Cheque No"
                  placeholder="Enter cheque number"
                  readOnly={isVoid}
                  {...form.getInputProps('ChqNo')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <DatePickerInput
                  label="Cheque Date"
                  placeholder="Select date"
                  readOnly={isVoid}
                  {...form.getInputProps('ChqDate')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Description"
                  placeholder="Enter description"
                  required
                  readOnly={isVoid}
                  {...form.getInputProps('Description')}
                />
              </Grid.Col>
            </Grid>

            <InlineTable
              data={detailLines}
              columns={detailColumns}
              onChange={setDetailLines}
              onRowAdd={isVoid ? undefined : handleAddRow}
              onRowDelete={isVoid ? undefined : handleDeleteRow}
              readOnly={isVoid}
              maxHeight={400}
            />

            <Paper withBorder p="md">
              <Grid gutter="md">
                <Grid.Col span={4}>
                  <NumberInput
                    label="Total Payment Amount"
                    value={totalPayment}
                    readOnly
                    decimalScale={2}
                    styles={{ input: { fontWeight: 'bold' } }}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Payment Amount (Base)"
                    value={totalPayment * (form.values.CurRate || 1)}
                    readOnly
                    decimalScale={2}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {!isVoid && (
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
            )}
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
