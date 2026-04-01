import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreatePreAsset } from '../../../hooks/useAssetRegister';
import { toISODate } from '../../../utils/formatter';

const schema = z.object({
  AssetCode: z.string().min(1, 'Asset code is required'),
  AssetName: z.string().min(1, 'Asset name is required'),
  CategoryId: z.number({ required_error: 'Category is required' }),
  DepartmentId: z.number({ required_error: 'Department is required' }),
  LocationId: z.number().optional(),
  VendorId: z.number().optional(),
  PurchaseDate: z.date({ required_error: 'Purchase date is required' }),
  PurchasePrice: z.number({ required_error: 'Purchase price is required' }),
  CurCode: z.string().min(1, 'Currency is required'),
  DepreciationMethod: z.string().min(1, 'Depreciation method is required'),
  UsefulLife: z.number({ required_error: 'Useful life is required' }),
  SalvageValue: z.number().default(0),
});

type FormValues = z.infer<typeof schema>;

export default function PreAssetCreate() {
  const navigate = useNavigate();
  const createMutation = useCreatePreAsset();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      AssetCode: '',
      AssetName: '',
      CategoryId: 0,
      DepartmentId: 0,
      LocationId: undefined,
      VendorId: undefined,
      PurchaseDate: new Date(),
      PurchasePrice: 0,
      CurCode: 'THB',
      DepreciationMethod: 'Straight Line',
      UsefulLife: 5,
      SalvageValue: 0,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await createMutation.mutateAsync({
        AssetCode: values.AssetCode,
        AssetName: values.AssetName,
        CategoryId: values.CategoryId,
        CategoryName: '',
        DepartmentId: values.DepartmentId,
        DepartmentName: '',
        LocationId: values.LocationId,
        LocationName: '',
        VendorId: values.VendorId,
        VendorName: '',
        PurchaseDate: toISODate(values.PurchaseDate),
        PurchasePrice: values.PurchasePrice,
        CurCode: values.CurCode,
        DepreciationMethod: values.DepreciationMethod,
        UsefulLife: values.UsefulLife,
        SalvageValue: values.SalvageValue,
        AccumulatedDepreciation: 0,
        NetBookValue: values.PurchasePrice,
        Status: 'Active',
      });
      navigate('/asset/pre-asset');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/asset/pre-asset');
  };

  return (
    <div>
      <PageHeader
        title="New Pre-Asset"
        subtitle="Register an asset not yet capitalized"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Pre-Asset Register', href: '/asset/pre-asset' },
          { label: 'New' },
        ]}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  label="Asset Code"
                  placeholder="Enter asset code"
                  required
                  {...form.getInputProps('AssetCode')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Asset Name"
                  placeholder="Enter asset name"
                  required
                  {...form.getInputProps('AssetName')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Category"
                  placeholder="Select category"
                  required
                  data={[
                    { value: '1', label: 'Building' },
                    { value: '2', label: 'Vehicle' },
                    { value: '3', label: 'Equipment' },
                    { value: '4', label: 'Furniture' },
                    { value: '5', label: 'Computer' },
                  ]}
                  value={form.values.CategoryId ? String(form.values.CategoryId) : null}
                  onChange={(value) => form.setFieldValue('CategoryId', value ? parseInt(value, 10) : 0)}
                  error={form.errors.CategoryId}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Department"
                  placeholder="Select department"
                  required
                  data={[
                    { value: '1', label: 'Administration' },
                    { value: '2', label: 'Sales' },
                    { value: '3', label: 'Marketing' },
                    { value: '4', label: 'IT' },
                    { value: '5', label: 'Finance' },
                  ]}
                  value={form.values.DepartmentId ? String(form.values.DepartmentId) : null}
                  onChange={(value) => form.setFieldValue('DepartmentId', value ? parseInt(value, 10) : 0)}
                  error={form.errors.DepartmentId}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Location"
                  placeholder="Select location"
                  data={[
                    { value: '1', label: 'Head Office' },
                    { value: '2', label: 'Branch 1' },
                    { value: '3', label: 'Warehouse' },
                  ]}
                  value={form.values.LocationId ? String(form.values.LocationId) : null}
                  onChange={(value) => form.setFieldValue('LocationId', value ? parseInt(value, 10) : undefined)}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Vendor"
                  placeholder="Select vendor"
                  data={[
                    { value: '1', label: 'Supplier A' },
                    { value: '2', label: 'Supplier B' },
                    { value: '3', label: 'Supplier C' },
                  ]}
                  value={form.values.VendorId ? String(form.values.VendorId) : null}
                  onChange={(value) => form.setFieldValue('VendorId', value ? parseInt(value, 10) : undefined)}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Purchase Date"
                  placeholder="Select purchase date"
                  required
                  {...form.getInputProps('PurchaseDate')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
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
              <Grid.Col span={4}>
                <NumberInput
                  label="Purchase Price"
                  placeholder="Enter purchase price"
                  required
                  min={0}
                  decimalScale={2}
                  {...form.getInputProps('PurchasePrice')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Depreciation Method"
                  placeholder="Select method"
                  required
                  data={[
                    { value: 'Straight Line', label: 'Straight Line' },
                    { value: 'Declining Balance', label: 'Declining Balance' },
                    { value: 'Sum of Years', label: 'Sum of Years Digits' },
                    { value: 'Units of Production', label: 'Units of Production' },
                  ]}
                  {...form.getInputProps('DepreciationMethod')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Useful Life (Years)"
                  placeholder="Enter useful life"
                  required
                  min={1}
                  {...form.getInputProps('UsefulLife')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Salvage Value"
                  placeholder="Enter salvage value"
                  min={0}
                  decimalScale={2}
                  {...form.getInputProps('SalvageValue')}
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
