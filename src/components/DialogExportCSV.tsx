import { Modal, Group, Text, Button, Checkbox, Stack, Paper, Divider, Select, TextInput, Grid } from '@mantine/core';
import { IconDownload, IconFileTypeCsv, IconSettings } from '@tabler/icons-react';
import { useState } from 'react';

export interface ExportColumn {
  key: string;
  label: string;
  checked: boolean;
}

interface DialogExportCSVProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  columns: ExportColumn[];
  onExport: (selectedColumns: string[], options: ExportOptions) => void;
  loading?: boolean;
}

export interface ExportOptions {
  filename: string;
  delimiter: string;
  includeHeader: boolean;
  dateFormat: string;
  numberFormat: string;
}

const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2024)' },
];

const numberFormatOptions = [
  { value: 'en-US', label: '1,234.56 (US/UK)' },
  { value: 'de-DE', label: '1.234,56 (European)' },
  { value: 'fr-FR', label: '1 234,56 (French)' },
];

const delimiterOptions = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' },
];

export function DialogExportCSV({
  opened,
  onClose,
  title = 'Export to CSV',
  columns,
  onExport,
  loading = false,
}: DialogExportCSVProps) {
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn[]>(columns);
  const [filename, setFilename] = useState('export');
  const [delimiter, setDelimiter] = useState(',');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [numberFormat, setNumberFormat] = useState('en-US');

  // Update selected columns when columns prop changes
  useState(() => {
    setSelectedColumns(columns);
  });

  const handleToggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, checked: !col.checked } : col
      )
    );
  };

  const handleSelectAll = () => {
    const allChecked = selectedColumns.every((col) => col.checked);
    setSelectedColumns((prev) =>
      prev.map((col) => ({ ...col, checked: !allChecked }))
    );
  };

  const handleExport = () => {
    const checkedColumns = selectedColumns
      .filter((col) => col.checked)
      .map((col) => col.key);
    
    if (checkedColumns.length === 0) {
      return;
    }

    onExport(checkedColumns, {
      filename: filename.replace(/\.csv$/i, ''),
      delimiter,
      includeHeader,
      dateFormat,
      numberFormat,
    });
  };

  const checkedCount = selectedColumns.filter((col) => col.checked).length;
  const allChecked = selectedColumns.length > 0 && selectedColumns.every((col) => col.checked);

  return (
    <Modal opened={opened} onClose={onClose} title={title} size="lg">
      <Stack gap="md">
        {/* Column Selection */}
        <Paper withBorder p="md">
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <IconFileTypeCsv size={20} color="#228be6" />
              <Text fw={500}>Select Columns to Export</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {checkedCount} of {selectedColumns.length} selected
            </Text>
          </Group>

          <Checkbox
            label="Select All"
            checked={allChecked}
            indeterminate={checkedCount > 0 && checkedCount < selectedColumns.length}
            onChange={handleSelectAll}
            mb="sm"
          />

          <Divider mb="sm" />

          <Grid gutter="xs">
            {selectedColumns.map((column) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={column.key}>
                <Checkbox
                  label={column.label}
                  checked={column.checked}
                  onChange={() => handleToggleColumn(column.key)}
                />
              </Grid.Col>
            ))}
          </Grid>

          {selectedColumns.length === 0 && (
            <Text c="dimmed" ta="center" py="md">
              No columns available for export
            </Text>
          )}
        </Paper>

        {/* Export Options */}
        <Paper withBorder p="md">
          <Group gap="xs" mb="md">
            <IconSettings size={20} color="#228be6" />
            <Text fw={500}>Export Options</Text>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="export"
                rightSection={<Text size="xs" c="dimmed">.csv</Text>}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Delimiter"
                value={delimiter}
                onChange={(value) => setDelimiter(value || ',')}
                data={delimiterOptions}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Date Format"
                value={dateFormat}
                onChange={(value) => setDateFormat(value || 'DD/MM/YYYY')}
                data={dateFormatOptions}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Number Format"
                value={numberFormat}
                onChange={(value) => setNumberFormat(value || 'en-US')}
                data={numberFormatOptions}
              />
            </Grid.Col>
          </Grid>

          <Checkbox
            label="Include header row"
            checked={includeHeader}
            onChange={(e) => setIncludeHeader(e.currentTarget.checked)}
            mt="md"
          />
        </Paper>

        {/* Actions */}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
            loading={loading}
            disabled={checkedCount === 0 || !filename.trim()}
            color="blue"
          >
            Export CSV
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
