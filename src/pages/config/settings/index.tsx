import { useState } from 'react';
import {
  
  Button,
  Stack,
  Paper,
  Grid,
  Title,
  Select,
  Switch,
  Divider,
  NumberInput,
  Tabs,
  Alert,
} from '@mantine/core';
import { IconSettings, IconBell, IconDatabase, IconLock, IconPalette, IconLanguage, IconRefresh, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { notifications } from '@mantine/notifications';

export default function ConfigSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    notifications.show({
      title: 'Settings Saved',
      message: 'Your settings have been updated successfully',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  return (
    <Stack gap="md">
      <PageHeader
        title="System Settings"
        subtitle="Configure application-wide settings"
        breadcrumbs={[
          { label: 'Config', href: '/config' },
          { label: 'Settings' },
        ]}
        actions={
          <Button onClick={handleSave} leftSection={<IconCheck size={16} />}>
            Save Settings
          </Button>
        }
      />

      <Alert icon={<IconInfoCircle size={16} />} title="Important" color="blue" variant="light">
        Changes to some settings may require a page refresh to take effect. System-wide settings affect all users.
      </Alert>

      <Tabs value={activeTab} onChange={(val) => setActiveTab(val || 'general')}>
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>General</Tabs.Tab>
          <Tabs.Tab value="display" leftSection={<IconPalette size={16} />}>Display</Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>Notifications</Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>Security</Tabs.Tab>
          <Tabs.Tab value="data" leftSection={<IconDatabase size={16} />}>Data & Backup</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Paper withBorder p="md">
            <Stack gap="lg">
              <Title order={5}>Regional Settings</Title>
              
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Language"
                    description="Default language for the application"
                    defaultValue="en"
                    data={[
                      { value: 'en', label: 'English' },
                      { value: 'th', label: 'Thai' },
                      { value: 'vi', label: 'Vietnamese' },
                    ]}
                    leftSection={<IconLanguage size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Time Zone"
                    description="Default time zone for date/time display"
                    defaultValue="Asia/Bangkok"
                    data={[
                      { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
                      { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
                      { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
                      { value: 'UTC', label: 'UTC' },
                    ]}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Date Format"
                    description="Display format for dates"
                    defaultValue="dd/MM/yyyy"
                    data={[
                      { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
                      { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
                      { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-12-31)' },
                      { value: 'dd MMM yyyy', label: 'DD MMM YYYY (31 Dec 2024)' },
                    ]}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Number Format"
                    description="Decimal and thousand separator style"
                    defaultValue="en"
                    data={[
                      { value: 'en', label: '1,000,000.00 (English)' },
                      { value: 'de', label: '1.000.000,00 (European)' },
                    ]}
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Title order={5}>System Behavior</Title>

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Session Timeout"
                    description="Minutes of inactivity before auto-logout"
                    defaultValue={30}
                    min={5}
                    max={480}
                    suffix=" minutes"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Items Per Page"
                    description="Default number of items per page in lists"
                    defaultValue={15}
                    min={5}
                    max={100}
                    suffix=" items"
                  />
                </Grid.Col>
              </Grid>

              <Switch
                label="Enable Auto-Save"
                description="Automatically save form data as draft"
                defaultChecked
              />

              <Switch
                label="Show Tooltips"
                description="Display helpful tooltips throughout the application"
                defaultChecked
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="display" pt="md">
          <Paper withBorder p="md">
            <Stack gap="lg">
              <Title order={5}>Theme Settings</Title>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Color Scheme"
                    description="Application color theme"
                    defaultValue="light"
                    data={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'auto', label: 'Auto (System)' },
                    ]}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Primary Color"
                    description="Main accent color"
                    defaultValue="blue"
                    data={[
                      { value: 'blue', label: 'Blue' },
                      { value: 'green', label: 'Green' },
                      { value: 'teal', label: 'Teal' },
                      { value: 'violet', label: 'Violet' },
                      { value: 'orange', label: 'Orange' },
                    ]}
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Title order={5}>Layout Options</Title>

              <Switch
                label="Compact Mode"
                description="Reduce padding and spacing for denser layout"
                defaultChecked={false}
              />

              <Switch
                label="Sticky Header"
        description="Keep page header visible while scrolling"
                defaultChecked={true}
              />

              <Switch
                label="Show Breadcrumbs"
                description="Display navigation breadcrumbs at top of pages"
                defaultChecked={true}
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pt="md">
          <Paper withBorder p="md">
            <Stack gap="lg">
              <Title order={5}>Email Notifications</Title>

              <Switch
                label="Enable Email Notifications"
                description="Send email notifications for important events"
                defaultChecked
              />

              <Switch
                label="New User Registration"
                description="Notify administrators when new users register"
                defaultChecked
              />

              <Switch
                label="Transaction Approvals"
                description="Send emails for pending approvals"
                defaultChecked
              />

              <Switch
                label="System Alerts"
                description="Send emails for system warnings and errors"
                defaultChecked={false}
              />

              <Divider />

              <Title order={5}>In-App Notifications</Title>

              <Switch
                label="Desktop Notifications"
                description="Show browser notifications for alerts"
                defaultChecked
              />

              <Switch
                label="Sound Alerts"
                description="Play sound for important notifications"
                defaultChecked={false}
              />

              <NumberInput
                label="Notification Duration"
                description="How long notifications stay visible (seconds)"
                defaultValue={5}
                min={1}
                max={30}
                suffix=" seconds"
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <Paper withBorder p="md">
            <Stack gap="lg">
              <Title order={5}>Password Policy</Title>

              <Switch
                label="Strong Password Required"
                description="Require uppercase, lowercase, number, and special character"
                defaultChecked
              />

              <NumberInput
                label="Minimum Password Length"
                defaultValue={8}
                min={6}
                max={32}
                suffix=" characters"
              />

              <NumberInput
                label="Password Expiry"
                description="Days before password must be changed (0 = never)"
                defaultValue={90}
                min={0}
                max={365}
                suffix=" days"
              />

              <Divider />

              <Title order={5}>Login Security</Title>

              <NumberInput
                label="Max Login Attempts"
                description="Failed attempts before account lockout"
                defaultValue={5}
                min={3}
                max={10}
                suffix=" attempts"
              />

              <NumberInput
                label="Lockout Duration"
                description="Minutes before locked account can retry"
                defaultValue={30}
                min={5}
                max={1440}
                suffix=" minutes"
              />

              <Switch
                label="Two-Factor Authentication"
                description="Require 2FA for all users"
                defaultChecked={false}
              />

              <Switch
                label="IP Whitelist"
                description="Restrict access to specific IP addresses"
                defaultChecked={false}
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="data" pt="md">
          <Paper withBorder p="md">
            <Stack gap="lg">
              <Title order={5}>Backup Settings</Title>

              <Switch
                label="Automatic Backup"
                description="Enable scheduled automatic backups"
                defaultChecked
              />

              <Select
                label="Backup Frequency"
                description="How often to perform automatic backups"
                defaultValue="daily"
                data={[
                  { value: 'hourly', label: 'Every Hour' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
              />

              <NumberInput
                label="Backup Retention"
                description="Number of backups to keep"
                defaultValue={30}
                min={7}
                max={365}
                suffix=" days"
              />

              <Divider />

              <Title order={5}>Data Management</Title>

              <Switch
                label="Audit Logging"
                description="Log all data changes for auditing"
                defaultChecked
              />

              <NumberInput
                label="Audit Log Retention"
                description="How long to keep audit logs"
                defaultValue={365}
                min={30}
                max={2555}
                suffix=" days"
              />

              <Grid mt="md">
                <Grid.Col span={6}>
                  <Button variant="light" fullWidth leftSection={<IconDatabase size={16} />}>
                    Export Data
                  </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button variant="light" fullWidth leftSection={<IconRefresh size={16} />}>
                    Run Backup Now
                  </Button>
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
