import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, TextInput, NumberInput, LoadingOverlay, Tabs, Table } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck, IconCalculator, IconHistory } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  useAssetDetail,
  useUpdateAsset,
  useDeleteAsset,
  useDepreciationHistory,
  useAssetCategoryList,
  useAssetLocationList,
} from '../../../hooks/useAsset';
import { toISODate, fromMySqlDate, formatCurrency } from '../../../utils/formatter';
import { modals } from '@mantine/modals';

const schema = z.object({
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

export default function AssetRegisterEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const AssetId = parseInt(id ?? '0', 10);

  const { data: asset, isLoading } = useAssetDetail(AssetId);
  const { data: depreciationHistory } = useDepreciationHistory(AssetId);
  const { data: categories } = useAssetCategoryList();
  const { data: locations } = useAssetLocationList();
  const updateMutation = useUpdateAsset();
  const deleteMutation = useDeleteAsset();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
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

  // Populate form when data is loaded
  useEffect(() => {
    if (asset) {
      form.setValues({
        AssetName: asset.AssetName,
        CategoryId: asset.CategoryId,
        DepartmentId: asset.DepartmentId,
        LocationId: asset.LocationId || undefined,
        PurchaseDate: fromMySqlDate(asset.PurchaseDate) ?? new Date(),
        PurchasePrice: asset.PurchasePrice,
        CurCode: asset.CurCode,
        DepreciationMethod: asset.DepreciationMethod,
        UsefulLife: asset.UsefulLife,
        SalvageValue: asset.SalvageValue,
      });
    }
  }, [asset]);

  const handleSubmit = async (values: FormValues) => {
    if (!asset) return;

    try {
      const selectedCategory = categories?.find((c) => c.CategoryId === values.CategoryId);
      const selectedLocation = locations?.find((l) => l.LocationId === values.LocationId);

      await updateMutation.mutateAsync({
        ...asset,
        AssetName: values.AssetName,
        CategoryId: values.CategoryId,
        CategoryName: selectedCategory?.CategoryName || asset.CategoryName,
        DepartmentId: values.DepartmentId,
        DepartmentName: asset.DepartmentName,
        LocationId: values.LocationId,
        LocationName: selectedLocation?.LocationName,
        PurchaseDate: toISODate(values.PurchaseDate),
        PurchasePrice: values.PurchasePrice,
        CurCode: values.CurCode,
        DepreciationMethod: values.DepreciationMethod,
        UsefulLife: values.UsefulLife,
        SalvageValue: values.SalvageValue,
      });
      navigate('/asset/register');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Asset',
      children: `Are you sure you want to delete asset "${asset?.AssetName}"? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(AssetId);
          navigate('/asset/register');
        } catch (error) {
          // Error is handled by the mutation
        }
      },
    });
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

  const assetCode = asset?.AssetCode ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit Asset: ${assetCode}`}
        subtitle={`Category: ${asset?.CategoryName ?? ''} | Status: ${asset?.Status ?? ''}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Asset Register', href: '/asset/register' },
          { label: assetCode },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<IconCalculator size={16} />}>
              Asset Details
            </Tabs.Tab>
            <Tabs.Tab value="depreciation" leftSection={<IconHistory size={16} />}>
              Depreciation History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <Grid gutter="md">
                  <Grid.Col span={3}>
                    <TextInput
                      label="Asset Code"
                      value={asset?.AssetCode ?? ''}
                      readOnly
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
                      value={asset?.NetBookValue ?? 0}
                      readOnly
                      decimalScale={2}
                      thousandSeparator=","
                    />
                  </Grid.Col>
                </Grid>

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
                      value={asset?.Status ?? ''}
                      readOnly
                    />
                  </Grid.Col>
                </Grid>

                <Grid gutter="md">
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Accumulated Depreciation"
                      value={asset?.AccumulatedDepreciation ?? 0}
                      readOnly
                      decimalScale={2}
                      thousandSeparator=","
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Department"
                      value={asset?.DepartmentName ?? ''}
                      readOnly
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Current Location"
                      value={asset?.LocationName ?? ''}
                      readOnly
                    />
                  </Grid.Col>
                </Grid>

                <Group justify="flex-end">
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
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
          </Tabs.Panel>

          <Tabs.Panel value="depreciation" pt="md">
            <Stack gap="md">
              <Grid gutter="md">
                <Grid.Col span={3}>
                  <NumberInput
                    label="Purchase Price"
                    value={asset?.PurchasePrice ?? 0}
                    readOnly
                    decimalScale={2}
                    thousandSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Accumulated Depreciation"
                    value={asset?.AccumulatedDepreciation ?? 0}
                    readOnly
                    decimalScale={2}
                    thousandSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Net Book Value"
                    value={asset?.NetBookValue ?? 0}
                    readOnly
                    decimalScale={2}
                    thousandSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Salvage Value"
                    value={asset?.SalvageValue ?? 0}
                    readOnly
                    decimalScale={2}
                    thousandSeparator=","
                  />
                </Grid.Col>
              </Grid>

              <Paper withBorder p="md">
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Year</Table.Th>
                      <Table.Th>Period</Table.Th>
                      <Table.Th>Depreciation Amount</Table.Th>
                      <Table.Th>Accumulated</Table.Th>
                      <Table.Th>Net Book Value</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {depreciationHistory?.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={5} ta="center" py="xl">
                          No depreciation history found
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      depreciationHistory?.map((record) => (
                        <Table.Tr key={`${record.Year}-${record.Period}`}>
                          <Table.Td>{record.Year}</Table.Td>
                          <Table.Td>{record.Period}</Table.Td>
                          <Table.Td>
                            {formatCurrency(record.DepreciationAmount, asset?.CurCode)}
                          </Table.Td>
                          <Table.Td>
                            {formatCurrency(record.AccumulatedDepreciation, asset?.CurCode)}
                          </Table.Td>
                          <Table.Td>
                            {formatCurrency(record.NetBookValue, asset?.CurCode)}
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
}
