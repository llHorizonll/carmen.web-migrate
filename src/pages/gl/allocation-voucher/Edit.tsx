import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import {
  useAllocationVoucherDetail,
  useUpdateAllocationVoucher,
} from '../../../hooks/useAllocationVoucher';
import { formatDate, toISODate, fromMySqlDate } from '../../../utils/formatter';
import type { InlineColumn } from '../../../components/ui/InlineTable';
import type { AllocationVoucherDetail } from '../../../types';

const schema = z.object({
  AJvhDate: z.date({ required_error: 'Date is required' }),
  Prefix: z.string().min(1, 'Prefix is required'),
  Description: z.string().min(1, 'Description is required'),
});

type FormValues = z.infer<typeof schema>;

interface DetailLine {
  id: number;
  AJvdSeq: number;
  AJvhSeq: number;
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

export default function AllocationVoucherEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const AJvhSeq = parseInt(id ?? '0', 10);

  const { data: voucher, isLoading } = useAllocationVoucherDetail(AJvhSeq);
  const updateMutation = useUpdateAllocationVoucher();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      AJvhDate: new Date(),
      Prefix: '',
      Description: '',
    },
  });

  const [detailLines, setDetailLines] = useState<DetailLine[]>([]);
  const [nextId, setNextId] = useState(1);

  // Populate form when data is loaded
  useEffect(() => {
    if (voucher) {
      form.setValues({
        AJvhDate: fromMySqlDate(voucher.AJvhDate) ?? new Date(),
        Prefix: voucher.Prefix,
        Description: voucher.Description,
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
      AJvdSeq: 0,
      AJvhSeq,
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
      const detailData: AllocationVoucherDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        DimList: { Dim: [] },
      }));

      await updateMutation.mutateAsync({
        ...voucher,
        AJvhDate: toISODate(values.AJvhDate),
        Prefix: values.Prefix,
        Description: values.Description,
        Detail: detailData,
      });
      navigate('/gl/allocation-voucher');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/gl/allocation-voucher');
  };

  const voucherNo = voucher?.AJvhNo ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit Allocation Voucher: ${voucherNo}`}
        subtitle={`Created: ${formatDate(voucher?.AJvhDate)}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Allocation Vouchers', href: '/gl/allocation-voucher' },
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
                  label="Date"
                  placeholder="Select date"
                  required
                  {...form.getInputProps('AJvhDate')}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  label="Prefix"
                  placeholder="Select prefix"
                  required
                  data={[
                    { value: 'JV', label: 'JV' },
                    { value: 'AL', label: 'AL' },
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
