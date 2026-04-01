import { useNavigate, useParams } from 'react-router';
import { Paper, Group, Button, Stack, Grid, Select, Textarea, NumberInput, LoadingOverlay } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { IconX, IconCheck } from '@tabler/icons-react';
import { z } from 'zod';
import { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  useAssetDisposalDetail,
  useUpdateAssetDisposal,
} from '../../../hooks/useAssetRegister';
import { formatDate, toISODate, fromMySqlDate } from '../../../utils/formatter';

const schema = z.object({
  AssetId: z.number({ required_error: 'Asset is required' }),
  AssetCode: z.string().min(1, 'Asset is required'),
  DisposalDate: z.date({ required_error: 'Disposal date is required' }),
  DisposalAmount: z.number({ required_error: 'Disposal amount is required' }),
  GainLoss: z.number().default(0),
  Description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AssetDisposalEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const AssetId = parseInt(id ?? '0', 10);

  const { data: asset, isLoading } = useAssetDisposalDetail(AssetId);
  const updateMutation = useUpdateAssetDisposal();

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

  // Populate form when data is loaded
  useEffect(() => {
    if (asset) {
      form.setValues({
        AssetId: asset.AssetId,
        AssetCode: asset.AssetCode,
        DisposalDate: fromMySqlDate(asset.PurchaseDate) ?? new Date(),
        DisposalAmount: asset.PurchasePrice,
        GainLoss: 0,
        Description: '',
      });
    }
  }, [asset]);

  const handleSubmit = async (values: FormValues) => {
    if (!asset) return;

    try {
      await updateMutation.mutateAsync({
        ...asset,
        PurchaseDate: toISODate(values.DisposalDate),
        PurchasePrice: values.DisposalAmount,
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

  const assetCode = asset?.AssetCode ?? '...';

  return (
    <div>
      <PageHeader
        title={`Edit Asset Disposal: ${assetCode}`}
        subtitle={`Disposal Date: ${formatDate(asset?.PurchaseDate)}`}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Asset Management' },
          { label: 'Asset Disposal', href: '/asset/disposal' },
          { label: assetCode },
        ]}
      />

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Select
                  label="Asset"
                  placeholder="Select asset to dispose"
                  required
                  disabled
                  data={[{ value: String(form.values.AssetId), label: `${form.values.AssetCode} - ${asset?.AssetName || ''}` }]}
                  value={String(form.values.AssetId)}
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
