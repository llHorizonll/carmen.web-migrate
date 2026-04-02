import { useState } from 'react';
import {
  Menu,
  ActionIcon,
  Box,
} from '@mantine/core';
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconPrinter,
  IconCopy,
  IconFileExport,
} from '@tabler/icons-react';
import type { PermissionAction } from '@/utils/permissions';

export interface ActionItem {
  name: string;
  icon?: React.ReactNode;
  onClick: () => void;
  permission?: PermissionAction;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
  hidden?: boolean;
}

export interface ActionMenuProps {
  actions: ActionItem[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onCopy?: () => void;
  onExport?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline' | 'subtle';
  color?: string;
  userPermissions?: string[];
}

export function ActionMenu({
  actions,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onCopy,
  onExport,
  size = 'sm',
  variant = 'light',
  color = 'blue',
  userPermissions = [],
}: ActionMenuProps) {
  const [opened, setOpened] = useState(false);

  const handleAction = (action: ActionItem) => {
    if (action.disabled) return;
    action.onClick();
    setOpened(false);
  };

  const visibleActions = actions.filter(
    (action) =>
      !action.hidden &&
      (!action.permission || userPermissions.includes(action.permission))
  );

  return (
    <Box>
      <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant={variant} size={size} color={color}>
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {onView && (
            <Menu.Item
              leftSection={<IconEye size={16} />}
              onClick={() => {
                onView();
                setOpened(false);
              }}
            >
              View
            </Menu.Item>
          )}
          
          {onEdit && (
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => {
                onEdit();
                setOpened(false);
              }}
            >
              Edit
            </Menu.Item>
          )}
          
          {onCopy && (
            <Menu.Item
              leftSection={<IconCopy size={16} />}
              onClick={() => {
                onCopy();
                setOpened(false);
              }}
            >
              Copy
            </Menu.Item>
          )}
          
          {onPrint && (
            <Menu.Item
              leftSection={<IconPrinter size={16} />}
              onClick={() => {
                onPrint();
                setOpened(false);
              }}
            >
              Print
            </Menu.Item>
          )}
          
          {onExport && (
            <Menu.Item
              leftSection={<IconFileExport size={16} />}
              onClick={() => {
                onExport();
                setOpened(false);
              }}
            >
              Export
            </Menu.Item>
          )}
          
          {(onView || onEdit || onCopy || onPrint || onExport) && (onDelete || visibleActions.length > 0) && (
            <Menu.Divider />
          )}
          
          {onDelete && (
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={() => {
                onDelete();
                setOpened(false);
              }}
            >
              Delete
            </Menu.Item>
          )}
          
          {visibleActions.map((action, index) => (
            <Menu.Item
              key={index}
              leftSection={action.icon}
              color={action.variant === 'danger' ? 'red' : undefined}
              disabled={action.disabled}
              onClick={() => handleAction(action)}
            >
              {action.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
