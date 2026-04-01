/**
 * StatusBadge Component
 * Displays status with appropriate colors
 */

import { Badge } from '@mantine/core';

export type StatusType = 'Draft' | 'Normal' | 'Void' | 'Active' | 'Inactive' | 'Pending';

export interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline' | 'dot';
}

const statusConfig: Record<
  string,
  { color: string; label: string }
> = {
  Draft: { color: 'gray', label: 'Draft' },
  Normal: { color: 'blue', label: 'Normal' },
  Void: { color: 'red', label: 'Void' },
  Active: { color: 'green', label: 'Active' },
  Inactive: { color: 'gray', label: 'Inactive' },
  Pending: { color: 'yellow', label: 'Pending' },
  Approved: { color: 'green', label: 'Approved' },
  Rejected: { color: 'red', label: 'Rejected' },
  Posted: { color: 'teal', label: 'Posted' },
  Unposted: { color: 'orange', label: 'Unposted' },
};

export function StatusBadge({
  status,
  size = 'sm',
  variant = 'filled',
}: StatusBadgeProps) {
  const config = statusConfig[status] || { color: 'gray', label: status };

  if (variant === 'dot') {
    return (
      <Badge
        size={size}
        variant="light"
        color={config.color}
        leftSection={
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: `var(--mantine-color-${config.color}-filled)`,
            }}
          />
        }
      >
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge size={size} variant={variant} color={config.color}>
      {config.label}
    </Badge>
  );
}
