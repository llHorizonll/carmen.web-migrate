import {
  Table,
  Button,
  Group,
  ActionIcon,
  Text,
  Box,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import classes from './InlineTable.module.css';

export interface InlineTableColumn {
  key: string;
  header: string;
  width?: number;
  editable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

export interface InlineTableProps {
  columns: InlineTableColumn[];
  data: Record<string, any>[];
  onChange: (data: Record<string, any>[]) => void;
  onAddRow?: () => void;
  onDeleteRow?: (index: number) => void;
  emptyMessage?: string;
  maxHeight?: number;
}

export function InlineTable({
  columns,
  data,
  onChange,
  onAddRow,
  onDeleteRow,
  emptyMessage = 'No items',
  maxHeight = 400,
}: InlineTableProps) {
  const handleCellChange = (rowIndex: number, columnKey: string, value: any) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: value };
    onChange(newData);
  };

  const handleAddRow = () => {
    if (onAddRow) {
      onAddRow();
    } else {
      const newRow: Record<string, any> = {};
      columns.forEach((col) => {
        newRow[col.key] = col.type === 'number' ? 0 : '';
      });
      onChange([...data, newRow]);
    }
  };

  const handleDeleteRow = (index: number) => {
    if (onDeleteRow) {
      onDeleteRow(index);
    } else {
      const newData = data.filter((_, i) => i !== index);
      onChange(newData);
    }
  };

  return (
    <Box>
      <Box className={classes.tableContainer} style={{ maxHeight }}>
        <Table striped highlightOnHover withTableBorder data-size="sm">
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={col.key} style={{ width: col.width }}>
                  {col.header}
                </Table.Th>
              ))}
              <Table.Th style={{ width: 50 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + 1}>
                  <Text ta="center" c="dimmed" py="md">
                    {emptyMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((row, rowIndex) => (
                <Table.Tr key={rowIndex}>
                  {columns.map((col) => (
                    <Table.Td key={col.key}>
                      {col.editable ? (
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          value={row[col.key] || ''}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              col.key,
                              col.type === 'number' ? Number(e.target.value) : e.target.value
                            )
                          }
                          className={classes.editableCell}
                        />
                      ) : (
                        row[col.key]
                      )}
                    </Table.Td>
                  ))}
                  <Table.Td>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDeleteRow(rowIndex)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>
      <Group mt="sm">
        <Button leftSection={<IconPlus size={16} />} onClick={handleAddRow} size="sm">
          Add Row
        </Button>
      </Group>
    </Box>
  );
}
