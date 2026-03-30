import { Menu, Button, Text, Avatar } from '@mantine/core';
import { IconUser, IconLock, IconLogout } from '@tabler/icons-react';

interface UserMenuProps {
  user: {
    UserName: string;
    FullName: string;
    Email: string;
  } | null;
  onLogout: () => void;
  onChangePassword: () => void;
  onProfile: () => void;
}

export function UserMenu({
  user,
  onLogout,
  onChangePassword,
  onProfile,
}: UserMenuProps) {
  if (!user) return null;

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Button variant="subtle" leftSection={<Avatar size="sm" radius="xl" />}>
          <Text size="sm" fw={500}>
            {user.FullName}
          </Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text size="xs" c="dimmed">
            {user.Email}
          </Text>
        </Menu.Label>
        <Menu.Divider />
        <Menu.Item leftSection={<IconUser size={14} />} onClick={onProfile}>
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLock size={14} />}
          onClick={onChangePassword}
        >
          Change Password
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={onLogout}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
