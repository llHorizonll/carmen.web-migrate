/**
 * ActionMenu Component
 * Dropdown menu for row actions (Edit, View, Delete, etc.)
 */

import { Menu, ActionIcon, type MenuProps } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'gray';
  divider?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'subtle' | 'light' | 'filled' | 'outline';
  color?: string;
  position?: MenuProps['position'];
}

export function ActionMenu({
  items,
  size = 'sm',
  variant = 'subtle',
  color = 'gray',
  position = 'bottom-end',
}: ActionMenuProps) {
  const visibleItems = items.filter((item) => !item.hidden);

  if (visibleItems.length === 0) return null;

  return (
    <Menu position={position} withArrow>
      <Menu.Target>
        <ActionIcon variant={variant} color={color} size={size}>
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {visibleItems.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            {item.divider && index > 0 && <Menu.Divider />}
            <Menu.Item
              leftSection={item.icon}
              onClick={item.onClick}
              disabled={item.disabled}
              color={item.color}
            >
              {item.label}
            </Menu.Item>
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

// Preset action creators for common operations
export function createEditAction(onClick: () => void, disabled = false): ActionMenuItem {
  return {
    label: 'Edit',
    icon: <IconEdit size={16} />,
    onClick,
    disabled,
    color: 'blue',
  };
}

export function createViewAction(onClick: () => void): ActionMenuItem {
  return {
    label: 'View',
    icon: <IconEye size={16} />,
    onClick,
    color: 'blue',
  };
}

export function createDeleteAction(
  onClick: () => void,
  disabled = false
): ActionMenuItem {
  return {
    label: 'Delete',
    icon: <IconTrash size={16} />,
    onClick,
    disabled,
    color: 'red',
    divider: true,
  };
}
