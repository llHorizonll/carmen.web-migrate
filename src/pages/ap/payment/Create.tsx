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
  PmtDate: z.date({ required_error: 'Date is required' }),
  VendorId: z.number({ required_error: 'Vendor is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurCode: z.string().min(1, 'Currency is required'),
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

export default function ApPaymentCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateApPayment();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      PmtDate: new Date(),
      VendorId: 0,
      Description: '',
      CurCode: 'THB',
      CurRate: 1,
      BankCode: '',
      ChqNo: '',
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

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

  const calculateTotals = () => {
    return detailLines.reduce(
      (acc, line) => ({
        pmtAmount: acc.pmtAmount + line.PmtAmount,
      }),
      { pmtAmount: 0 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const totals = calculateTotals();
      const detailData: ApPaymentDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
      }));

      await createMutation.mutateAsync({
        PmtNo: '',
        PmtDate: toISODate(values.PmtDate),
        VendorId: values.VendorId,
        VendorCode: '',
        VendorName: '',
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        PmtAmount: totals.pmtAmount,
        PmtAmountBase: totals.pmtAmount * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        ChqDate: toISODate(values.PmtDate),
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

  const totals = calculateTotals();

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
                  placeholder="Select vendor"
                  required
                  {...form.getInputProps('VendorId')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  required
                  data={[
                    { value: 'THB', label: 'THB' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                  ]}
                  {...form.getInputProps('CurCode')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" mt="xs">
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
              <Grid.Col span={3}>
                <TextInput
                  label="Total Payment Amount"
                  value={totals.pmtAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
