import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useAllocationVoucherList,
  useAllocationVoucherDetail,
  useCreateAllocationVoucher,
  useUpdateAllocationVoucher,
  useDeleteAllocationVoucher,
  usePostAllocationVoucher,
} from '@/hooks/useAllocationVoucher';
import * as generalLedgerService from '@/services/generalLedger';
import type { AllocationVoucher, PagingResult } from '@/types';

// Mock the services
vi.mock('@/services/generalLedger', () => ({
  getAllocationJvSearchList: vi.fn(),
  getAllocationJvDetail: vi.fn(),
  createAllocationJvDetail: vi.fn(),
  updateAllocationJvDetail: vi.fn(),
  delAllocationJvDetail: vi.fn(),
  postAllocationJvDetail: vi.fn(),
}));

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

describe('Allocation Voucher Integration Tests', () => {
  let queryClient: QueryClient;

  const mockAllocationVoucherDetail: AllocationVoucher = {
    AJvhSeq: 1,
    AJvhDate: '2024-01-15',
    Prefix: 'AJ',
    AJvhNo: 'AJ-2024-0001',
    Status: 'Normal',
    Description: 'Test Allocation Voucher',
    SourceJvId: 1,
    Detail: [
      {
        index: 0,
        AJvdSeq: 1,
        AJvhSeq: 1,
        DeptCode: 'HQ',
        AccCode: '100-10-1001',
        Description: 'Source Entry',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 1000,
        DrBase: 1000,
        CrAmount: 0,
        CrBase: 0,
        DimList: { Dim: [] },
      },
      {
        index: 1,
        AJvdSeq: 2,
        AJvhSeq: 1,
        DeptCode: 'HQ',
        AccCode: '500-10-1001',
        Description: 'Allocation Entry',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: 1000,
        CrBase: 1000,
        DimList: { Dim: [] },
      },
    ],
    DimHList: { Dim: [] },
    UserModified: 'testuser',
  };

  const mockAllocationVoucherList: PagingResult<AllocationVoucher> = {
    Data: [mockAllocationVoucherDetail],
    Total: 1,
    Page: 1,
    PageSize: 10,
    TotalPages: 1,
  };

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAllocationVoucherList', () => {
    it('should fetch allocation voucher list successfully', async () => {
      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockResolvedValueOnce(mockAllocationVoucherList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        Status: 'All' as const,
      };

      const { result } = renderHook(() => useAllocationVoucherList(filterParams), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for success
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAllocationVoucherList);
      expect(generalLedgerService.getAllocationJvSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle error when fetching list fails', async () => {
      const error = new Error('Network error');
      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockRejectedValueOnce(error);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result } = renderHook(() => useAllocationVoucherList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should use placeholder data while loading new data', async () => {
      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockResolvedValueOnce(mockAllocationVoucherList);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result, rerender } = renderHook(
        (props) => useAllocationVoucherList({ ...props, Page: props.Page }),
        {
          wrapper: createWrapper(),
          initialProps: filterParams,
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Update page parameter
      rerender({ ...filterParams, Page: 2 });

      // Should still have previous data while loading
      expect(result.current.data).toEqual(mockAllocationVoucherList);
    });

    it('should handle filter by status', async () => {
      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockResolvedValueOnce(mockAllocationVoucherList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        Status: 'Normal' as const,
      };

      const { result } = renderHook(() => useAllocationVoucherList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(generalLedgerService.getAllocationJvSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle filter by date range', async () => {
      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockResolvedValueOnce(mockAllocationVoucherList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        FromDate: '2024-01-01',
        ToDate: '2024-01-31',
      };

      const { result } = renderHook(() => useAllocationVoucherList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(generalLedgerService.getAllocationJvSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should support pagination', async () => {
      const paginatedResult: PagingResult<AllocationVoucher> = {
        Data: [],
        Total: 25,
        Page: 2,
        PageSize: 10,
        TotalPages: 3,
      };

      vi.mocked(generalLedgerService.getAllocationJvSearchList).mockResolvedValueOnce(paginatedResult);

      const filterParams = {
        Limit: 10,
        Page: 2,
      };

      const { result } = renderHook(() => useAllocationVoucherList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.Page).toBe(2);
      expect(result.current.data?.TotalPages).toBe(3);
    });
  });

  describe('useAllocationVoucherDetail', () => {
    it('should fetch allocation voucher detail successfully', async () => {
      vi.mocked(generalLedgerService.getAllocationJvDetail).mockResolvedValueOnce(mockAllocationVoucherDetail);

      const { result } = renderHook(() => useAllocationVoucherDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAllocationVoucherDetail);
      expect(generalLedgerService.getAllocationJvDetail).toHaveBeenCalledWith(1);
    });

    it('should not fetch when AJvhSeq is 0', () => {
      const { result } = renderHook(() => useAllocationVoucherDetail(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when AJvhSeq is negative', () => {
      const { result } = renderHook(() => useAllocationVoucherDetail(-1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should handle error when fetching detail fails', async () => {
      const error = new Error('Not found');
      vi.mocked(generalLedgerService.getAllocationJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAllocationVoucherDetail(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Not found');
    });

    it('should contain source JV information', async () => {
      vi.mocked(generalLedgerService.getAllocationJvDetail).mockResolvedValueOnce(mockAllocationVoucherDetail);

      const { result } = renderHook(() => useAllocationVoucherDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.SourceJvId).toBe(1);
    });

    it('should contain allocation detail entries', async () => {
      vi.mocked(generalLedgerService.getAllocationJvDetail).mockResolvedValueOnce(mockAllocationVoucherDetail);

      const { result } = renderHook(() => useAllocationVoucherDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.Detail).toHaveLength(2);
      expect(result.current.data?.Detail?.[0].AccCode).toBe('100-10-1001');
      expect(result.current.data?.Detail?.[1].AccCode).toBe('500-10-1001');
    });
  });

  describe('useCreateAllocationVoucher', () => {
    it('should create allocation voucher successfully', async () => {
      const newVoucher = {
        AJvhDate: '2024-01-16',
        Prefix: 'AJ',
        AJvhNo: 'AJ-2024-0002',
        Status: 'Draft' as const,
        Description: 'New Allocation Voucher',
        SourceJvId: 2,
        Detail: [],
        DimHList: { Dim: [] },
        UserModified: 'testuser',
      };

      const createdVoucher = { ...newVoucher, AJvhSeq: 2 };
      vi.mocked(generalLedgerService.createAllocationJvDetail).mockResolvedValueOnce(createdVoucher);

      const { result } = renderHook(() => useCreateAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newVoucher);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdVoucher);
      expect(generalLedgerService.createAllocationJvDetail).toHaveBeenCalledTimes(1);
    });

    it('should handle creation error', async () => {
      const error = new Error('Validation failed');
      vi.mocked(generalLedgerService.createAllocationJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      const newVoucher = {
        AJvhDate: '2024-01-16',
        Prefix: 'AJ',
        AJvhNo: 'AJ-2024-0002',
        Status: 'Draft' as const,
        Description: 'New Allocation Voucher',
        SourceJvId: 2,
        Detail: [],
        DimHList: { Dim: [] },
        UserModified: 'testuser',
      };

      result.current.mutate(newVoucher);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Validation failed');
    });
  });

  describe('useUpdateAllocationVoucher', () => {
    it('should update allocation voucher successfully', async () => {
      const updatedVoucher = {
        ...mockAllocationVoucherDetail,
        Description: 'Updated Description',
      };

      vi.mocked(generalLedgerService.updateAllocationJvDetail).mockResolvedValueOnce(updatedVoucher);

      const { result } = renderHook(() => useUpdateAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updatedVoucher);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedVoucher);
      expect(generalLedgerService.updateAllocationJvDetail).toHaveBeenCalledTimes(1);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      vi.mocked(generalLedgerService.updateAllocationJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockAllocationVoucherDetail);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Update failed');
    });
  });

  describe('useDeleteAllocationVoucher', () => {
    it('should delete allocation voucher successfully', async () => {
      vi.mocked(generalLedgerService.delAllocationJvDetail).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        AJvhSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(generalLedgerService.delAllocationJvDetail).toHaveBeenCalledWith(
        1,
        'testuser',
        'Void reason'
      );
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot delete posted voucher');
      vi.mocked(generalLedgerService.delAllocationJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        AJvhSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot delete posted voucher');
    });
  });

  describe('usePostAllocationVoucher', () => {
    it('should post allocation voucher successfully', async () => {
      const postedVoucher = { ...mockAllocationVoucherDetail, Status: 'Normal' as const };
      vi.mocked(generalLedgerService.postAllocationJvDetail).mockResolvedValueOnce(postedVoucher);

      const { result } = renderHook(() => usePostAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(postedVoucher);
      expect(generalLedgerService.postAllocationJvDetail).toHaveBeenCalledWith(1);
    });

    it('should handle post error', async () => {
      const error = new Error('Cannot post - unbalanced entries');
      vi.mocked(generalLedgerService.postAllocationJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePostAllocationVoucher(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot post - unbalanced entries');
    });
  });
});
