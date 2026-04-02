import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import { useCreateApInvoice } from '../../../hooks/useApInvoice';
import { toISODate } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ApInvoiceDetail } from '../../../types';

const schema = z.object({
  InvDate: z.date({ required_error: 'Date is required' }),
  VendorId: z.number({ required_error: 'Vendor is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurCode: z.string().min(1, 'Currency is required'),
  CurRate: z.number().min(0.0001, 'Rate must be greater than 0'),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  ApInvdSeq: number;
  ApInvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  Amount: number;
  AmountBase: number;
  VatCode?: string;
  VatAmount: number;
  WhtCode?: string;
  WhtAmount: number;
  NetAmount: number;
}

export default function ApInvoiceCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateApInvoice();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      InvDate: new Date(),
      VendorId: 0,
      Description: '',
      CurCode: 'THB',
      CurRate: 1,
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  const detailColumns: InlineColumn<DetailLine>[] = [
    {
      key: 'DeptCode',
      header: 'Dept',
      type: 'text',
      width: 100,
      editable: true,
    },
    {
      key: 'AccCode',
      header: 'Account',
      type: 'text',
      width: 120,
      editable: true,
    },
    {
      key: 'Description',
      header: 'Description',
      type: 'text',
      width: 200,
      editable: true,
    },
    {
      key: 'Amount',
      header: 'Amount',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      key: 'VatCode',
      header: 'VAT Code',
      type: 'text',
      width: 100,
      editable: true,
    },
    {
      key: 'VatAmount',
      header: 'VAT',
      type: 'number',
      width: 100,
      editable: true,
    },
    {
      key: 'WhtCode',
      header: 'WHT Code',
      type: 'text',
      width: 100,
      editable: true,
    },
    {
      key: 'WhtAmount',
      header: 'WHT',
      type: 'number',
      width: 100,
      editable: true,
    },
  ];

  const handleAddRow = () => {
    const newRow: DetailLine = {
      id: nextId,
      ApInvdSeq: 0,
      ApInvhSeq: 0,
      DeptCode: '',
      AccCode: '',
      Description: '',
      Amount: 0,
      AmountBase: 0,
      VatCode: '',
      VatAmount: 0,
      WhtCode: '',
      WhtAmount: 0,
      NetAmount: 0,
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
        invAmount: acc.invAmount + line.Amount,
        vatAmount: acc.vatAmount + line.VatAmount,
        whtAmount: acc.whtAmount + line.WhtAmount,
      }),
      { invAmount: 0, vatAmount: 0, whtAmount: 0 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const totals = calculateTotals();
      const detailData: ApInvoiceDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        AmountBase: line.Amount * values.CurRate,
      }));

      await createMutation.mutateAsync({
        InvNo: '',
        InvDate: toISODate(values.InvDate),
        VendorId: values.VendorId,
        VendorCode: '',
        VendorName: '',
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        InvAmount: totals.invAmount,
        InvAmountBase: totals.invAmount * values.CurRate,
        VatAmount: totals.vatAmount,
        WhtAmount: totals.whtAmount,
        NetAmount: totals.invAmount + totals.vatAmount - totals.whtAmount,
        Status: 'Draft',
        Detail: detailData,
        UserModified: '',
      });
      navigate('/ap/invoice');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ap/invoice');
  };

  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title="New AP Invoice"
        subtitle="Create a new accounts payable invoice"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Invoices', href: '/ap/invoice' },
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
                  {...form.getInputProps('InvDate')}
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
              <Grid.Col span={10}>
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
                  label="Invoice Amount"
                  value={totals.invAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="VAT Amount"
                  value={totals.vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="WHT Amount"
                  value={totals.whtAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Net Amount"
                  value={(totals.invAmount + totals.vatAmount - totals.whtAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
