import { useNavigate } from 'react-router';
import { Paper, Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreateJv } from '../../../hooks/useJournalVoucher';
import type { JournalVoucher } from '../../../types';

export default function JournalVoucherCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateJv();

  const form = useForm({
    initialValues: {
      JvhDate: new Date(),
      Prefix: 'JV',
      Description: '',
    },
    validate: {
      Prefix: (value) => (!value ? 'Prefix is required' : null),
      Description: (value) => (!value ? 'Description is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createMutation.mutateAsync(values as unknown as Omit<JournalVoucher, 'JvhSeq'>);
      notifications.show({
        title: 'Success',
        message: 'Journal Voucher created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/gl/journal-voucher');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create journal voucher',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Stack gap="md">
      <PageHeader
        title="Create Journal Voucher"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Journal Vouchers', href: '/gl/journal-voucher' },
          { label: 'Create' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <DatePickerInput
                label="Date"
                required
                {...form.getInputProps('JvhDate')}
              />
              <TextInput
                label="Prefix"
                placeholder="JV"
                required
                {...form.getInputProps('Prefix')}
              />
            </Group>

            <Textarea
              label="Description"
              placeholder="Enter description"
              required
              minRows={3}
              {...form.getInputProps('Description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => navigate('/gl/journal-voucher')}>
                Cancel
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                Create JV
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
