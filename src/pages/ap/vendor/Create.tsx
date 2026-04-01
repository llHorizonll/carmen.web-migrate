import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, Switch } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreateApVendor } from '../../../hooks/useApVendor';

const schema = z.object({
  VendorCode: z.string().min(1, 'Vendor code is required'),
  VendorName: z.string().min(1, 'Vendor name is required'),
  Address: z.string().optional(),
  TaxId: z.string().optional(),
  ContactPerson: z.string().optional(),
  Phone: z.string().optional(),
  Email: z.string().email('Invalid email').optional().or(z.literal('')),
  CurCode: z.string().min(1, 'Currency is required'),
  PaymentTerms: z.string().optional(),
  IsActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function ApVendorCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateApVendor();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      VendorCode: '',
      VendorName: '',
      Address: '',
      TaxId: '',
      ContactPerson: '',
      Phone: '',
      Email: '',
      CurCode: 'THB',
      PaymentTerms: '',
      IsActive: true,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await createMutation.mutateAsync({
        VendorCode: values.VendorCode,
        VendorName: values.VendorName,
        Address: values.Address,
        TaxId: values.TaxId,
        ContactPerson: values.ContactPerson,
        Phone: values.Phone,
        Email: values.Email,
        CurCode: values.CurCode,
        PaymentTerms: values.PaymentTerms,
        IsActive: values.IsActive,
      });
      navigate('/ap/vendor');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/ap/vendor');
  };

  return (
    <div>
      <PageHeader
        title="New Vendor"
        subtitle="Create a new vendor"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Vendors', href: '/ap/vendor' },
          { label: 'New' },
        ]}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
                <TextInput
                  label="Vendor Code"
                  placeholder="Enter vendor code"
                  required
                  {...form.getInputProps('VendorCode')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Vendor Name"
                  placeholder="Enter vendor name"
                  required
                  {...form.getInputProps('VendorName')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  label="Currency"
                  placeholder="Select"
                  required
                  data={[
                    { value: 'THB', label: 'THB' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                  ]}
                  {...form.getInputProps('CurCode')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address"
                  placeholder="Enter address"
                  {...form.getInputProps('Address')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Tax ID"
                  placeholder="Enter tax ID"
                  {...form.getInputProps('TaxId')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Contact Person"
                  placeholder="Enter contact person"
                  {...form.getInputProps('ContactPerson')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Payment Terms"
                  placeholder="Enter payment terms"
                  {...form.getInputProps('PaymentTerms')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Phone"
                  placeholder="Enter phone number"
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
              <Grid.Col span={4}>
                <Switch
                  label="Active"
                  mt="lg"
                  {...form.getInputProps('IsActive', { type: 'checkbox' })}
                />
              </Grid.Col>
            </Grid>
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
