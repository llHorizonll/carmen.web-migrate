import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck, IconCalculator } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import {
  useApInvoiceDetail,
  useUpdateApInvoice,
} from '../../../hooks/useApInvoice';
import { formatDate, toISODate, fromMySqlDate } from '../../../utils/formatter';
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

export default function ApInvoiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ApInvhSeq = parseInt(id ?? '0', 10);

  const { data: invoice, isLoading } = useApInvoiceDetail(ApInvhSeq);
  const updateMutation = useUpdateApInvoice();

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

  // Populate form when data is loaded
  useEffect(() => {
    if (invoice) {
      form.setValues({
        InvNo: invoice.InvNo,
        InvDate: fromMySqlDate(invoice.InvDate) ?? new Date(),
        VendorId: invoice.VendorId,
        CurCode: invoice.CurCode,
        CurRate: invoice.CurRate,
        Description: invoice.Description,
      });
      const lines = (invoice.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
        VatCode: line.VatCode ?? '',
        WhtCode: line.WhtCode ?? '',
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [invoice]);

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
      ApInvhSeq,
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
    if (!invoice) return;

    try {
      const detailData: ApInvoiceDetail[] = detailLines.map((line, index) => ({
        ApInvdSeq: line.ApInvdSeq,
        ApInvhSeq: line.ApInvhSeq,
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

      await updateMutation.mutateAsync({
        ...(invoice as NonNullable<typeof invoice>),
        InvNo: values.InvNo,
        InvDate: toISODate(values.InvDate),
        VendorId: values.VendorId,
        Description: values.Description,
        CurCode: values.CurCode,
        CurRate: values.CurRate,
        InvAmount: totals.invAmount,
        InvAmountBase: totals.invAmount * values.CurRate,
        VatAmount: totals.vatAmount,
        WhtAmount: totals.whtAmount,
        NetAmount: totals.netAmount,
        Detail: detailData,
      });
      navigate('/ap/invoice');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ap/invoice');
  };

  const invoiceNo = invoice?.InvNo ?? '...';
  const isVoid = invoice?.Status === 'Void';

  return (
    <div>
      <PageHeader
        title={`Edit AP Invoice: ${invoiceNo}`}
        subtitle={`Date: ${formatDate(invoice?.InvDate)}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Invoices', href: '/ap/invoice' },
          { label: invoiceNo },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Invoice No"
                  placeholder="Enter invoice number"
                  required
                  readOnly={isVoid}
                  {...form.getInputProps('InvNo')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Invoice Date"
                  placeholder="Select date"
                  required
                  readOnly={isVoid}
                  {...form.getInputProps('InvDate')}
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
              <Grid.Col span={8}>
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
