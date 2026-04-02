import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreateAsset, useAssetCategoryList, useAssetLocationList } from '../../../hooks/useAsset';
import { toISODate } from '../../../utils/formatter';

const schema = z.object({
  AssetCode: z.string().min(1, 'Asset code is required'),
  AssetName: z.string().min(1, 'Asset name is required'),
  CategoryId: z.number({ required_error: 'Category is required' }),
  DepartmentId: z.number({ required_error: 'Department is required' }),
  LocationId: z.number().optional(),
  PurchaseDate: z.date({ required_error: 'Purchase date is required' }),
  PurchasePrice: z.number().min(0, 'Purchase price must be positive'),
  CurCode: z.string().min(1, 'Currency is required'),
  DepreciationMethod: z.string().min(1, 'Depreciation method is required'),
  UsefulLife: z.number().min(1, 'Useful life must be at least 1 year'),
  SalvageValue: z.number().min(0, 'Salvage value must be positive'),
});

type FormValues = z.infer<typeof schema>;

export default function AssetRegisterCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateAsset();

  const { data: categories } = useAssetCategoryList();
  const { data: locations } = useAssetLocationList();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      AssetCode: '',
      AssetName: '',
      CategoryId: 0,
      DepartmentId: 0,
      LocationId: undefined,
      PurchaseDate: new Date(),
      PurchasePrice: 0,
      CurCode: 'THB',
      DepreciationMethod: 'Straight-Line',
      UsefulLife: 5,
      SalvageValue: 0,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const selectedCategory = categories?.find((c) => c.CategoryId === values.CategoryId);
      
      await createMutation.mutateAsync({
        AssetCode: values.AssetCode,
        AssetName: values.AssetName,
        CategoryId: values.CategoryId,
        CategoryName: selectedCategory?.CategoryName || '',
        DepartmentId: values.DepartmentId,
        DepartmentName: '',
        LocationId: values.LocationId,
        LocationName: locations?.find((l) => l.LocationId === values.LocationId)?.LocationName,
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
      navigate('/asset/register');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/asset/register');
  };

  const categoryOptions =
    categories?.map((cat) => ({
      value: cat.CategoryId.toString(),
      label: cat.CategoryName,
    })) || [];

  const locationOptions =
    locations?.map((loc) => ({
      value: loc.LocationId.toString(),
      label: loc.LocationName,
    })) || [];

  return (
    <div>
      <PageHeader
        title="New Asset"
        subtitle="Register a new fixed asset"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Asset Register', href: '/asset/register' },
          { label: 'New' },
        ]}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={3}>
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
              <Grid.Col span={3}>
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  required
                  data={[
                    { value: 'THB', label: 'THB' },
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                  ]}
                  {...form.getInputProps('CurCode')}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={4}>
                <Select
                  label="Category"
                  placeholder="Select category"
                  required
                  data={categoryOptions}
                  value={form.values.CategoryId ? form.values.CategoryId.toString() : ''}
                  onChange={(val) => {
                    const catId = val ? parseInt(val, 10) : 0;
                    form.setFieldValue('CategoryId', catId);
                    const selectedCategory = categories?.find((c) => c.CategoryId === catId);
                    if (selectedCategory) {
                      form.setFieldValue('DepreciationMethod', selectedCategory.DepreciationMethod);
                      form.setFieldValue('UsefulLife', selectedCategory.UsefulLife);
                    }
                  }}
                  error={form.errors.CategoryId}
                  searchable={categoryOptions.length > 10}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Location"
                  placeholder="Select location"
                  data={locationOptions}
                  value={form.values.LocationId ? form.values.LocationId.toString() : ''}
                  onChange={(val) => form.setFieldValue('LocationId', val ? parseInt(val, 10) : undefined)}
                  clearable
                  searchable={locationOptions.length > 10}
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
            </Grid>
          </Paper>

          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={4}>
                <NumberInput
                  label="Purchase Price"
                  placeholder="Enter purchase price"
                  required
                  min={0}
                  decimalScale={2}
                  thousandSeparator=","
                  {...form.getInputProps('PurchasePrice')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Salvage Value"
                  placeholder="Enter salvage value"
                  required
                  min={0}
                  decimalScale={2}
                  thousandSeparator=","
                  {...form.getInputProps('SalvageValue')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Net Book Value"
                  value={form.values.PurchasePrice}
                  readOnly
                  decimalScale={2}
                  thousandSeparator=","
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={4}>
                <Select
                  label="Depreciation Method"
                  placeholder="Select method"
                  required
                  data={[
                    { value: 'Straight-Line', label: 'Straight-Line' },
                    { value: 'Declining-Balance', label: 'Declining Balance' },
                    { value: 'Sum-of-Years-Digits', label: 'Sum of Years Digits' },
                    { value: 'Units-of-Production', label: 'Units of Production' },
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
                  max={100}
                  {...form.getInputProps('UsefulLife')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Status"
                  value="Active"
                  readOnly
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
