import { useNavigate } from 'react-router';
import {
  Paper,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  Grid,
  Title,
  Divider,
  Checkbox,
  Table,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useState } from 'react';

interface TemplateDetail {
  id: number;
  DeptCode: string;
  AccCode: string;
  Description: string;
  DrAmount: number;
  CrAmount: number;
}

export default function TemplateVoucherCreate() {
  const navigate = useNavigate();
  const [details, setDetails] = useState<TemplateDetail[]>([
    { id: 1, DeptCode: 'HQ', AccCode: '', Description: '', DrAmount: 0, CrAmount: 0 },
  ]);

  const form = useForm({
    initialValues: {
      TemplateCode: '',
      TemplateName: '',
      Description: '',
      Category: 'Expense',
      IsActive: true,
    },
    validate: {
      TemplateCode: (value) => (!value ? 'Template code is required' : null),
      TemplateName: (value) => (!value ? 'Template name is required' : null),
      Category: (value) => (!value ? 'Category is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.show({
        title: 'Success',
        message: 'Template voucher created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      navigate('/gl/template-voucher');
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to create template voucher',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const addDetail = () => {
    setDetails([
      ...details,
      {
        id: details.length + 1,
        DeptCode: 'HQ',
        AccCode: '',
        Description: '',
        DrAmount: 0,
        CrAmount: 0,
      },
    ]);
  };

  const removeDetail = (id: number) => {
    setDetails(details.filter((d) => d.id !== id));
  };

  const updateDetail = (id: number, field: keyof TemplateDetail, value: string | number) => {
    setDetails(details.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const totalDr = details.reduce((sum, d) => sum + d.DrAmount, 0);
  const totalCr = details.reduce((sum, d) => sum + d.CrAmount, 0);

  return (
    <Stack gap="md">
      <PageHeader
        title="Create Template Voucher"
        breadcrumbs={[
          { label: 'GL', href: '/gl' },
          { label: 'Template Vouchers', href: '/gl/template-voucher' },
          { label: 'Create' },
        ]}
      />

      <Paper withBorder p="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* Header Section */}
            <div>
              <Title order={4} mb="md">Header Information</Title>
              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="Template Code"
                    placeholder="e.g., TEMP001"
                    required
                    {...form.getInputProps('TemplateCode')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Template Name"
                    placeholder="Enter template name"
                    required
                    {...form.getInputProps('TemplateName')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Category"
                    required
                    data={[
                      { value: 'Expense', label: 'Expense' },
                      { value: 'Revenue', label: 'Revenue' },
                      { value: 'Asset', label: 'Asset' },
                      { value: 'Closing', label: 'Closing' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    {...form.getInputProps('Category')}
                  />
                </Grid.Col>
              </Grid>
              <Textarea
                label="Description"
                placeholder="Enter template description"
                minRows={2}
                mt="md"
                {...form.getInputProps('Description')}
              />
              <Checkbox
                label="Active"
                mt="md"
                {...form.getInputProps('IsActive', { type: 'checkbox' })}
              />
            </div>

            <Divider />

            {/* Detail Section */}
            <div>
              <Group justify="space-between" mb="md">
                <Title order={4}>Template Details</Title>
                <Button 
                  size="sm" 
                  leftSection={<IconPlus size={16} />}
                  onClick={addDetail}
                >
                  Add Line
                </Button>
              </Group>

              <Table withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Dept</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Dr Amount</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>Cr Amount</Table.Th>
                    <Table.Th style={{ width: 50 }}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {details.map((detail) => (
                    <Table.Tr key={detail.id}>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          value={detail.DeptCode}
                          onChange={(e) => updateDetail(detail.id, 'DeptCode', e.target.value)}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          value={detail.AccCode}
                          onChange={(e) => updateDetail(detail.id, 'AccCode', e.target.value)}
                          placeholder="Account code"
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          value={detail.Description}
                          onChange={(e) => updateDetail(detail.id, 'Description', e.target.value)}
                          placeholder="Description"
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          type="number"
                          value={detail.DrAmount}
                          onChange={(e) => updateDetail(detail.id, 'DrAmount', Number(e.target.value))}
                          style={{ textAlign: 'right' }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <TextInput
                          size="xs"
                          type="number"
                          value={detail.CrAmount}
                          onChange={(e) => updateDetail(detail.id, 'CrAmount', Number(e.target.value))}
                          style={{ textAlign: 'right' }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          color="red"
                          variant="subtle"
                          onClick={() => removeDetail(detail.id)}
                          disabled={details.length === 1}
                        >
                          <IconTrash size={14} />
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
                <Table.Tfoot>
                  <Table.Tr>
                    <Table.Td colSpan={3} style={{ textAlign: 'right' }}>
                      <strong>Total:</strong>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <strong>{totalDr.toFixed(2)}</strong>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <strong>{totalCr.toFixed(2)}</strong>
                    </Table.Td>
                    <Table.Td></Table.Td>
                  </Table.Tr>
                </Table.Tfoot>
              </Table>

              {totalDr !== totalCr && (
                <Text size="sm" c="red" mt="sm">
                  Debit and Credit totals must be equal
                </Text>
              )}
            </div>

            <Divider />

            {/* Actions */}
            <Group justify="flex-end">
              <Button 
                variant="light" 
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/gl/template-voucher')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Template
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
