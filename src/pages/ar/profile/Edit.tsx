import { useNavigate, useParams } from 'react-router';
import { Paper, Button, Group, Stack, TextInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useArProfileDetail, useUpdateArProfile, useDeleteArProfile } from '../../../hooks/useArProfile';

export default function ArProfileEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const profileId = parseInt(id ?? '0', 10);

  const { data: profile, isLoading } = useArProfileDetail(profileId);
  const updateMutation = useUpdateArProfile();
  const deleteMutation = useDeleteArProfile();

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
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValues({
        ProfileCode: profile.ProfileCode,
        ProfileName: profile.ProfileName,
        ContactPerson: profile.ContactPerson || '',
        Phone: profile.Phone || '',
        Email: profile.Email || '',
        Address: profile.Address || '',
        TaxId: profile.TaxId || '',
        ArTypeId: profile.ArTypeId,
        IsActive: profile.IsActive,
      });
    }
  }, [profile]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await updateMutation.mutateAsync({ ProfileId: profileId, ...values });
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/ar/profile');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(profileId);
      notifications.show({
        title: 'Success',
        message: 'Profile deleted successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/ar/profile');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete profile',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Stack gap="md">
      <PageHeader
        title={`Edit Profile: ${profile?.ProfileCode}`}
        breadcrumbs={[
          { label: 'AR', href: '/ar' },
          { label: 'Profiles', href: '/ar/profile' },
          { label: 'Edit' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Profile Code"
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
              required
              {...form.getInputProps('ProfileName')}
            />

            <Group grow>
              <TextInput
                label="Contact Person"
                {...form.getInputProps('ContactPerson')}
              />
              <TextInput
                label="Phone"
                {...form.getInputProps('Phone')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Email"
                {...form.getInputProps('Email')}
              />
              <TextInput
                label="Tax ID"
                {...form.getInputProps('TaxId')}
              />
            </Group>

            <Textarea
              label="Address"
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
              <Button variant="light" color="red" leftSection={<IconTrash size={16} />} onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="light" onClick={() => navigate('/ar/profile')}>
                Cancel
              </Button>
              <Button type="submit" loading={updateMutation.isPending}>
                Update Profile
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
