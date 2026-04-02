import { useNavigate } from 'react-router';
import { Paper, Button, Group, Stack, TextInput, Select, Textarea, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreateArProfile } from '../../../hooks/useArProfile';

export default function ArProfileCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateArProfile();

  const form = useForm({
    initialValues: {
      ProfileCode: '',
      ProfileName: '',
      ContactPerson: '',
      Phone: '',
      Email: '',
      Address: '',
      TaxId: '',
      ArTypeId: 1,
      IsActive: true,
      CurCode: 'THB',
      CreditLimit: 0,
    },
    validate: {
      ProfileCode: (value) => (!value ? 'Profile code is required' : null),
      ProfileName: (value) => (!value ? 'Profile name is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createMutation.mutateAsync(values);
      notifications.show({
        title: 'Success',
        message: 'Profile created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/ar/profile');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create profile',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Stack gap="md">
      <PageHeader
        title="Create AR Profile"
        breadcrumbs={[
          { label: 'AR', href: '/ar' },
          { label: 'Profiles', href: '/ar/profile' },
          { label: 'Create' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Profile Code"
                placeholder="Enter profile code"
                required
                {...form.getInputProps('ProfileCode')}
              />
              <Select
                label="AR Type"
                data={[
                  { value: '1', label: 'Customer' },
                  { value: '2', label: 'Agent' },
                  { value: '3', label: 'Corporate' },
                ]}
                {...form.getInputProps('ArTypeId')}
              />
            </Group>

            <TextInput
              label="Profile Name"
              placeholder="Enter profile name"
              required
              {...form.getInputProps('ProfileName')}
            />

            <Group grow>
              <TextInput
                label="Contact Person"
                placeholder="Enter contact person"
                {...form.getInputProps('ContactPerson')}
              />
              <TextInput
                label="Phone"
                placeholder="Enter phone number"
                {...form.getInputProps('Phone')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Email"
                placeholder="Enter email"
                {...form.getInputProps('Email')}
              />
              <TextInput
                label="Tax ID"
                placeholder="Enter tax ID"
                {...form.getInputProps('TaxId')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Currency"
                {...form.getInputProps('CurCode')}
              />
              <NumberInput
                label="Credit Limit"
                {...form.getInputProps('CreditLimit')}
              />
            </Group>

            <Textarea
              label="Address"
              placeholder="Enter address"
              minRows={3}
              {...form.getInputProps('Address')}
            />

            <Select
              label="Status"
              data={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              {...form.getInputProps('IsActive')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => navigate('/ar/profile')}>
                Cancel
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                Create Profile
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
