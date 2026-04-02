import { useNavigate } from 'react-router';
import {
  Paper,
  Button,
  Group,
  Stack,
  Textarea,
  Select,
  NumberInput,
  Grid,
  Title,
  Divider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconArrowLeft } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';

export default function RecurringVoucherCreate() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      Prefix: 'RC',
      Description: '',
      RecurringType: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly' | 'Yearly',
      StartDate: new Date(),
      EndDate: null as Date | null,
      Interval: 1,
      MaxOccurrences: null as number | null,
    },
    validate: {
      Prefix: (value) => (!value ? 'Prefix is required' : null),
      Description: (value) => (!value ? 'Description is required' : null),
      StartDate: (value) => (!value ? 'Start date is required' : null),
    },
  });

  const handleSubmit = async (_values: typeof form.values) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.show({
        title: 'Success',
        message: 'Recurring voucher created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/gl/recurring-voucher');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create recurring voucher',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Stack gap="md">
      <PageHeader
        title="Create Recurring Voucher"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Recurring Vouchers', href: '/gl/recurring-voucher' },
          { label: 'Create' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* Header Section */}
            <div>
              <Title order={4} mb="md">Header Information</Title>
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Prefix"
                    required
                    data={['RC', 'RV', 'ADJ']}
                    {...form.getInputProps('Prefix')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Recurring Type"
                    required
                    data={[
                      { value: 'Daily', label: 'Daily' },
                      { value: 'Weekly', label: 'Weekly' },
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Yearly', label: 'Yearly' },
                    ]}
                    {...form.getInputProps('RecurringType')}
                  />
                </Grid.Col>
              </Grid>
              <Textarea
                label="Description"
                placeholder="Enter recurring voucher description"
                required
                minRows={2}
                mt="md"
                {...form.getInputProps('Description')}
              />
            </div>

            <Divider />

            {/* Schedule Section */}
            <div>
              <Title order={4} mb="md">Schedule</Title>
              <Grid>
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="Start Date"
                    placeholder="Select start date"
                    required
                    {...form.getInputProps('StartDate')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="End Date (Optional)"
                    placeholder="Select end date"
                    clearable
                    {...form.getInputProps('EndDate')}
                  />
                </Grid.Col>
              </Grid>
              <Grid mt="md">
                <Grid.Col span={6}>
                  <NumberInput
                    label="Interval"
                    description="Every N periods"
                    min={1}
                    required
                    {...form.getInputProps('Interval')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Max Occurrences (Optional)"
                    description="Maximum number of times to run"
                    min={1}
                    {...form.getInputProps('MaxOccurrences')}
                  />
                </Grid.Col>
              </Grid>
            </div>

            <Divider />

            {/* Actions */}
            <Group justify="flex-end">
              <Button 
                variant="light" 
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/gl/recurring-voucher')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Recurring Voucher
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
