import { useNavigate, useParams } from 'react-router';
import { Paper, Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useJvDetail, useUpdateJv } from '../../../hooks/useJournalVoucher';
import type { JournalVoucher } from '../../../types';

export default function JournalVoucherEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jvhSeq = parseInt(id ?? '0', 10);

  const { data: jv, isLoading } = useJvDetail(jvhSeq);
  const updateMutation = useUpdateJv();

  const form = useForm({
    initialValues: {
      JvhDate: new Date(),
      Prefix: '',
      Description: '',
    },
  });

  useEffect(() => {
    if (jv) {
      form.setValues({
        JvhDate: new Date(jv.JvhDate),
        Prefix: jv.Prefix,
        Description: jv.Description,
      });
    }
  }, [jv]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await updateMutation.mutateAsync({
        ...jv,
        JvhDate: values.JvhDate.toISOString(),
        Prefix: values.Prefix,
        Description: values.Description,
      } as JournalVoucher);
      notifications.show({
        title: 'Success',
        message: 'Journal Voucher updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/gl/journal-voucher');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update journal voucher',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Stack gap="md">
      <PageHeader
        title={`Edit JV: ${jv?.JvhNo}`}
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Journal Vouchers', href: '/gl/journal-voucher' },
          { label: 'Edit' },
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
                required
                {...form.getInputProps('Prefix')}
              />
            </Group>

            <Textarea
              label="Description"
              required
              minRows={3}
              {...form.getInputProps('Description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => navigate('/gl/journal-voucher')}>
                Cancel
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                Update JV
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
