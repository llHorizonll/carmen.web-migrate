import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import { useCreateArReceipt } from '../../../hooks/useArReceipt';
import { toISODate, formatCurrency } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ArReceiptDetail } from '../../../types';

const schema = z.object({
  RcptDate: z.date({ required_error: 'Date is required' }),
  ProfileId: z.number({ required_error: 'Customer is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurCode: z.string().min(1, 'Currency is required'),
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

export default function ArReceiptCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateArReceipt();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      RcptDate: new Date(),
      ProfileId: 0,
      Description: '',
      CurCode: 'THB',
      CurRate: 1,
      BankCode: '',
      ChqNo: '',
      ChqDate: null,
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
      ArRcptSeq: 0,
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
    try {
      const totals = calculateTotals();
      const detailData: ArReceiptDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
      }));

      await createMutation.mutateAsync({
        RcptDate: toISODate(values.RcptDate),
        RcptNo: '',

        ProfileId: values.ProfileId,
        ProfileCode: '',
        ProfileName: '',
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        RcptAmount: totals.rcptAmount,
        RcptAmountBase: totals.rcptAmount * values.CurRate,
        BankCode: values.BankCode,
        ChqNo: values.ChqNo,
        ChqDate: values.ChqDate ? toISODate(values.ChqDate) : undefined,
        Status: 'Draft',
        Detail: detailData,
        UserModified: '',
      });
      navigate('/ar/receipt');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ar/receipt');
  };

  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title="New AR Receipt"
        subtitle="Create a new accounts receivable receipt"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Receipts', href: '/ar/receipt' },
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
                  {...form.getInputProps('RcptDate')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Customer"
                  placeholder="Select customer"
                  required
                  {...form.getInputProps('ProfileId')}
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
            <Grid gutter="md" mt="xs">
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
                <TextInput
                  label="Total Receipt Amount"
                  value={formatCurrency(totals.rcptAmount, form.values.CurCode)}
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
