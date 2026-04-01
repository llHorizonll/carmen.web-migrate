import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useArReceiptList,
  useArReceiptDetail,
  useCreateArReceipt,
  useUpdateArReceipt,
  useDeleteArReceipt,
  usePostArReceipt,
} from '@/hooks/useArReceipt';
import * as accountReceivableService from '@/services/accountReceivable';
import type { ArReceipt, PagingResult } from '@/types';

// Mock the services
vi.mock('@/services/accountReceivable', () => ({
  getArReceiptSearchList: vi.fn(),
  getArReceiptDetail: vi.fn(),
  createArReceipt: vi.fn(),
  updateArReceipt: vi.fn(),
  deleteArReceipt: vi.fn(),
  postArReceipt: vi.fn(),
}));

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

describe('AR Receipt Integration Tests', () => {
  let queryClient: QueryClient;

  const mockArReceiptDetail: ArReceipt = {
    ArRcptSeq: 1,
    RcptNo: 'RCP-2024-0001',
    RcptDate: '2024-01-15',
    ProfileId: 1,
    ProfileCode: 'CUST001',
    ProfileName: 'Test Customer Co., Ltd.',
    Description: 'Payment for Invoice INV-001',
    CurCode: 'THB',
    CurRate: 1,
    RcptAmount: 10000,
    RcptAmountBase: 10000,
    BankCode: 'SCB',
    ChqNo: '123456',
    ChqDate: '2024-01-15',
    Status: 'Normal',
    Detail: [
      {
        index: 0,
        ArRcptdSeq: 1,
        ArRcptSeq: 1,
        ArInvhSeq: 1,
        InvNo: 'INV-2024-0001',
        InvAmount: 10000,
        InvBalance: 0,
        RcptAmount: 10000,
      },
    ],
    UserModified: 'testuser',
  };

  const mockArReceiptList: PagingResult<ArReceipt> = {
    Data: [mockArReceiptDetail],
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

  describe('useArReceiptList', () => {
    it('should fetch AR receipt list successfully', async () => {
      vi.mocked(accountReceivableService.getArReceiptSearchList).mockResolvedValueOnce(mockArReceiptList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        ProfileId: 1,
        Status: 'All' as const,
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockArReceiptList);
      expect(accountReceivableService.getArReceiptSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle filter by receipt number', async () => {
      vi.mocked(accountReceivableService.getArReceiptSearchList).mockResolvedValueOnce(mockArReceiptList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        RcptNo: 'RCP-2024-0001',
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountReceivableService.getArReceiptSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle filter by profile', async () => {
      vi.mocked(accountReceivableService.getArReceiptSearchList).mockResolvedValueOnce(mockArReceiptList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        ProfileId: 1,
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountReceivableService.getArReceiptSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle date range filter', async () => {
      vi.mocked(accountReceivableService.getArReceiptSearchList).mockResolvedValueOnce(mockArReceiptList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        FromDate: '2024-01-01',
        ToDate: '2024-01-31',
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountReceivableService.getArReceiptSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle error when fetching list fails', async () => {
      const error = new Error('Network error');
      vi.mocked(accountReceivableService.getArReceiptSearchList).mockRejectedValueOnce(error);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should support pagination', async () => {
      const paginatedResult: PagingResult<ArReceipt> = {
        Data: [],
        Total: 100,
        Page: 2,
        PageSize: 10,
        TotalPages: 10,
      };

      vi.mocked(accountReceivableService.getArReceiptSearchList).mockResolvedValueOnce(paginatedResult);

      const filterParams = {
        Limit: 10,
        Page: 2,
      };

      const { result } = renderHook(() => useArReceiptList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.Page).toBe(2);
      expect(result.current.data?.TotalPages).toBe(10);
    });
  });

  describe('useArReceiptDetail', () => {
    it('should fetch AR receipt detail successfully', async () => {
      vi.mocked(accountReceivableService.getArReceiptDetail).mockResolvedValueOnce(mockArReceiptDetail);

      const { result } = renderHook(() => useArReceiptDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockArReceiptDetail);
      expect(accountReceivableService.getArReceiptDetail).toHaveBeenCalledWith(1);
    });

    it('should not fetch when ArRcptSeq is 0', () => {
      const { result } = renderHook(() => useArReceiptDetail(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should not fetch when ArRcptSeq is negative', () => {
      const { result } = renderHook(() => useArReceiptDetail(-1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should handle error when fetching detail fails', async () => {
      const error = new Error('Receipt not found');
      vi.mocked(accountReceivableService.getArReceiptDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useArReceiptDetail(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Receipt not found');
    });

    it('should contain correct customer information', async () => {
      vi.mocked(accountReceivableService.getArReceiptDetail).mockResolvedValueOnce(mockArReceiptDetail);

      const { result } = renderHook(() => useArReceiptDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.ProfileCode).toBe('CUST001');
      expect(result.current.data?.ProfileName).toBe('Test Customer Co., Ltd.');
    });

    it('should contain payment details', async () => {
      vi.mocked(accountReceivableService.getArReceiptDetail).mockResolvedValueOnce(mockArReceiptDetail);

      const { result } = renderHook(() => useArReceiptDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.BankCode).toBe('SCB');
      expect(result.current.data?.ChqNo).toBe('123456');
      expect(result.current.data?.RcptAmount).toBe(10000);
    });

    it('should contain allocation details', async () => {
      vi.mocked(accountReceivableService.getArReceiptDetail).mockResolvedValueOnce(mockArReceiptDetail);

      const { result } = renderHook(() => useArReceiptDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.Detail).toHaveLength(1);
      expect(result.current.data?.Detail?.[0].InvNo).toBe('INV-2024-0001');
      expect(result.current.data?.Detail?.[0].RcptAmount).toBe(10000);
    });
  });

  describe('useCreateArReceipt', () => {
    it('should create AR receipt successfully', async () => {
      const newReceipt = {
        RcptNo: 'RCP-2024-0002',
        RcptDate: '2024-01-16',
        ProfileId: 1,
        ProfileCode: 'CUST001',
        ProfileName: 'Test Customer Co., Ltd.',
        Description: 'New Receipt',
        CurCode: 'THB',
        CurRate: 1,
        RcptAmount: 5000,
        RcptAmountBase: 5000,
        BankCode: 'KBANK',
        ChqNo: '654321',
        ChqDate: '2024-01-16',
        Status: 'Draft' as const,
        Detail: [],
        UserModified: 'testuser',
      };

      const createdReceipt = { ...newReceipt, ArRcptSeq: 2 };
      vi.mocked(accountReceivableService.createArReceipt).mockResolvedValueOnce(createdReceipt);

      const { result } = renderHook(() => useCreateArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newReceipt);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdReceipt);
      expect(accountReceivableService.createArReceipt).toHaveBeenCalledTimes(1);
    });

    it('should handle creation error', async () => {
      const error = new Error('Insufficient balance');
      vi.mocked(accountReceivableService.createArReceipt).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateArReceipt(), {
        wrapper: createWrapper(),
      });

      const newReceipt = {
        RcptNo: 'RCP-2024-0002',
        RcptDate: '2024-01-16',
        ProfileId: 1,
        ProfileCode: 'CUST001',
        ProfileName: 'Test Customer Co., Ltd.',
        Description: 'New Receipt',
        CurCode: 'THB',
        CurRate: 1,
        RcptAmount: 5000,
        RcptAmountBase: 5000,
        BankCode: 'KBANK',
        ChqNo: '654321',
        ChqDate: '2024-01-16',
        Status: 'Draft' as const,
        Detail: [],
        UserModified: 'testuser',
      };

      result.current.mutate(newReceipt);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Insufficient balance');
    });
  });

  describe('useUpdateArReceipt', () => {
    it('should update AR receipt successfully', async () => {
      const updatedReceipt = {
        ...mockArReceiptDetail,
        Description: 'Updated Description',
        RcptAmount: 15000,
      };

      vi.mocked(accountReceivableService.updateArReceipt).mockResolvedValueOnce(updatedReceipt);

      const { result } = renderHook(() => useUpdateArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updatedReceipt);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedReceipt);
      expect(accountReceivableService.updateArReceipt).toHaveBeenCalledTimes(1);
    });

    it('should handle update error', async () => {
      const error = new Error('Receipt already posted');
      vi.mocked(accountReceivableService.updateArReceipt).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockArReceiptDetail);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Receipt already posted');
    });
  });

  describe('useDeleteArReceipt', () => {
    it('should delete AR receipt successfully', async () => {
      vi.mocked(accountReceivableService.deleteArReceipt).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        ArRcptSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountReceivableService.deleteArReceipt).toHaveBeenCalledWith(
        1,
        'testuser',
        'Void reason'
      );
    });

    it('should handle delete error', async () => {
      const error = new Error('Cannot void posted receipt');
      vi.mocked(accountReceivableService.deleteArReceipt).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDeleteArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        ArRcptSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot void posted receipt');
    });
  });

  describe('usePostArReceipt', () => {
    it('should post AR receipt successfully', async () => {
      const postedReceipt = {
        ...mockArReceiptDetail,
        Status: 'Normal' as const,
      };

      vi.mocked(accountReceivableService.postArReceipt).mockResolvedValueOnce(postedReceipt);

      const { result } = renderHook(() => usePostArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(postedReceipt);
      expect(accountReceivableService.postArReceipt).toHaveBeenCalledTimes(1);
    });

    it('should handle post error', async () => {
      const error = new Error('Cannot post unallocated receipt');
      vi.mocked(accountReceivableService.postArReceipt).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePostArReceipt(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot post unallocated receipt');
    });
  });
});
