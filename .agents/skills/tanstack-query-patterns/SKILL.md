---
name: tanstack-query-patterns
description: TanStack Query v5 patterns for server state management in Carmen.Web. Use when creating API hooks, handling mutations, caching, or synchronizing server data.
---

# TanStack Query Patterns

This skill provides patterns for using TanStack Query v5 in Carmen.Web for server state management.

## Installation

Already installed:
- `@tanstack/react-query@^5.90.7`
- `@tanstack/react-query-devtools@^5.90.7`

## Query Client Setup

Query client is configured in `@lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (was cacheTime in v4)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## Basic Query Hook

```tsx
import { useQuery } from '@tanstack/react-query';
import { getJvDetail } from '@services/generalLedger';
import type { JournalVoucher } from '@types';

const QUERY_KEYS = {
  jv: {
    list: 'jvList',
    detail: 'jvDetail',
  },
} as const;

// Detail query
export function useJvDetail(JvhSeq: number) {
  return useQuery<JournalVoucher, Error>({
    queryKey: [QUERY_KEYS.jv.detail, JvhSeq],
    queryFn: () => getJvDetail(JvhSeq),
    enabled: JvhSeq > 0,
    staleTime: 60000,
  });
}
```

## List Query with Filtering

```tsx
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export function useJvList(params: JvFilterParams) {
  return useQuery<PagingResult<JournalVoucher>, Error>({
    queryKey: [QUERY_KEYS.jv.list, params],
    queryFn: () => getJvSearchList(params),
    placeholderData: keepPreviousData, // Keep old data while fetching new
    staleTime: 30000,
  });
}
```

## Mutation Hook Pattern

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export function useCreateJv() {
  const queryClient = useQueryClient();

  return useMutation<JournalVoucher, Error, CreateJvInput>({
    mutationFn: createJvDetail,
    
    // Success handler
    onSuccess: (data) => {
      // Invalidate list to refresh
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.jv.list] 
      });
      
      // Optionally add to cache
      queryClient.setQueryData(
        [QUERY_KEYS.jv.detail, data.JvhSeq],
        data
      );
      
      notifications.show({
        title: 'Success',
        message: 'Journal voucher created',
        color: 'green',
      });
    },
    
    // Error handler
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}
```

## Optimistic Updates

```tsx
export function useUpdateJv() {
  const queryClient = useQueryClient();

  return useMutation<JournalVoucher, Error, JournalVoucher>({
    mutationFn: updateJvDetail,
    
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.jv.detail, newData.JvhSeq],
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<JournalVoucher>([
        QUERY_KEYS.jv.detail,
        newData.JvhSeq,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        [QUERY_KEYS.jv.detail, newData.JvhSeq],
        newData
      );

      return { previousData };
    },
    
    // Rollback on error
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEYS.jv.detail, newData.JvhSeq],
          context.previousData
        );
      }
    },
    
    // Always refetch after error or success
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.jv.detail, data.JvhSeq],
        });
      }
    },
  });
}
```

## Infinite Scroll (Load More)

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

export function useJvListInfinite(filters: JvFilterParams) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.jv.list, 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      getJvSearchList({ ...filters, Page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.Page < lastPage.TotalPages) {
        return lastPage.Page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

// Usage
function LoadMoreList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useJvListInfinite({ Limit: 25 });

  const allRows = data?.pages.flatMap((page) => page.Data) ?? [];

  return (
    <>
      <Table data={allRows} />
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
        >
          Load More
        </Button>
      )}
    </>
  );
}
```

## Prefetching Data

```tsx
// Prefetch on hover
const queryClient = useQueryClient();

const handleMouseEnter = (JvhSeq: number) => {
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.jv.detail, JvhSeq],
    queryFn: () => getJvDetail(JvhSeq),
    staleTime: 60000,
  });
};

// Prefetch related data
const prefetchRelated = async (voucher: JournalVoucher) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['dimensions', voucher.DimHList],
      queryFn: () => getDimensions(voucher.DimHList),
    }),
    queryClient.prefetchQuery({
      queryKey: ['accounts', voucher.Detail[0]?.AccCode],
      queryFn: () => getAccountDetail(voucher.Detail[0]?.AccCode),
    }),
  ]);
};
```

## Query Key Patterns

```typescript
// Hierarchical query keys for easy invalidation
export const queryKeys = {
  jv: {
    all: ['jv'] as const,
    lists: () => [...queryKeys.jv.all, 'list'] as const,
    list: (filters: JvFilterParams) => [...queryKeys.jv.lists(), filters] as const,
    details: () => [...queryKeys.jv.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.jv.details(), id] as const,
  },
  ap: {
    all: ['ap'] as const,
    invoice: {
      all: () => [...queryKeys.ap.all, 'invoice'] as const,
      list: (filters: ApInvoiceFilterParams) =>
        [...queryKeys.ap.invoice.all(), filters] as const,
      detail: (id: number) =>
        [...queryKeys.ap.invoice.all(), id] as const,
    },
  },
};

// Usage
queryClient.invalidateQueries({ queryKey: queryKeys.jv.lists() }); // All lists
queryClient.invalidateQueries({ queryKey: queryKeys.jv.all }); // Everything JV
```

## Loading States Pattern

```tsx
function JournalVoucherPage({ JvhSeq }: { JvhSeq: number }) {
  const { data, isLoading, isError, error } = useJvDetail(JvhSeq);

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data) {
    return <NotFoundDisplay />;
  }

  return <JournalVoucherForm initialData={data} />;
}
```

## Parallel Queries

```tsx
function Dashboard() {
  // These run in parallel
  const jvQuery = useJvList({ Limit: 5 });
  const apQuery = useApInvoiceList({ Limit: 5 });
  const arQuery = useArInvoiceList({ Limit: 5 });

  const isLoading = jvQuery.isLoading || apQuery.isLoading || arQuery.isLoading;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <DashboardLayout
      recentJVs={jvQuery.data?.Data}
      recentAPs={apQuery.data?.Data}
      recentARs={arQuery.data?.Data}
    />
  );
}
```

## Dependent Queries

```tsx
function VoucherWithAccount({ JvhSeq }: { JvhSeq: number }) {
  // First, fetch the voucher
  const jvQuery = useJvDetail(JvhSeq);

  // Then, fetch account details based on voucher data
  const accountQuery = useAccountDetail(
    jvQuery.data?.Detail[0]?.AccCode ?? '',
    {
      enabled: jvQuery.isSuccess && !!jvQuery.data?.Detail[0]?.AccCode,
    }
  );

  return (
    <>
      {jvQuery.isLoading && <LoadingSpinner />}
      {jvQuery.data && <VoucherDisplay data={jvQuery.data} />}
      {accountQuery.data && <AccountInfo data={accountQuery.data} />}
    </>
  );
}
```

## Global Error Handling

```tsx
// In query client config
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.errorMessage) {
        notifications.show({
          title: 'Error',
          message: query.meta.errorMessage as string,
          color: 'red',
        });
      }
    },
  }),
});

// Usage
useQuery({
  queryKey: ['jv', id],
  queryFn: () => getJvDetail(id),
  meta: {
    errorMessage: 'Failed to load journal voucher',
  },
});
```

## Mutation with Confirmation

```tsx
import { modals } from '@mantine/modals';

export function useDeleteJvWithConfirm() {
  const deleteMutation = useDeleteJv();

  const confirmDelete = (JvhSeq: number) => {
    modals.openConfirmModal({
      title: 'Delete Journal Voucher',
      children: 'Are you sure? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteMutation.mutate({
          JvhSeq,
          username: getCurrentUser(),
          remark: 'User deleted',
        });
      },
    });
  };

  return { confirmDelete, isDeleting: deleteMutation.isPending };
}
```
