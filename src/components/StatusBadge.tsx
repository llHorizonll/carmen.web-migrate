import { Badge } from '@mantine/core';

export type StatusType = 
  | 'draft'
  | 'normal'
  | 'active'
  | 'inactive'
  | 'void'
  | 'posted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'warning'
  | 'error'
  | 'success';

export interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'light' | 'outline' | 'dot';
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  draft: { color: 'gray', label: 'Draft' },
  normal: { color: 'blue', label: 'Normal' },
  active: { color: 'green', label: 'Active' },
  inactive: { color: 'gray', label: 'Inactive' },
  void: { color: 'red', label: 'Void' },
  posted: { color: 'green', label: 'Posted' },
  pending: { color: 'yellow', label: 'Pending' },
  approved: { color: 'green', label: 'Approved' },
  rejected: { color: 'red', label: 'Rejected' },
  cancelled: { color: 'gray', label: 'Cancelled' },
  completed: { color: 'green', label: 'Completed' },
  warning: { color: 'orange', label: 'Warning' },
  error: { color: 'red', label: 'Error' },
  success: { color: 'green', label: 'Success' },
};

export function StatusBadge({ status, size = 'sm', variant = 'filled' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase() as StatusType] || {
    color: 'gray',
    label: status,
  };

  if (variant === 'dot') {
    return (
      <Badge
        size={size}
        variant="light"
        color={config.color}
        leftSection={
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: `var(--mantine-color-${config.color}-filled)`,
              display: 'inline-block',
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
