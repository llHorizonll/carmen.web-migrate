import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck, IconCalculator } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import { useCreateApInvoice } from '../../../hooks/useApInvoice';
import { toISODate } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ApInvoiceDetail } from '../../../types';

const schema = z.object({
  InvNo: z.string().min(1, 'Invoice number is required'),
  InvDate: z.date({ required_error: 'Date is required' }),
  VendorId: z.number({ required_error: 'Vendor is required' }),
  CurCode: z.string().min(1, 'Currency is required'),
  CurRate: z.number().min(0.01, 'Rate must be greater than 0'),
  Description: z.string().min(1, 'Description is required'),
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
  VatCode: string;
  VatAmount: number;
  WhtCode: string;
  WhtAmount: number;
  NetAmount: number;
}

export default function ApInvoiceCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateApInvoice();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      InvNo: '',
      InvDate: new Date(),
      VendorId: 0,
      CurCode: 'THB',
      CurRate: 1,
      Description: '',
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Calculate totals
  const totals = useMemo(() => {
    const invAmount = detailLines.reduce((sum, line) => sum + (line.Amount || 0), 0);
    const vatAmount = detailLines.reduce((sum, line) => sum + (line.VatAmount || 0), 0);
    const whtAmount = detailLines.reduce((sum, line) => sum + (line.WhtAmount || 0), 0);
    const netAmount = invAmount + vatAmount - whtAmount;
    return { invAmount, vatAmount, whtAmount, netAmount };
  }, [detailLines]);

  const detailColumns: InlineColumn<DetailLine>[] = [
    {
      key: 'AccCode',
      header: 'Account',
      type: 'text',
      width: 120,
      editable: true,
    },
    {
      key: 'DeptCode',
      header: 'Dept',
      type: 'text',
      width: 100,
      editable: true,
    },
    {
      key: 'Description',
      header: 'Description',
      type: 'text',
      width: 250,
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
      key: 'WhtCode',
      header: 'WHT Code',
      type: 'text',
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

  const handleSubmit = async (values: FormValues) => {
    try {
      const detailData: ApInvoiceDetail[] = detailLines.map((line, index) => ({
        ApInvdSeq: 0,
        ApInvhSeq: 0,
        DeptCode: line.DeptCode,
        AccCode: line.AccCode,
        Description: line.Description,
        Amount: line.Amount,
        AmountBase: line.Amount * values.CurRate,
        VatCode: line.VatCode || undefined,
        VatAmount: line.VatAmount,
        WhtCode: line.WhtCode || undefined,
        WhtAmount: line.WhtAmount,
        NetAmount: line.Amount + line.VatAmount - line.WhtAmount,
        index,
      }));

      await createMutation.mutateAsync({
        InvNo: values.InvNo,
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
        NetAmount: totals.netAmount,
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
                <TextInput
                  label="Invoice No"
                  placeholder="Enter invoice number"
                  required
                  {...form.getInputProps('InvNo')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Invoice Date"
                  placeholder="Select date"
                  required
                  {...form.getInputProps('InvDate')}
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
              <Grid.Col span={8}>
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
                <NumberInput
                  label="Invoice Amount"
                  value={totals.invAmount}
                  readOnly
                  decimalScale={2}
                  leftSection={<IconCalculator size={16} />}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="VAT Amount"
                  value={totals.vatAmount}
                  readOnly
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="WHT Amount"
                  value={totals.whtAmount}
                  readOnly
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Net Amount"
                  value={totals.netAmount}
                  readOnly
                  decimalScale={2}
                  styles={{ input: { fontWeight: 'bold' } }}
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
