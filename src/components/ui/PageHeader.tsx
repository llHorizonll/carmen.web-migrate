/**
 * PageHeader Component
 * Consistent page header with title, actions, and breadcrumbs
 */

import { Group, Title, Text, Breadcrumbs, Anchor, Box } from '@mantine/core';
import { Link } from 'react-router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box mb="lg">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs mb="sm">
          {breadcrumbs.map((crumb, index) =>
            crumb.href ? (
              <Anchor key={index} component={Link} to={crumb.href}>
                {crumb.label}
              </Anchor>
            ) : (
              <Text key={index}>{crumb.label}</Text>
            )
          )}
        </Breadcrumbs>
      )}
      
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{title}</Title>
          {subtitle && (
            <Text c="dimmed" size="sm" mt={4}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <Group>{actions}</Group>}
      </Group>
    </Box>
  );
}
