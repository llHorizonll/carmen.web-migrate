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
  useApInvoiceDetail,
  useUpdateApInvoice,
} from '../../../hooks/useApInvoice';
import { formatDate, toISODate, fromMySqlDate, formatCurrency } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ApInvoiceDetail } from '../../../types';

const schema = z.object({
  InvDate: z.date({ required_error: 'Date is required' }),
  Description: z.string().min(1, 'Description is required'),
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

export default function ApInvoiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ApInvhSeq = parseInt(id ?? '0', 10);

  const { data: invoice, isLoading } = useApInvoiceDetail(ApInvhSeq);
  const updateMutation = useUpdateApInvoice();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      InvDate: new Date(),
      Description: '',
      CurRate: 1,
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (invoice) {
      form.setValues({
        InvDate: fromMySqlDate(invoice.InvDate) ?? new Date(),
        Description: invoice.Description,
        CurRate: invoice.CurRate,
      });
      const lines = (invoice.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [invoice]);

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
      ApInvhSeq,
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
    if (!invoice) return;

    try {
      const totals = calculateTotals();
      const detailData: ApInvoiceDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        AmountBase: line.Amount * values.CurRate,
      }));

      await updateMutation.mutateAsync({
        ...invoice,
        InvDate: toISODate(values.InvDate),
        Description: values.Description,
        CurRate: values.CurRate,
        InvAmount: totals.invAmount,
        InvAmountBase: totals.invAmount * values.CurRate,
        VatAmount: totals.vatAmount,
        WhtAmount: totals.whtAmount,
        NetAmount: totals.invAmount + totals.vatAmount - totals.whtAmount,
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
  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title={`Edit AP Invoice: ${invoiceNo}`}
        subtitle={`Created: ${formatDate(invoice?.InvDate)} | Vendor: ${invoice?.VendorName ?? ''}`}
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
                  value={invoice?.VendorName ?? ''}
                  readOnly
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Currency"
                  value={invoice?.CurCode ?? 'THB'}
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
              <Grid.Col span={10}>
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
                    label="Invoice Amount"
                    value={formatCurrency(totals.invAmount, invoice?.CurCode)}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="VAT Amount"
                    value={formatCurrency(totals.vatAmount, invoice?.CurCode)}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="WHT Amount"
                    value={formatCurrency(totals.whtAmount, invoice?.CurCode)}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Net Amount"
                    value={formatCurrency(totals.invAmount + totals.vatAmount - totals.whtAmount, invoice?.CurCode)}
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
