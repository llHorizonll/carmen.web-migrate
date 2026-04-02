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
  useArInvoiceDetail,
  useUpdateArInvoice,
} from '../../../hooks/useArInvoice';
import { formatDate, toISODate, fromMySqlDate, formatCurrency } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { ArInvoiceDetail } from '../../../types';

const schema = z.object({
  InvDate: z.date({ required_error: 'Date is required' }),
  Description: z.string().min(1, 'Description is required'),
  CurRate: z.number().min(0.0001, 'Rate must be greater than 0'),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  ArInvdSeq: number;
  ArInvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  Amount: number;
  AmountBase: number;
  VatCode?: string;
  VatAmount: number;
}

export default function ArInvoiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ArInvhSeq = parseInt(id ?? '0', 10);

  const { data: invoice, isLoading } = useArInvoiceDetail(ArInvhSeq);
  const updateMutation = useUpdateArInvoice();

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
      header: 'Department',
      type: 'text',
      width: 120,
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
      width: 250,
      editable: true,
    },
    {
      key: 'Amount',
      header: 'Amount',
      type: 'number',
      width: 130,
      editable: true,
      format: (value) => formatCurrency(value as number),
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
      header: 'VAT Amount',
      type: 'number',
      width: 120,
      editable: true,
      format: (value) => formatCurrency(value as number),
    },
  ];

  const handleAddRow = () => {
    const newRow: DetailLine = {
      id: nextId,
      ArInvdSeq: 0,
      ArInvhSeq,
      DeptCode: '',
      AccCode: '',
      Description: '',
      Amount: 0,
      AmountBase: 0,
      VatCode: '',
      VatAmount: 0,
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
        amount: acc.amount + line.Amount,
        vatAmount: acc.vatAmount + line.VatAmount,
      }),
      { amount: 0, vatAmount: 0 }
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (!invoice) return;

    try {
      const totals = calculateTotals();
      const detailData: ArInvoiceDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        AmountBase: line.Amount * values.CurRate,
      }));

      await updateMutation.mutateAsync({
        ...invoice,
        InvDate: toISODate(values.InvDate),
        Description: values.Description,
        CurRate: values.CurRate,
        InvAmount: totals.amount,
        InvAmountBase: totals.amount * values.CurRate,
        VatAmount: totals.vatAmount,
        NetAmount: totals.amount + totals.vatAmount,
        Detail: detailData,
      });
      navigate('/ar/invoice');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ar/invoice');
  };

  const invoiceNo = invoice?.InvNo ?? '...';
  const totals = calculateTotals();

  return (
    <div>
      <PageHeader
        title={`Edit AR Invoice: ${invoiceNo}`}
        subtitle={`Created: ${formatDate(invoice?.InvDate)} | Customer: ${invoice?.ProfileName ?? ''}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Invoices', href: '/ar/invoice' },
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
                  label="Customer"
                  value={invoice?.ProfileName ?? ''}
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
                    label="Total Amount"
                    value={formatCurrency(totals.amount, invoice?.CurCode)}
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
                    label="Net Amount"
                    value={formatCurrency(totals.amount + totals.vatAmount, invoice?.CurCode)}
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
