import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, TextInput, Select, NumberInput, LoadingOverlay } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  useArProfileDetail,
  useUpdateArProfile,
} from '../../../hooks/useArProfile';


const schema = z.object({
  ProfileCode: z.string().min(1, 'Profile code is required'),
  ProfileName: z.string().min(1, 'Profile name is required'),
  ArTypeId: z.number({ required_error: 'AR type is required' }),
  TitleId: z.number().optional(),
  OwnerId: z.number().optional(),
  ProjectId: z.number().optional(),
  Address: z.string().optional(),
  TaxId: z.string().optional(),
  ContactPerson: z.string().optional(),
  Phone: z.string().optional(),
  Email: z.string().email('Invalid email').optional().or(z.literal('')),
  CreditLimit: z.number().min(0, 'Credit limit must be positive'),
  CurCode: z.string().min(1, 'Currency is required'),
  IsActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ArProfileEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ProfileId = parseInt(id ?? '0', 10);

  const { data: profile, isLoading } = useArProfileDetail(ProfileId);
  const updateMutation = useUpdateArProfile();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      ProfileCode: '',
      ProfileName: '',
      ArTypeId: 0,
      TitleId: undefined,
      OwnerId: undefined,
      ProjectId: undefined,
      Address: '',
      TaxId: '',
      ContactPerson: '',
      Phone: '',
      Email: '',
      CreditLimit: 0,
      CurCode: 'THB',
      IsActive: true,
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (profile) {
      form.setValues({
        ProfileCode: profile.ProfileCode,
        ProfileName: profile.ProfileName,
        ArTypeId: profile.ArTypeId,
        TitleId: profile.TitleId,
        OwnerId: profile.OwnerId,
        ProjectId: profile.ProjectId,
        Address: profile.Address ?? '',
        TaxId: profile.TaxId ?? '',
        ContactPerson: profile.ContactPerson ?? '',
        Phone: profile.Phone ?? '',
        Email: profile.Email ?? '',
        CreditLimit: profile.CreditLimit,
        CurCode: profile.CurCode,
        IsActive: profile.IsActive,
      });
    }
  }, [profile]);

  const handleSubmit = async (values: FormValues) => {
    if (!profile) return;

    try {
      await updateMutation.mutateAsync({
        ...profile,
        ProfileCode: values.ProfileCode,
        ProfileName: values.ProfileName,
        ArTypeId: values.ArTypeId,
        TitleId: values.TitleId,
        OwnerId: values.OwnerId,
        ProjectId: values.ProjectId,
        Address: values.Address,
        TaxId: values.TaxId,
        ContactPerson: values.ContactPerson,
        Phone: values.Phone,
        Email: values.Email,
        CreditLimit: values.CreditLimit,
        CurCode: values.CurCode,
        IsActive: values.IsActive,
      });
      navigate('/ar/profile');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ar/profile');
  };

  const profileCode = profile?.ProfileCode ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit AR Profile: ${profileCode}`}
        subtitle={`${profile?.ProfileName ?? ''}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Receivable' },
          { label: 'Profiles', href: '/ar/profile' },
          { label: profileCode },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Profile Code"
                  placeholder="Enter code"
                  required
                  {...form.getInputProps('ProfileCode')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Profile Name"
                  placeholder="Enter name"
                  required
                  {...form.getInputProps('ProfileName')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Status"
                  required
                  data={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
                  ]}
                  value={form.values.IsActive ? 'true' : 'false'}
                  onChange={(value) => form.setFieldValue('IsActive', value === 'true')}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="AR Type"
                  placeholder="Select type"
                  required
                  {...form.getInputProps('ArTypeId')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Title"
                  placeholder="Select title"
                  {...form.getInputProps('TitleId')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Owner"
                  placeholder="Select owner"
                  {...form.getInputProps('OwnerId')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Project"
                  placeholder="Select project"
                  {...form.getInputProps('ProjectId')}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label="Address"
                  placeholder="Enter address"
                  {...form.getInputProps('Address')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <TextInput
                  label="Tax ID"
                  placeholder="Enter tax ID"
                  {...form.getInputProps('TaxId')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  required
                  data={[
                    { value: 'THB', label: 'THB - Thai Baht' },
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                  ]}
                  {...form.getInputProps('CurCode')}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col span={4}>
                <TextInput
                  label="Contact Person"
                  placeholder="Enter contact person"
                  {...form.getInputProps('ContactPerson')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Phone"
                  placeholder="Enter phone"
                  {...form.getInputProps('Phone')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Email"
                  placeholder="Enter email"
                  {...form.getInputProps('Email')}
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col span={3}>
                <NumberInput
                  label="Credit Limit"
                  placeholder="Enter credit limit"
                  required
                  min={0}
                  decimalScale={2}
                  {...form.getInputProps('CreditLimit')}
                />
              </Grid.Col>
            </Grid>

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
