import { AppShell as MantineAppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router';
import { NavbarMenu } from './NavbarMenu';
import { UserMenu } from './UserMenu';
import { useAuthStore } from '../contexts/AuthContext';

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Use actual user data from auth store, fallback for TypeScript
  // Note: user can be an empty object {} during store rehydration, which is truthy
  // So we check for actual UserName or Permissions to determine if user is loaded
  const currentUser = user?.UserName
    ? user
    : {
        UserName: 'admin',
        FullName: 'Administrator',
        Email: 'admin@carmen.com',
        Permissions: ['Sys.Administration'],
      };

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="lg" fw={700}>
              Carmen Web
            </Text>
          </Group>
          <UserMenu
            user={currentUser}
            onLogout={handleLogout}
            onChangePassword={() => {}}
            onProfile={() => {}}
          />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <NavbarMenu permissions={currentUser.Permissions} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
