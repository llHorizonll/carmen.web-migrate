import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, Switch, LoadingOverlay } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  useApVendorDetail,
  useUpdateApVendor,
} from '../../../hooks/useApVendor';

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

export default function ApVendorEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const VendorId = parseInt(id ?? '0', 10);

  const { data: vendor, isLoading } = useApVendorDetail(VendorId);
  const updateMutation = useUpdateApVendor();

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

  // Populate form when data is loaded
  useEffect(() => {
    if (vendor) {
      form.setValues({
        VendorCode: vendor.VendorCode,
        VendorName: vendor.VendorName,
        Address: vendor.Address ?? '',
        TaxId: vendor.TaxId ?? '',
        ContactPerson: vendor.ContactPerson ?? '',
        Phone: vendor.Phone ?? '',
        Email: vendor.Email ?? '',
        CurCode: vendor.CurCode,
        PaymentTerms: vendor.PaymentTerms ?? '',
        IsActive: vendor.IsActive,
      });
    }
  }, [vendor]);

  const handleSubmit = async (values: FormValues) => {
    if (!vendor) return;

    try {
      await updateMutation.mutateAsync({
        ...vendor,
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

  const vendorCode = vendor?.VendorCode ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit Vendor: ${vendorCode}`}
        subtitle="Update vendor information"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Accounts Payable' },
          { label: 'Vendors', href: '/ap/vendor' },
          { label: vendorCode },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
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
