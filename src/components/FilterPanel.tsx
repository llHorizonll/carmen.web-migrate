import {
  Paper,
  Group,
  TextInput,
  Select,
  Button,
  ActionIcon,
  Collapse,
  Text,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter, IconX, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: FilterField[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  collapsed?: boolean;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onSearch,
  onReset,
  loading = false,
  collapsed = false,
}: FilterPanelProps) {
  const [opened, { toggle }] = useDisclosure(!collapsed);

  const handleChange = (name: string, value: any) => {
    onChange({ ...values, [name]: value });
  };

  const handleReset = () => {
    const emptyValues: Record<string, any> = {};
    filters.forEach((f) => {
      emptyValues[f.name] = f.type === 'boolean' ? false : '';
    });
    onChange(emptyValues);
    onReset();
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            style={{ minWidth: 200 }}
          />
        );
      case 'select':
        return (
          <Select
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            data={field.options || []}
            value={values[field.name] || null}
            onChange={(value: string | null) => handleChange(field.name, value)}
            clearable
            style={{ minWidth: 200 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper withBorder p="md" radius="sm" mb="md">
      <Group justify="space-between" mb={opened ? 'md' : 0}>
        <Group>
          <ActionIcon variant="light" size="lg" color="blue">
            <IconFilter size={20} />
          </ActionIcon>
          <Text fw={500}>Filters</Text>
        </Group>
        <ActionIcon variant="subtle" onClick={toggle}>
          {opened ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </ActionIcon>
      </Group>

      <Collapse in={opened}>
        <Group align="flex-end" gap="md" mb="md">
          {filters.map((field) => renderField(field))}
        </Group>

        <Divider my="sm" />

        <Group justify="flex-end">
          <Button
            leftSection={<IconX size={16} />}
            variant="subtle"
            color="gray"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            leftSection={<IconSearch size={16} />}
            onClick={onSearch}
            loading={loading}
          >
            Search
          </Button>
        </Group>
      </Collapse>
    </Paper>
  );
}
