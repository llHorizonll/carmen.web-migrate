import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { InlineTable } from '../../../components/ui/InlineTable';
import { useCreateAllocationVoucher } from '../../../hooks/useAllocationVoucher';
import { toISODate } from '../../../utils/formatter';
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

export default function AllocationVoucherCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateAllocationVoucher();

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
      AJvhSeq: 0,
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
    try {
      const detailData: AllocationVoucherDetail[] = detailLines.map((line, index) => ({
        ...line,
        index,
        DimList: { Dim: [] },
      }));

      await createMutation.mutateAsync({
        AJvhDate: toISODate(values.AJvhDate),
        Prefix: values.Prefix,
        AJvhNo: '',
        Status: 'Draft',
        Description: values.Description,
        SourceJvId: 0,
        Detail: detailData,
        DimHList: { Dim: [] },
        UserModified: '',
      });
      navigate('/gl/allocation-voucher');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/gl/allocation-voucher');
  };

  return (
    <div>
      <PageHeader
        title="New Allocation Voucher"
        subtitle="Create a new allocation journal voucher"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'General Ledger' },
          { label: 'Allocation Vouchers', href: '/gl/allocation-voucher' },
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
