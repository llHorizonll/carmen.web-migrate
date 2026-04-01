import { Modal, Group, Text, Table, Badge, Timeline, Paper, Stack, Avatar, Divider, ScrollArea } from '@mantine/core';
import { IconGitCommit, IconX, IconClock, IconPlayerPlay, IconCircleCheck, IconBan } from '@tabler/icons-react';

// Workflow history type definition
export interface WorkflowHistoryItem {
  Id: number;
  DocumentId: number;
  DocumentType: string;
  DocumentNo: string;
  StepNo: number;
  StepName: string;
  Action: 'Submit' | 'Approve' | 'Reject' | 'Return' | 'Cancel' | 'Void';
  ActionBy: string;
  ActionByName?: string;
  ActionDate: string;
  Comment?: string;
  Status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
}

interface DialogWorkflowHisProps {
  opened: boolean;
  onClose: () => void;
  data: WorkflowHistoryItem[] | null;
  documentNo?: string;
  documentType?: string;
}

const actionColors = {
  Submit: 'blue',
  Approve: 'green',
  Reject: 'red',
  Return: 'yellow',
  Cancel: 'gray',
  Void: 'red',
} as const;

const actionIcons = {
  Submit: IconPlayerPlay,
  Approve: IconCircleCheck,
  Reject: IconX,
  Return: IconClock,
  Cancel: IconBan,
  Void: IconBan,
} as const;

const statusColors = {
  Pending: 'yellow',
  Approved: 'green',
  Rejected: 'red',
  Cancelled: 'gray',
} as const;

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'cyan', 'orange'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function DialogWorkflowHis({
  opened,
  onClose,
  data,
  documentNo,
  documentType,
}: DialogWorkflowHisProps) {
  if (!data) return null;

  // Sort by step number then by date
  const sortedHistory = [...data].sort((a, b) => {
    if (a.StepNo !== b.StepNo) return a.StepNo - b.StepNo;
    return new Date(a.ActionDate).getTime() - new Date(b.ActionDate).getTime();
  });

  const currentStatus = sortedHistory.length > 0 
    ? sortedHistory[sortedHistory.length - 1].Status 
    : 'Pending';

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={`Workflow History${documentNo ? ` - ${documentNo}` : ''}`} 
      size="lg"
    >
      <Stack gap="md">
        {/* Document Info */}
        <Paper withBorder p="md">
          <Group justify="space-between">
            <Group gap="xs">
              <Text size="sm" c="dimmed">Document Type:</Text>
              <Text fw={500}>{documentType || '-'}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">Current Status:</Text>
              <Badge color={statusColors[currentStatus] || 'gray'} variant="filled">
                {currentStatus}
              </Badge>
            </Group>
          </Group>
        </Paper>

        {/* Timeline View */}
        <Paper withBorder p="md">
          <Text fw={500} mb="md">Approval Timeline</Text>
          <ScrollArea>
            <Timeline active={sortedHistory.length - 1} bulletSize={24} lineWidth={2}>
              {sortedHistory.map((item, index) => {
                const Icon = actionIcons[item.Action] || IconGitCommit;
                const isLast = index === sortedHistory.length - 1;
                
                return (
                  <Timeline.Item
                    key={item.Id}
                    bullet={<Icon size={12} />}
                    title={
                      <Group gap="xs">
                        <Text fw={500}>{item.StepName}</Text>
                        <Badge 
                          color={actionColors[item.Action] || 'gray'} 
                          size="sm"
                          variant={isLast ? 'filled' : 'light'}
                        >
                          {item.Action}
                        </Badge>
                      </Group>
                    }
                  >
                    <Group gap="xs" mt="xs">
                      <Avatar 
                        size="sm" 
                        color={getAvatarColor(item.ActionBy)}
                        radius="xl"
                      >
                        {getInitials(item.ActionByName || item.ActionBy)}
                      </Avatar>
                      <Text size="sm" c="dimmed">
                        {item.ActionByName || item.ActionBy}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt="xs">
                      {formatDate(item.ActionDate)}
                    </Text>
                    {item.Comment && (
                      <Paper withBorder p="xs" mt="xs" bg="gray.0">
                        <Text size="sm" fs="italic">
                          &ldquo;{item.Comment}&rdquo;
                        </Text>
                      </Paper>
                    )}
                  </Timeline.Item>
                );
              })}
              {sortedHistory.length === 0 && (
                <Timeline.Item bullet={<IconClock size={12} />} title="No workflow history">
                  <Text size="sm" c="dimmed">
                    This document has not been submitted for approval yet.
                  </Text>
                </Timeline.Item>
              )}
            </Timeline>
          </ScrollArea>
        </Paper>

        <Divider />

        {/* Table View */}
        <Paper withBorder p="md">
          <Text fw={500} mb="md">Detailed History</Text>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Step</Table.Th>
                  <Table.Th>Action</Table.Th>
                  <Table.Th>By</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Comment</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sortedHistory.map((item) => (
                  <Table.Tr key={item.Id}>
                    <Table.Td>
                      <Text fw={500}>{item.StepNo}</Text>
                      <Text size="xs" c="dimmed">{item.StepName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={actionColors[item.Action] || 'gray'} 
                        size="sm"
                      >
                        {item.Action}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Avatar 
                          size="xs" 
                          color={getAvatarColor(item.ActionBy)}
                          radius="xl"
                        >
                          {getInitials(item.ActionByName || item.ActionBy)}
                        </Avatar>
                        <Text size="sm">{item.ActionByName || item.ActionBy}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{formatDate(item.ActionDate)}</Table.Td>
                    <Table.Td>
                      <Badge 
                        color={statusColors[item.Status] || 'gray'} 
                        variant="light"
                        size="sm"
                      >
                        {item.Status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ maxWidth: 200 }} truncate>
                        {item.Comment || '-'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {sortedHistory.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                      <Text c="dimmed">No workflow history records found</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Stack>
    </Modal>
  );
}
