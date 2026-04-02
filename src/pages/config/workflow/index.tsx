import { useState } from 'react';
import {
  Button,
  Group,
  Text,
  Badge,
  Stack,
  Tooltip,
  ActionIcon,
  Paper,
  Grid,
  Title,
  Table,
  Divider,
  Timeline,
  Card,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconPlayerPlay, IconPlayerPause, IconCheck, IconX, IconRoute } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';

// Mock data for workflows
interface WorkflowStep {
  StepId: number;
  StepName: string;
  StepOrder: number;
  ApproverRole: string;
  IsRequired: boolean;
  Action: 'Approve' | 'Review' | 'Notify';
}

interface Workflow {
  WorkflowId: number;
  WorkflowName: string;
  Module: string;
  Description: string;
  IsActive: boolean;
  Steps: WorkflowStep[];
  CreatedAt: string;
  ModifiedAt: string;
}

const mockWorkflows: Workflow[] = [
  {
    WorkflowId: 1,
    WorkflowName: 'Journal Voucher Approval',
    Module: 'General Ledger',
    Description: 'Standard approval process for journal vouchers',
    IsActive: true,
    Steps: [
      { StepId: 1, StepName: 'Department Head Review', StepOrder: 1, ApproverRole: 'Manager', IsRequired: true, Action: 'Review' },
      { StepId: 2, StepName: 'Finance Approval', StepOrder: 2, ApproverRole: 'Finance Manager', IsRequired: true, Action: 'Approve' },
      { StepId: 3, StepName: 'Final Check', StepOrder: 3, ApproverRole: 'CFO', IsRequired: false, Action: 'Review' },
    ],
    CreatedAt: '2024-01-15',
    ModifiedAt: '2024-04-10',
  },
  {
    WorkflowId: 2,
    WorkflowName: 'Payment Approval',
    Module: 'Accounts Payable',
    Description: 'Payment voucher approval workflow',
    IsActive: true,
    Steps: [
      { StepId: 4, StepName: 'Accounting Review', StepOrder: 1, ApproverRole: 'Accountant', IsRequired: true, Action: 'Review' },
      { StepId: 5, StepName: 'Manager Approval', StepOrder: 2, ApproverRole: 'Manager', IsRequired: true, Action: 'Approve' },
      { StepId: 6, StepName: 'Finance Director', StepOrder: 3, ApproverRole: 'Finance Director', IsRequired: true, Action: 'Approve' },
    ],
    CreatedAt: '2024-01-20',
    ModifiedAt: '2024-03-15',
  },
  {
    WorkflowId: 3,
    WorkflowName: 'Asset Acquisition',
    Module: 'Asset Management',
    Description: 'New asset purchase approval',
    IsActive: false,
    Steps: [
      { StepId: 7, StepName: 'Department Request', StepOrder: 1, ApproverRole: 'Department Head', IsRequired: true, Action: 'Review' },
      { StepId: 8, StepName: 'IT Review', StepOrder: 2, ApproverRole: 'IT Manager', IsRequired: true, Action: 'Review' },
      { StepId: 9, StepName: 'Finance Approval', StepOrder: 3, ApproverRole: 'Finance Manager', IsRequired: true, Action: 'Approve' },
    ],
    CreatedAt: '2024-02-01',
    ModifiedAt: '2024-02-01',
  },
  {
    WorkflowId: 4,
    WorkflowName: 'Budget Transfer',
    Module: 'Budget',
    Description: 'Inter-department budget transfer approval',
    IsActive: true,
    Steps: [
      { StepId: 10, StepName: 'Requestor Submit', StepOrder: 1, ApproverRole: 'User', IsRequired: true, Action: 'Review' },
      { StepId: 11, StepName: 'Source Dept Approval', StepOrder: 2, ApproverRole: 'Manager', IsRequired: true, Action: 'Approve' },
      { StepId: 12, StepName: 'Target Dept Approval', StepOrder: 3, ApproverRole: 'Manager', IsRequired: true, Action: 'Approve' },
      { StepId: 13, StepName: 'Finance Review', StepOrder: 4, ApproverRole: 'Finance Manager', IsRequired: true, Action: 'Approve' },
    ],
    CreatedAt: '2024-02-15',
    ModifiedAt: '2024-04-05',
  },
];

export default function ConfigWorkflow() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(mockWorkflows[0]);

  return (
    <Stack gap="md">
      <PageHeader
        title="Workflow Configuration"
        subtitle="Manage approval workflows for business processes"
        breadcrumbs={[
          { label: 'Config', href: '/config' },
          { label: 'Workflow' },
        ]}
        actions={
          <Button leftSection={<IconPlus size={16} />}>
            Create Workflow
          </Button>
        }
      />

      <Grid>
        <Grid.Col span={4}>
          <Stack gap="md">
            {mockWorkflows.map((workflow) => (
              <Card 
                key={workflow.WorkflowId}
                withBorder
                shadow="sm"
                padding="md"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedWorkflow?.WorkflowId === workflow.WorkflowId ? 'var(--mantine-color-blue-6)' : undefined,
                  backgroundColor: selectedWorkflow?.WorkflowId === workflow.WorkflowId ? 'var(--mantine-color-blue-0)' : undefined,
                }}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{workflow.WorkflowName}</Text>
                  <Badge color={workflow.IsActive ? 'green' : 'gray'}>
                    {workflow.IsActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>
                
                <Text size="sm" c="dimmed" mb="xs">{workflow.Description}</Text>
                
                <Group gap="xs">
                  <Badge variant="light" size="sm">{workflow.Module}</Badge>
                  <Badge variant="light" size="sm" color="gray">{workflow.Steps.length} steps</Badge>
                </Group>

                <Group gap="xs" mt="md">
                  <Tooltip label="Edit">
                    <ActionIcon variant="light" size="sm">
                      <IconEdit size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={workflow.IsActive ? 'Deactivate' : 'Activate'}>
                    <ActionIcon 
                      variant="light" 
                      size="sm"
                      color={workflow.IsActive ? 'orange' : 'green'}
                    >
                      {workflow.IsActive ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon variant="light" size="sm" color="red">
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Card>
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={8}>
          {selectedWorkflow ? (
            <Paper withBorder p="md">
              <Stack gap="lg">
                <Group justify="space-between">
                  <div>
                    <Title order={4}>{selectedWorkflow.WorkflowName}</Title>
                    <Text size="sm" c="dimmed">{selectedWorkflow.Description}</Text>
                  </div>
                  <Group>
                    <Badge size="lg" color={selectedWorkflow.IsActive ? 'green' : 'gray'}>
                      {selectedWorkflow.IsActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" leftSection={<IconEdit size={16} />}>Edit</Button>
                  </Group>
                </Group>

                <Divider />

                <Grid>
                  <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">Module</Text>
                    <Badge variant="light">{selectedWorkflow.Module}</Badge>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="sm" c="dimmed">Total Steps</Text>
                    <Text fw={500}>{selectedWorkflow.Steps.length}</Text>
                  </Grid.Col>
                </Grid>

                <Divider />

                <Title order={5}>Workflow Steps</Title>

                <Timeline active={selectedWorkflow.Steps.length - 1} bulletSize={24} lineWidth={2}>
                  {selectedWorkflow.Steps.map((step) => (
                    <Timeline.Item
                      key={step.StepId}
                      bullet={step.Action === 'Approve' ? <IconCheck size={12} /> : <IconRoute size={12} />}
                      title={
                        <Group gap="xs">
                          <Text fw={600}>{step.StepName}</Text>
                          {step.IsRequired && <Badge size="xs" color="red">Required</Badge>}
                        </Group>
                      }
                    >
                      <Text size="sm" c="dimmed">
                        Approver: <strong>{step.ApproverRole}</strong>
                      </Text>
                      <Text size="sm" c="dimmed">
                        Action: <Badge size="xs" variant="light">{step.Action}</Badge>
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>

                <Divider />

                <Title order={5}>Step Details</Title>

                <Table withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order</Table.Th>
                      <Table.Th>Step Name</Table.Th>
                      <Table.Th>Approver Role</Table.Th>
                      <Table.Th>Action</Table.Th>
                      <Table.Th>Required</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedWorkflow.Steps.map((step) => (
                      <Table.Tr key={step.StepId}>
                        <Table.Td>{step.StepOrder}</Table.Td>
                        <Table.Td>{step.StepName}</Table.Td>
                        <Table.Td><Badge variant="light">{step.ApproverRole}</Badge></Table.Td>
                        <Table.Td><Badge>{step.Action}</Badge></Table.Td>
                        <Table.Td>{step.IsRequired ? <IconCheck size={16} color="green" /> : <IconX size={16} color="gray" />}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Stack>
            </Paper>
          ) : (
            <Paper withBorder p="xl">
              <Stack align="center" gap="md">
                <IconRoute size={64} color="gray" />
                <Title order={4}>No Workflow Selected</Title>
                <Text c="dimmed" ta="center">Select a workflow from the list to view details</Text>
              </Stack>
            </Paper>
          )}
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
