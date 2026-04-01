import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import { useCreateApPayment } from '../../../hooks/useApPayment';
import { toISODate } from '../../../utils/formatter';
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

export default function ApPaymentCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateApPayment();

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
      ApPmtSeq: 0,
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
    try {
      const detailData: ApPaymentDetail[] = detailLines.map((line, index) => ({
        ApPmtdSeq: 0,
        ApPmtSeq: 0,
        ApInvhSeq: line.ApInvhSeq,
        InvNo: line.InvNo,
        InvAmount: line.InvAmount,
        InvBalance: line.InvBalance,
        PmtAmount: line.PmtAmount,
        index,
      }));

      await createMutation.mutateAsync({
        PmtNo: values.PmtNo,
        PmtDate: toISODate(values.PmtDate),
        VendorId: values.VendorId,
        VendorCode: '',
        VendorName: '',
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        PmtAmount: totalPayment,
        PmtAmountBase: totalPayment * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        ChqDate: values.ChqDate ? toISODate(values.ChqDate) : undefined,
        Status: 'Draft',
        Detail: detailData,
        UserModified: '',
      });
      navigate('/ap/payment');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ap/payment');
  };

  return (
    <div>
      <PageHeader
        title="New AP Payment"
        subtitle="Create a new accounts payable payment"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Payments', href: '/ap/payment' },
          { label: 'New' },
        ]}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Payment No"
                  placeholder="Enter payment number"
                  required
                  {...form.getInputProps('PmtNo')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Payment Date"
                  placeholder="Select date"
                  required
                  {...form.getInputProps('PmtDate')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Vendor"
                  placeholder="Select vendor"
                  required
                  data={[]} // Will be populated from API
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
                  placeholder="Enter cheque number"
                  {...form.getInputProps('ChqNo')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <DatePickerInput
                  label="Cheque Date"
                  placeholder="Select date"
                  {...form.getInputProps('ChqDate')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Description"
                  placeholder="Enter description"
                  required
                  {...form.getInputProps('Description')}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper withBorder p="md">
            <InlineTable
              data={detailLines}
              columns={detailColumns}
              onChange={setDetailLines}
              onRowAdd={handleAddRow}
              onRowDelete={handleDeleteRow}
              maxHeight={400}
            />
          </Paper>

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
              loading={createMutation.isPending}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
}
