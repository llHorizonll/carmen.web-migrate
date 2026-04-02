import { useState } from 'react';
import {
  
  Button,
  Group,
  Stack,
  Paper,
  Grid,
  Title,
  TextInput,
  Textarea,
  Select,
  Tabs,
  Avatar,
  Divider,
} from '@mantine/core';
import { IconBuilding, IconMapPin, IconPhone, IconMail, IconFileInvoice, IconSettings, IconCheck, IconX } from '@tabler/icons-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface CompanyInfo {
  CompanyId: number;
  CompanyCode: string;
  CompanyName: string;
  TaxId: string;
  RegistrationNo: string;
  Address: string;
  City: string;
  Province: string;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string;
  Email: string;
  Website: string;
  CurCode: string;
  FiscalYearStart: number;
  BaseCurrency: string;
  ReportCurrency: string;
  Logo?: string;
}

const mockCompany: CompanyInfo = {
  CompanyId: 1,
  CompanyCode: 'COMP01',
  CompanyName: 'CARMEN Company Limited',
  TaxId: '0105555001234',
  RegistrationNo: 'REG123456',
  Address: '123 Sukhumvit Road, Klongtoey',
  City: 'Bangkok',
  Province: 'Bangkok',
  PostalCode: '10110',
  Country: 'Thailand',
  Phone: '02-123-4567',
  Fax: '02-123-4568',
  Email: 'info@carmen.co.th',
  Website: 'www.carmen.co.th',
  CurCode: 'THB',
  FiscalYearStart: 1,
  BaseCurrency: 'THB',
  ReportCurrency: 'THB',
};

export default function ConfigCompany() {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    initialValues: mockCompany,
  });

  const handleSave = () => {
    notifications.show({
      title: 'Success',
      message: 'Company information updated successfully',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.setValues(mockCompany);
    setIsEditing(false);
  };

  return (
    <Stack gap="md">
      <PageHeader
        title="Company Configuration"
        subtitle="Manage company information and settings"
        breadcrumbs={[
          { label: 'Config', href: '/config' },
          { label: 'Company' },
        ]}
        actions={
          isEditing ? (
            <Group>
              <Button variant="light" color="red" onClick={handleCancel} leftSection={<IconX size={16} />}>
                Cancel
              </Button>
              <Button onClick={handleSave} leftSection={<IconCheck size={16} />}>
                Save Changes
              </Button>
            </Group>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Company Info</Button>
          )
        }
      />

      <Tabs value={activeTab} onChange={(val) => setActiveTab(val || 'general')}>
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconBuilding size={16} />}>General</Tabs.Tab>
          <Tabs.Tab value="contact" leftSection={<IconMapPin size={16} />}>Contact</Tabs.Tab>
          <Tabs.Tab value="tax" leftSection={<IconFileInvoice size={16} />}>Tax & Legal</Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Paper withBorder p="md">
            <Stack gap="md">
              <Group justify="center" mb="md">
                <Avatar size={120} radius={120} color="blue">
                  {form.values.CompanyName.charAt(0)}
                </Avatar>
              </Group>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Company Code"
                    disabled={!isEditing}
                    {...form.getInputProps('CompanyCode')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Company Name"
                    disabled={!isEditing}
                    {...form.getInputProps('CompanyName')}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Website"
                disabled={!isEditing}
                {...form.getInputProps('Website')}
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="contact" pt="md">
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={5}>Address</Title>
              <Textarea
                label="Address"
                disabled={!isEditing}
                minRows={2}
                {...form.getInputProps('Address')}
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="City"
                    disabled={!isEditing}
                    {...form.getInputProps('City')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Province/State"
                    disabled={!isEditing}
                    {...form.getInputProps('Province')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Postal Code"
                    disabled={!isEditing}
                    {...form.getInputProps('PostalCode')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Country"
                    disabled={!isEditing}
                    {...form.getInputProps('Country')}
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Title order={5}>Contact Information</Title>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Phone"
                    disabled={!isEditing}
                    leftSection={<IconPhone size={16} />}
                    {...form.getInputProps('Phone')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Fax"
                    disabled={!isEditing}
                    {...form.getInputProps('Fax')}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Email"
                disabled={!isEditing}
                leftSection={<IconMail size={16} />}
                {...form.getInputProps('Email')}
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="tax" pt="md">
          <Paper withBorder p="md">
            <Stack gap="md">
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Tax ID"
                    disabled={!isEditing}
                    leftSection={<IconFileInvoice size={16} />}
                    {...form.getInputProps('TaxId')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Registration Number"
                    disabled={!isEditing}
                    {...form.getInputProps('RegistrationNo')}
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Title order={5}>Tax Settings</Title>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Default VAT Rate"
                    disabled={!isEditing}
                    data={[
                      { value: '0', label: '0%' },
                      { value: '7', label: '7%' },
                      { value: '10', label: '10%' },
                    ]}
                    defaultValue="7"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Withholding Tax Rate"
                    disabled={!isEditing}
                    data={[
                      { value: '0', label: '0%' },
                      { value: '3', label: '3%' },
                      { value: '5', label: '5%' },
                    ]}
                    defaultValue="0"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={5}>Currency Settings</Title>

              <Grid>
                <Grid.Col span={4}>
                  <Select
                    label="Base Currency"
                    disabled={!isEditing}
                    data={['THB', 'USD', 'EUR', 'JPY', 'SGD']}
                    {...form.getInputProps('BaseCurrency')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Reporting Currency"
                    disabled={!isEditing}
                    data={['THB', 'USD', 'EUR', 'JPY', 'SGD']}
                    {...form.getInputProps('ReportCurrency')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Fiscal Year Start Month"
                    disabled={!isEditing}
                    data={[
                      { value: '1', label: 'January' },
                      { value: '4', label: 'April' },
                      { value: '7', label: 'July' },
                      { value: '10', label: 'October' },
                    ]}
                    defaultValue="1"
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Title order={5}>Date & Number Format</Title>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Date Format"
                    disabled={!isEditing}
                    data={[
                      { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
                      { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
                      { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
                    ]}
                    defaultValue="dd/MM/yyyy"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Number Format"
                    disabled={!isEditing}
                    data={[
                      { value: 'comma', label: '1,000,000.00' },
                      { value: 'dot', label: '1.000.000,00' },
                    ]}
                    defaultValue="comma"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
