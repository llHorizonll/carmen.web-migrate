import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import {
  useAmortizationVoucherDetail,
  useUpdateAmortizationVoucher,
} from '../../../hooks/useAmortizationVoucher';
import { formatDate, toISODate, fromMySqlDate } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { StandardVoucherDetail } from '../../../types';

const schema = z.object({
  FJvhDate: z.date({ required_error: 'Date is required' }),
  Prefix: z.string().min(1, 'Prefix is required'),
  Description: z.string().min(1, 'Description is required'),
  StartDate: z.date({ required_error: 'Start date is required' }),
  EndDate: z.date({ required_error: 'End date is required' }),
  AmortizeType: z.string().min(1, 'Amortize type is required'),
  TotalPeriod: z.number().min(1, 'Total period must be at least 1'),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  FJvdSeq: number;
  FJvhSeq: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  CurCode: string;
  CurRate: number;
  DrAmount: number;
  DrBase: number;
  CrAmount: number;
  CrBase: number;
}

export default function AmortizationVoucherEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const FJvhSeq = parseInt(id ?? '0', 10);

  const { data: voucher, isLoading } = useAmortizationVoucherDetail(FJvhSeq);
  const updateMutation = useUpdateAmortizationVoucher();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      FJvhDate: new Date(),
      Prefix: '',
      Description: '',
      StartDate: new Date(),
      EndDate: new Date(),
      AmortizeType: 'Monthly',
      TotalPeriod: 12,
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (voucher) {
      form.setValues({
        FJvhDate: fromMySqlDate(voucher.FJvhDate) ?? new Date(),
        Prefix: voucher.Prefix,
        Description: voucher.Description,
        StartDate: fromMySqlDate(voucher.StartDate) ?? new Date(),
        EndDate: fromMySqlDate(voucher.EndDate) ?? new Date(),
        AmortizeType: voucher.AmortizeType,
        TotalPeriod: voucher.TotalPeriod,
      });
      const lines = (voucher.Detail ?? []).map((line, idx) => ({
        ...line,
        id: idx + 1,
      }));
      setDetailLines(lines);
      setNextId(lines.length + 1);
    }
  }, [voucher]);

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
      key: 'CurCode',
      header: 'Currency',
      type: 'text',
      width: 80,
      editable: true,
    },
    {
      key: 'DrAmount',
      header: 'Debit',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      key: 'CrAmount',
      header: 'Credit',
      type: 'number',
      width: 120,
      editable: true,
    },
  ];

  const handleAddRow = () => {
    const newRow: DetailLine = {
      id: nextId,
      FJvdSeq: 0,
      FJvhSeq,
      DeptCode: '',
      AccCode: '',
      Description: '',
      CurCode: 'THB',
      CurRate: 1,
      DrAmount: 0,
      DrBase: 0,
      CrAmount: 0,
      CrBase: 0,
    };
    setDetailLines((prev) => [...prev, newRow]);
    setNextId((prev) => prev + 1);
  };

  const handleDeleteRow = (index: number) => {
    setDetailLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: FormValues) => {
    if (!voucher) return;

    try {
      const detailData: StandardVoucherDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        DimList: { Dim: [] },
      }));

      await updateMutation.mutateAsync({
        ...voucher,
        FJvhDate: toISODate(values.FJvhDate),
        Prefix: values.Prefix,
        Description: values.Description,
        StartDate: toISODate(values.StartDate),
        EndDate: toISODate(values.EndDate),
        AmortizeType: values.AmortizeType,
        TotalPeriod: values.TotalPeriod,
        Detail: detailData,
      });
      navigate('/gl/amortization-voucher');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/gl/amortization-voucher');
  };

  const voucherNo = voucher?.FJvhNo ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit Amortization Voucher: ${voucherNo}`}
        subtitle={`Created: ${formatDate(voucher?.FJvhDate)}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Amortization Vouchers', href: '/gl/amortization-voucher' },
          { label: voucherNo },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Voucher Date"
                  placeholder="Select date"
                  required
                  {...form.getInputProps('FJvhDate')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  label="Prefix"
                  placeholder="Select prefix"
                  required
                  data={[
                    { value: 'JV', label: 'JV' },
                    { value: 'AM', label: 'AM' },
                  ]}
                  {...form.getInputProps('Prefix')}
                />
              </Grid.Col>
              <Grid.Col span={7}>
                <TextInput
                  label="Description"
                  placeholder="Enter description"
                  required
                  {...form.getInputProps('Description')}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md" mt="md">
              <Grid.Col span={3}>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Select start date"
                  required
                  {...form.getInputProps('StartDate')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <DatePickerInput
                  label="End Date"
                  placeholder="Select end date"
                  required
                  {...form.getInputProps('EndDate')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Amortize Type"
                  placeholder="Select type"
                  required
                  data={[
                    { value: 'Daily', label: 'Daily' },
                    { value: 'Weekly', label: 'Weekly' },
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Yearly', label: 'Yearly' },
                  ]}
                  {...form.getInputProps('AmortizeType')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Total Period"
                  placeholder="Enter period"
                  required
                  min={1}
                  {...form.getInputProps('TotalPeriod')}
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
