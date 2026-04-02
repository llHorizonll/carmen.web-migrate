import { useNavigate, useParams } from 'react-router';
import { Paper, Button, Group, Stack, TextInput, Select, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useArReceiptDetail, useUpdateArReceipt } from '../../../hooks/useArReceipt';
import type { ArReceipt } from '../../../types/models';

export default function ArReceiptEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const receiptId = parseInt(id ?? '0', 10);

  const { data: receipt, isLoading } = useArReceiptDetail(receiptId);
  const updateMutation = useUpdateArReceipt();

  const form = useForm({
    initialValues: {
      RcptDate: new Date(),
      ProfileId: 0,
      RcptAmount: 0,
      CurCode: 'THB',
      CurRate: 1,
      Description: '',
      BankCode: '',
    },
  });

  useEffect(() => {
    if (receipt) {
      form.setValues({
        RcptDate: new Date(receipt.RcptDate),
        ProfileId: receipt.ProfileId,
        RcptAmount: receipt.RcptAmount,
        CurCode: receipt.CurCode,
        CurRate: receipt.CurRate,
        Description: receipt.Description || '',
        BankCode: receipt.BankCode || '',
      });
    }
  }, [receipt]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (!receipt) return;
      const payload: ArReceipt = {
        ...receipt,
        ...values,
        RcptDate: values.RcptDate.toISOString().split('T')[0],
        RcptAmountBase: values.RcptAmount * values.CurRate,
      };
      await updateMutation.mutateAsync(payload);
      notifications.show({
        title: 'Success',
        message: 'Receipt updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/ar/receipt');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update receipt',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Stack gap="md">
      <PageHeader
        title={`Edit Receipt: ${receipt?.RcptNo}`}
        breadcrumbs={[
          { label: 'AR', href: '/ar' },
          { label: 'Receipts', href: '/ar/receipt' },
          { label: 'Edit' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <DatePickerInput
                label="Receipt Date"
                required
                {...form.getInputProps('RcptDate')}
              />
              <Select
                label="Payment Method"
                data={[
                  { value: '', label: 'Cash' },
                  { value: 'CHQ', label: 'Cheque' },
                  { value: 'TRF', label: 'Bank Transfer' },
                  { value: 'CC', label: 'Credit Card' },
                ]}
                {...form.getInputProps('BankCode')}
              />
            </Group>

            <NumberInput
              label="Profile ID"
              required
              min={1}
              {...form.getInputProps('ProfileId')}
            />

            <Group grow>
              <NumberInput
                label="Amount"
                required
                min={0}
                decimalScale={2}
                {...form.getInputProps('RcptAmount')}
              />
              <TextInput
                label="Currency"
                {...form.getInputProps('CurCode')}
              />
              <NumberInput
                label="Exchange Rate"
                decimalScale={4}
                {...form.getInputProps('CurRate')}
              />
            </Group>

            <TextInput
              label="Description"
              {...form.getInputProps('Description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => navigate('/ar/receipt')}>
                Cancel
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                Update Receipt
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
