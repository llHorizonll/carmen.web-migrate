import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useJvList,
  useJvDetail,
  useCreateJv,
  useUpdateJv,
  useDeleteJv,
} from '@/hooks/useJournalVoucher';
import * as generalLedgerService from '@/services/generalLedger';
import type { JournalVoucher, PagingResult } from '@/types';

// Mock the services
vi.mock('@/services/generalLedger', () => ({
  getJvSearchList: vi.fn(),
  getJvDetail: vi.fn(),
  createJvDetail: vi.fn(),
  updateJvDetail: vi.fn(),
  delJvDetail: vi.fn(),
}));

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

describe('Journal Voucher Integration Tests', () => {
  let queryClient: QueryClient;

  const mockJvDetail: JournalVoucher = {
    JvhSeq: 1,
    JvhDate: '2024-01-15',
    Prefix: 'JV',
    JvhNo: 'JV-2024-0001',
    JvhSource: 'Manual',
    Status: 'Normal',
    Description: 'Test Journal Voucher',
    Detail: [
      {
        index: 0,
        JvdSeq: 1,
        JvhSeq: 1,
        DeptCode: 'HQ',
        AccCode: '100-10-1001',
        Description: 'Debit Entry',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 1000,
        DrBase: 1000,
        CrAmount: 0,
        CrBase: 0,
        IsOverWrite: false,
        DimList: { Dim: [] },
      },
      {
        index: 1,
        JvdSeq: 2,
        JvhSeq: 1,
        DeptCode: 'HQ',
        AccCode: '200-10-1001',
        Description: 'Credit Entry',
        CurCode: 'THB',
        CurRate: 1,
        DrAmount: 0,
        DrBase: 0,
        CrAmount: 1000,
        CrBase: 1000,
        IsOverWrite: false,
        DimList: { Dim: [] },
      },
    ],
    DimHList: { Dim: [] },
    UserModified: 'testuser',
    DateModified: '2024-01-15T10:30:00',
  };

  const mockJvList: PagingResult<JournalVoucher> = {
    Data: [mockJvDetail],
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

  describe('useJvList', () => {
    it('should fetch journal voucher list successfully', async () => {
      vi.mocked(generalLedgerService.getJvSearchList).mockResolvedValueOnce(mockJvList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        Status: 'All' as const,
      };

      const { result } = renderHook(() => useJvList(filterParams), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for success
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockJvList);
      expect(generalLedgerService.getJvSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle error when fetching list fails', async () => {
      const error = new Error('Network error');
      vi.mocked(generalLedgerService.getJvSearchList).mockRejectedValueOnce(error);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result } = renderHook(() => useJvList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should use placeholder data while loading new data', async () => {
      vi.mocked(generalLedgerService.getJvSearchList).mockResolvedValueOnce(mockJvList);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result, rerender } = renderHook(
        (props) => useJvList({ ...props, Page: props.Page }),
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
      expect(result.current.data).toEqual(mockJvList);
    });
  });

  describe('useJvDetail', () => {
    it('should fetch journal voucher detail successfully', async () => {
      vi.mocked(generalLedgerService.getJvDetail).mockResolvedValueOnce(mockJvDetail);

      const { result } = renderHook(() => useJvDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockJvDetail);
      expect(generalLedgerService.getJvDetail).toHaveBeenCalledWith(1);
    });

    it('should not fetch when JvhSeq is 0', () => {
      const { result } = renderHook(() => useJvDetail(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when JvhSeq is negative', () => {
      const { result } = renderHook(() => useJvDetail(-1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should handle error when fetching detail fails', async () => {
      const error = new Error('Not found');
      vi.mocked(generalLedgerService.getJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useJvDetail(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Not found');
    });

    it('should add index to detail items', async () => {
      // The service adds index to each detail item
      const mockDetailResponse = {
        ...mockJvDetail,
        Detail: mockJvDetail.Detail?.map((item, idx) => ({ ...item, index: idx })),
      };
      vi.mocked(generalLedgerService.getJvDetail).mockResolvedValueOnce(mockDetailResponse);

      const { result } = renderHook(() => useJvDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.Detail?.[0].index).toBe(0);
      expect(result.current.data?.Detail?.[1].index).toBe(1);
    });
  });

  describe('useCreateJv', () => {
    it('should create journal voucher successfully', async () => {
      const newJv = {
        JvhDate: '2024-01-16',
        Prefix: 'JV',
        JvhNo: 'JV-2024-0002',
        JvhSource: 'Manual',
        Status: 'Draft' as const,
        Description: 'New Journal Voucher',
        Detail: [],
        DimHList: { Dim: [] },
        UserModified: 'testuser',
      };

      const createdJv = { ...newJv, JvhSeq: 2 };
      vi.mocked(generalLedgerService.createJvDetail).mockResolvedValueOnce(createdJv);

      const { result } = renderHook(() => useCreateJv(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newJv);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdJv);
      expect(generalLedgerService.createJvDetail).toHaveBeenCalledTimes(1);
    });

    it('should handle creation error', async () => {
      const error = new Error('Validation failed');
      vi.mocked(generalLedgerService.createJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateJv(), {
        wrapper: createWrapper(),
      });

      const newJv = {
        JvhDate: '2024-01-16',
        Prefix: 'JV',
        JvhNo: 'JV-2024-0002',
        JvhSource: 'Manual',
        Status: 'Draft' as const,
        Description: 'New Journal Voucher',
        Detail: [],
        DimHList: { Dim: [] },
        UserModified: 'testuser',
      };

      result.current.mutate(newJv);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Validation failed');
    });
  });

  describe('useUpdateJv', () => {
    it('should update journal voucher successfully', async () => {
      const updatedJv = {
        ...mockJvDetail,
        Description: 'Updated Description',
      };

      vi.mocked(generalLedgerService.updateJvDetail).mockResolvedValueOnce(updatedJv);

      const { result } = renderHook(() => useUpdateJv(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updatedJv);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedJv);
      expect(generalLedgerService.updateJvDetail).toHaveBeenCalledTimes(1);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      vi.mocked(generalLedgerService.updateJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateJv(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockJvDetail);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Update failed');
    });
  });

  describe('useDeleteJv', () => {
    it('should delete journal voucher successfully', async () => {
      vi.mocked(generalLedgerService.delJvDetail).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteJv(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        JvhSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(generalLedgerService.delJvDetail).toHaveBeenCalledWith(
        1,
        'testuser',
        'Void reason'
      );
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot delete posted voucher');
      vi.mocked(generalLedgerService.delJvDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteJv(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        JvhSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot delete posted voucher');
    });
  });
});
