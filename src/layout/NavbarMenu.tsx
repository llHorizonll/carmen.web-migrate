import { NavLink, Stack, Text, Group } from '@mantine/core';
import {
  IconChartBar,
  IconCreditCard,
  IconCoins,
  IconBuildingWarehouse,
  IconSettings,
} from '@tabler/icons-react';
import { hasPermission, type Permission } from '../utils/constants';
import type { NavItem } from '../types';

const navigation: NavItem[] = [
  {
    label: 'General Ledger',
    icon: 'IconChartBar',
    children: [
      { label: 'Journal Voucher', href: '/gl/journal-voucher', permit: 'GL.Jv' },
      {
        label: 'Allocation Voucher',
        href: '/gl/allocation-voucher',
        permit: 'GL.AllocationJv',
      },
      {
        label: 'Template Voucher',
        href: '/gl/template-voucher',
        permit: 'GL.StdJv',
      },
      {
        label: 'Recurring Voucher',
        href: '/gl/recurring-voucher',
        permit: 'GL.RecurringStdJv',
      },
      {
        label: 'Amortization Voucher',
        href: '/gl/amortization-voucher',
        permit: 'GL.AmortizationStdJv',
      },
      {
        label: 'Account Summary',
        href: '/gl/account-summary',
        permit: 'GL.Report',
      },
      {
        label: 'Financial Report',
        href: '/gl/financial-report',
        permit: 'GL.FinancialReport',
      },
      {
        label: 'Chart of Accounts',
        href: '/gl/chart-of-accounts',
        permit: 'GL.ChartOfAccount',
      },
      { label: 'Budget', href: '/gl/budget', permit: 'GL.Budget' },
    ],
  },
  {
    label: 'Accounts Payable',
    icon: 'IconCreditCard',
    children: [
      { label: 'AP Vendor', href: '/ap/vendor', permit: 'AP.Vendor' },
      { label: 'AP Invoice', href: '/ap/invoice', permit: 'AP.Invoice' },
      { label: 'AP Payment', href: '/ap/payment', permit: 'AP.Payment' },
      { label: 'Procedures', href: '/ap/procedures', permit: 'AP.Report' },
    ],
  },
  {
    label: 'Accounts Receivable',
    icon: 'IconCoins',
    children: [
      { label: 'AR Profile', href: '/ar/profile', permit: 'AR.Profile' },
      { label: 'AR Folio', href: '/ar/folio', permit: 'AR.Folio' },
      { label: 'AR Invoice', href: '/ar/invoice', permit: 'AR.Invoice' },
      { label: 'AR Receipt', href: '/ar/receipt', permit: 'AR.Receipt' },
      { label: 'Procedures', href: '/ar/procedures', permit: 'AR.Procedure.ApplyContract' },
    ],
  },
  {
    label: 'Asset Management',
    icon: 'IconBuildingWarehouse',
    children: [
      { label: 'Asset Register', href: '/asset/register', permit: 'Ast.Register' },
      { label: 'Pre-Asset', href: '/asset/pre-asset', permit: 'Ast.Register' },
      { label: 'Asset Disposal', href: '/asset/disposal', permit: 'Ast.Disposal' },
      { label: 'Asset Vendor', href: '/asset/vendor', permit: 'Ast.Vendor' },
      { label: 'Procedures', href: '/asset/procedures', permit: 'Ast.Procedure.PeriodEnd' },
    ],
  },
  {
    label: 'Configuration',
    icon: 'IconSettings',
    children: [
      { label: 'Company', href: '/config/company', permit: 'Sys.Company' },
      { label: 'Users', href: '/config/users', permit: 'Sys.User' },
      { label: 'Permissions', href: '/config/permissions', permit: 'Sys.Permission' },
      { label: 'Workflow', href: '/config/workflow', permit: 'Sys.Workflow' },
      { label: 'Settings', href: '/config/settings', permit: 'Sys.Setting' },
    ],
  },
];

const iconMap: Record<string, React.ElementType> = {
  IconChartBar,
  IconCreditCard,
  IconCoins,
  IconBuildingWarehouse,
  IconSettings,
};

interface NavbarMenuProps {
  permissions: string[];
}

export function NavbarMenu({ permissions }: NavbarMenuProps) {
  const renderNavItem = (item: NavItem, level = 0) => {
    const hasPerm = item.permit
      ? hasPermission(permissions, item.permit as Permission)
      : true;

    if (!hasPerm) return null;

    if (item.children) {
      const Icon = iconMap[item.icon || ''];
      return (
        <Stack key={item.label} gap={4}>
          <Group gap="xs" px="sm" py={4}>
            {Icon && <Icon size={18} />}
            <Text size="sm" fw={600}>
              {item.label}
            </Text>
          </Group>
          <Stack gap={2} pl="md">
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </Stack>
        </Stack>
      );
    }

    return (
      <NavLink
        key={item.label}
        label={item.label}
        href={item.href}
        px="sm"
        py={4}
      />
    );
  };

  return (
    <Stack gap="md">
      {navigation.map((item) => renderNavItem(item))}
    </Stack>
  );
}
