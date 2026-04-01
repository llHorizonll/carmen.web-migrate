import { useNavigate } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, Textarea, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useCreateAssetDisposal } from '../../../hooks/useAssetRegister';
import { toISODate } from '../../../utils/formatter';

const schema = z.object({
  AssetId: z.number({ required_error: 'Asset is required' }),
  AssetCode: z.string().min(1, 'Asset is required'),
  DisposalDate: z.date({ required_error: 'Disposal date is required' }),
  DisposalAmount: z.number({ required_error: 'Disposal amount is required' }),
  GainLoss: z.number().default(0),
  Description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// Mock available assets for disposal - in real app, this would come from an API
const availableAssets = [
  { value: '1', label: 'COMP001 - Laptop Dell XPS 13' },
  { value: '2', label: 'COMP002 - Desktop HP ProDesk' },
  { value: '3', label: 'VEH001 - Toyota Camry 2020' },
  { value: '4', label: 'FURN001 - Office Desk Set' },
  { value: '5', label: 'EQUIP001 - Printer Canon' },
];

export default function AssetDisposalCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateAssetDisposal();

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      AssetId: 0,
      AssetCode: '',
      DisposalDate: new Date(),
      DisposalAmount: 0,
      GainLoss: 0,
      Description: '',
    },
  });

  const handleAssetChange = (value: string | null) => {
    if (value) {
      const selectedAsset = availableAssets.find(a => a.value === value);
      form.setFieldValue('AssetId', parseInt(value, 10));
      form.setFieldValue('AssetCode', selectedAsset?.label.split(' - ')[0] || '');
    } else {
      form.setFieldValue('AssetId', 0);
      form.setFieldValue('AssetCode', '');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await createMutation.mutateAsync({
        AssetCode: values.AssetCode,
        AssetName: '',
        CategoryId: 0,
        CategoryName: '',
        DepartmentId: 0,
        DepartmentName: '',
        LocationId: undefined,
        LocationName: '',
        VendorId: undefined,
        VendorName: '',
        PurchaseDate: toISODate(values.DisposalDate),
        PurchasePrice: values.DisposalAmount,
        CurCode: 'THB',
        DepreciationMethod: '',
        UsefulLife: 0,
        SalvageValue: 0,
        AccumulatedDepreciation: 0,
        NetBookValue: values.DisposalAmount - values.GainLoss,
        Status: 'Disposed',
      });
      navigate('/asset/disposal');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate('/asset/disposal');
  };

  return (
    <div>
      <PageHeader
        title="New Asset Disposal"
        subtitle="Record asset disposal or sale"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Asset Disposal', href: '/asset/disposal' },
          { label: 'New' },
        ]}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper withBorder p="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Select
                  label="Asset"
                  placeholder="Select asset to dispose"
                  required
                  data={availableAssets}
                  value={form.values.AssetId ? String(form.values.AssetId) : null}
                  onChange={handleAssetChange}
                  error={form.errors.AssetId}
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Disposal Date"
                  placeholder="Select disposal date"
                  required
                  {...form.getInputProps('DisposalDate')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Disposal Amount"
                  placeholder="Enter disposal/sale amount"
                  required
                  min={0}
                  decimalScale={2}
                  {...form.getInputProps('DisposalAmount')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Gain/Loss"
                  placeholder="Calculated gain or loss"
                  decimalScale={2}
                  {...form.getInputProps('GainLoss')}
                  description="Positive = Gain, Negative = Loss"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Net Book Value"
                  placeholder="Calculated net book value"
                  disabled
                  value={form.values.DisposalAmount - form.values.GainLoss}
                  decimalScale={2}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Description"
                  placeholder="Enter disposal details, reason, buyer information, etc."
                  rows={3}
                  {...form.getInputProps('Description')}
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
