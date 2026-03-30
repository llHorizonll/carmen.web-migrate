import { AppShell as MantineAppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { NavbarMenu } from './NavbarMenu';
import { UserMenu } from './UserMenu';

export function AppShell() {
  const [opened, { toggle }] = useDisclosure();

  // TODO: Replace with actual auth context
  const user = {
    UserName: 'admin',
    FullName: 'Administrator',
    Email: 'admin@carmen.com',
    Permissions: ['Sys.Administration'],
  };

  const handleLogout = () => {
    localStorage.removeItem('AccessToken');
    window.location.href = '/#/login';
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
            user={user}
            onLogout={handleLogout}
            onChangePassword={() => {}}
            onProfile={() => {}}
          />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="md">
        <NavbarMenu permissions={user.Permissions} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
