/**
 * FilterPanel Component
 * Search and filter panel for list views
 */

import {
  Paper,
  Grid,
  TextInput,
  Select,
  Group,
  Button,
  Collapse,
  Box,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconFilter, IconX, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useState, useCallback } from 'react';

export type FilterFieldType = 'text' | 'number' | 'date' | 'dateRange' | 'select' | 'multiselect' | 'boolean';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
  width?: number;
}

export interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onApply: () => void;
  onReset: () => void;
  loading?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FilterPanel({
  fields,
  values,
  onChange,
  onApply,
  onReset,
  loading = false,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  collapsible = true,
  defaultExpanded = false,
}: FilterPanelProps) {
  const [expanded, { toggle }] = useDisclosure(defaultExpanded);
  const [localValues, setLocalValues] = useState(values);

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      const newValues = { ...localValues, [key]: value };
      setLocalValues(newValues);
      onChange(newValues);
    },
    [localValues, onChange]
  );

  const handleReset = useCallback(() => {
    setLocalValues({});
    onReset();
  }, [onReset]);

  const handleApply = useCallback(() => {
    onApply();
    if (collapsible) {
      toggle();
    }
  }, [onApply, collapsible, toggle]);

  const renderField = (field: FilterField) => {
    const value = localValues[field.key];

    switch (field.type) {
      case 'select':
        return (
          <Select
            label={field.label}
            placeholder={field.placeholder || `Select ${field.label}`}
            value={(value as string) || ''}
            onChange={(val) => handleFieldChange(field.key, val)}
            data={field.options || []}
            clearable
            searchable={field.options && field.options.length > 10}
          />
        );
      case 'date':
        return (
          <DatePickerInput
            label={field.label}
            placeholder={field.placeholder || `Select ${field.label}`}
            value={value as Date | null}
            onChange={(date) => handleFieldChange(field.key, date as Date | null)}
            clearable
          />
        );
      case 'dateRange':
        const dateRange = (value as [Date | null, Date | null]) || [null, null];
        return (
          <DatePickerInput
            label={field.label}
            placeholder={field.placeholder || `Select ${field.label} range`}
            value={dateRange}
            onChange={(dates) => handleFieldChange(field.key, dates as [Date | null, Date | null])}
            type="range"
            clearable
          />
        );
      default:
        return (
          <TextInput
            label={field.label}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
    }
  };

  const hasActiveFilters = Object.keys(localValues).some(
    (key) => localValues[key] !== undefined && localValues[key] !== '' && localValues[key] !== null
  );

  return (
    <Paper withBorder p="md" mb="md">
      {/* Search Row */}
      {showSearch && (
        <Group mb={collapsible && fields.length > 0 ? 'md' : 0}>
          <TextInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          {collapsible && fields.length > 0 && (
            <Button
              variant="light"
              leftSection={<IconFilter size={16} />}
              rightSection={expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              onClick={toggle}
              color={hasActiveFilters ? 'blue' : 'gray'}
            >
              Filters {hasActiveFilters && '(Active)'}
            </Button>
          )}
        </Group>
      )}

      {/* Filter Fields */}
      <Collapse in={!collapsible || expanded || !showSearch}>
        <Box mt={showSearch ? 'md' : undefined}>
          <Grid gutter="md">
            {fields.map((field) => (
              <Grid.Col key={field.key} span={field.width || 3}>
                {renderField(field)}
              </Grid.Col>
            ))}
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              leftSection={<IconX size={16} />}
              onClick={handleReset}
              disabled={!hasActiveFilters && !searchValue}
            >
              Reset
            </Button>
            <Button leftSection={<IconSearch size={16} />} onClick={handleApply} loading={loading}>
              Apply Filters
            </Button>
          </Group>
        </Box>
      </Collapse>
    </Paper>
  );
}
