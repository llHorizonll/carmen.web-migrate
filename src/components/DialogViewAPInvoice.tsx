import { Modal, Group, Text, Table, Badge, Grid, Paper, Divider, Stack, ScrollArea } from '@mantine/core';
import { IconCalendar, IconHash, IconBuildingStore, IconFileText, IconUser, IconClock, IconCoin, IconPercentage } from '@tabler/icons-react';
import type { ApInvoice, ApInvoiceDetail } from '../types';

interface DialogViewAPInvoiceProps {
  opened: boolean;
  onClose: () => void;
  data: ApInvoice | null;
}

const statusColors = {
  Draft: 'gray',
  Normal: 'blue',
  Void: 'red',
} as const;

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function DialogViewAPInvoice({ opened, onClose, data }: DialogViewAPInvoiceProps) {
  if (!data) return null;

  const subTotal = data.Detail?.reduce((sum, d) => sum + (d.AmountBase || 0), 0) || 0;

  return (
    <Modal opened={opened} onClose={onClose} title="AP Invoice Detail" size="xl">
      <Stack gap="md">
        {/* Header Information */}
        <Paper withBorder p="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconCalendar size={16} color="gray" />
                <Text size="sm" c="dimmed">Invoice Date</Text>
              </Group>
              <Text fw={500}>{formatDate(data.InvDate)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconHash size={16} color="gray" />
                <Text size="sm" c="dimmed">Invoice No</Text>
              </Group>
              <Text fw={500}>{data.InvNo}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconClock size={16} color="gray" />
                <Text size="sm" c="dimmed">Status</Text>
              </Group>
              <Badge color={statusColors[data.Status] || 'gray'} variant="filled">
                {data.Status}
              </Badge>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconCoin size={16} color="gray" />
                <Text size="sm" c="dimmed">Currency</Text>
              </Group>
              <Text fw={500}>{data.CurCode} @ {formatNumber(data.CurRate)}</Text>
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group gap="xs">
                <IconBuildingStore size={16} color="gray" />
                <Text size="sm" c="dimmed">Vendor</Text>
              </Group>
              <Text fw={500}>{data.VendorCode} - {data.VendorName}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group gap="xs">
                <IconFileText size={16} color="gray" />
                <Text size="sm" c="dimmed">Description</Text>
              </Group>
              <Text fw={500}>{data.Description || '-'}</Text>
            </Grid.Col>
          </Grid>

          <Divider my="md" />

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Group gap="xs">
                <IconUser size={16} color="gray" />
                <Text size="sm" c="dimmed">Modified By</Text>
              </Group>
              <Text fw={500}>{data.UserModified || '-'}</Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Summary */}
        <Paper withBorder p="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconCoin size={16} color="gray" />
                <Text size="sm" c="dimmed">Invoice Amount</Text>
              </Group>
              <Text fw={500} c="blue">{formatNumber(data.InvAmountBase)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconPercentage size={16} color="gray" />
                <Text size="sm" c="dimmed">VAT Amount</Text>
              </Group>
              <Text fw={500}>{formatNumber(data.VatAmount)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconPercentage size={16} color="gray" />
                <Text size="sm" c="dimmed">WHT Amount</Text>
              </Group>
              <Text fw={500}>{formatNumber(data.WhtAmount)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconCoin size={16} color="gray" />
                <Text size="sm" c="dimmed">Net Amount</Text>
              </Group>
              <Text fw={700} c="green">{formatNumber(data.NetAmount)}</Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Detail Table */}
        <Paper withBorder p="md">
          <Text fw={500} mb="md">Invoice Lines</Text>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Dept</Table.Th>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>VAT Code</Table.Th>
                  <Table.Th>WHT Code</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.Detail?.map((line: ApInvoiceDetail, index: number) => (
                  <Table.Tr key={line.ApInvdSeq}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>{line.DeptCode}</Table.Td>
                    <Table.Td>{line.AccCode}</Table.Td>
                    <Table.Td>{line.Description || '-'}</Table.Td>
                    <Table.Td>{line.VatCode || '-'}</Table.Td>
                    <Table.Td>{line.WhtCode || '-'}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{formatNumber(line.AmountBase)}</Table.Td>
                  </Table.Tr>
                ))}
                {(!data.Detail || data.Detail.length === 0) && (
                  <Table.Tr>
                    <Table.Td colSpan={7} style={{ textAlign: 'center' }}>
                      <Text c="dimmed">No detail records found</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Subtotal */}
          <Group justify="flex-end" mt="md">
            <Text>
              <Text component="span" c="dimmed">Subtotal:</Text>{' '}
              <Text component="span" fw={700} c="blue">{formatNumber(subTotal)}</Text>
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Modal>
  );
}
