import { Modal, Group, Text, Table, Badge, Grid, Paper, Divider, Stack, ScrollArea } from '@mantine/core';
import { IconCalendar, IconHash, IconFileText, IconUser, IconClock } from '@tabler/icons-react';
import type { JournalVoucher, JournalVoucherDetail } from '../types';

interface DialogJVDetailProps {
  opened: boolean;
  onClose: () => void;
  data: JournalVoucher | null;
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

export function DialogJVDetail({ opened, onClose, data }: DialogJVDetailProps) {
  if (!data) return null;

  const totalDr = data.Detail?.reduce((sum, d) => sum + (d.DrBase || 0), 0) || 0;
  const totalCr = data.Detail?.reduce((sum, d) => sum + (d.CrBase || 0), 0) || 0;

  return (
    <Modal opened={opened} onClose={onClose} title="Journal Voucher Detail" size="xl">
      <Stack gap="md">
        {/* Header Information */}
        <Paper withBorder p="md">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconCalendar size={16} color="gray" />
                <Text size="sm" c="dimmed">Date</Text>
              </Group>
              <Text fw={500}>{formatDate(data.JvhDate)}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconHash size={16} color="gray" />
                <Text size="sm" c="dimmed">Voucher No</Text>
              </Group>
              <Text fw={500}>{data.Prefix}-{data.JvhNo}</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Group gap="xs">
                <IconFileText size={16} color="gray" />
                <Text size="sm" c="dimmed">Source</Text>
              </Group>
              <Text fw={500}>{data.JvhSource || '-'}</Text>
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
          </Grid>

          <Divider my="md" />

          <Grid gutter="md">
            <Grid.Col span={12}>
              <Text size="sm" c="dimmed">Description</Text>
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
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Group gap="xs">
                <IconClock size={16} color="gray" />
                <Text size="sm" c="dimmed">Modified Date</Text>
              </Group>
              <Text fw={500}>{formatDate(data.DateModified)}</Text>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Detail Table */}
        <Paper withBorder p="md">
          <Text fw={500} mb="md">Journal Voucher Lines</Text>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Dept</Table.Th>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Currency</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Dr Amount</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Cr Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.Detail?.map((line: JournalVoucherDetail, index: number) => (
                  <Table.Tr key={line.JvdSeq}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>{line.DeptCode}</Table.Td>
                    <Table.Td>{line.AccCode}</Table.Td>
                    <Table.Td>{line.Description || '-'}</Table.Td>
                    <Table.Td>{line.CurCode}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{formatNumber(line.DrBase)}</Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>{formatNumber(line.CrBase)}</Table.Td>
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

          {/* Totals */}
          <Group justify="flex-end" mt="md" gap="xl">
            <Text>
              <Text component="span" c="dimmed">Total Debit:</Text>{' '}
              <Text component="span" fw={700} c="blue">{formatNumber(totalDr)}</Text>
            </Text>
            <Text>
              <Text component="span" c="dimmed">Total Credit:</Text>{' '}
              <Text component="span" fw={700} c="blue">{formatNumber(totalCr)}</Text>
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Modal>
  );
}
