import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useApInvoiceList,
  useApInvoiceDetail,
  useCreateApInvoice,
  useUpdateApInvoice,
  useDeleteApInvoice,
  usePostApInvoice,
} from '@/hooks/useApInvoice';
import * as accountPayableService from '@/services/accountPayable';
import type { ApInvoice, PagingResult } from '@/types';

// Mock the services
vi.mock('@/services/accountPayable', () => ({
  getApInvoiceSearchList: vi.fn(),
  getApInvoiceDetail: vi.fn(),
  createApInvoice: vi.fn(),
  updateApInvoice: vi.fn(),
  deleteApInvoice: vi.fn(),
  postApInvoice: vi.fn(),
}));

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}));

describe('AP Invoice Integration Tests', () => {
  let queryClient: QueryClient;

  const mockApInvoiceDetail: ApInvoice = {
    ApInvhSeq: 1,
    InvNo: 'INV-2024-0001',
    InvDate: '2024-01-15',
    VendorId: 1,
    VendorCode: 'VEN001',
    VendorName: 'Test Vendor Co., Ltd.',
    Description: 'Office Supplies',
    CurCode: 'THB',
    CurRate: 1,
    InvAmount: 10700,
    InvAmountBase: 10700,
    VatAmount: 700,
    WhtAmount: 0,
    NetAmount: 10700,
    Status: 'Normal',
    Detail: [
      {
        index: 0,
        ApInvdSeq: 1,
        ApInvhSeq: 1,
        DeptCode: 'HQ',
        AccCode: '500-10-1001',
        Description: 'Stationery',
        Amount: 10000,
        AmountBase: 10000,
        VatCode: 'VAT7',
        VatAmount: 700,
        WhtCode: '',
        WhtAmount: 0,
        NetAmount: 10700,
      },
    ],
    UserModified: 'testuser',
  };

  const mockApInvoiceList: PagingResult<ApInvoice> = {
    Data: [mockApInvoiceDetail],
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

  describe('useApInvoiceList', () => {
    it('should fetch AP invoice list successfully', async () => {
      vi.mocked(accountPayableService.getApInvoiceSearchList).mockResolvedValueOnce(mockApInvoiceList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        VendorId: 1,
        Status: 'All' as const,
      };

      const { result } = renderHook(() => useApInvoiceList(filterParams), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockApInvoiceList);
      expect(accountPayableService.getApInvoiceSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle filter by invoice number', async () => {
      vi.mocked(accountPayableService.getApInvoiceSearchList).mockResolvedValueOnce(mockApInvoiceList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        InvNo: 'INV-2024-0001',
      };

      const { result } = renderHook(() => useApInvoiceList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountPayableService.getApInvoiceSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle date range filter', async () => {
      vi.mocked(accountPayableService.getApInvoiceSearchList).mockResolvedValueOnce(mockApInvoiceList);

      const filterParams = {
        Limit: 10,
        Page: 1,
        FromDate: '2024-01-01',
        ToDate: '2024-01-31',
      };

      const { result } = renderHook(() => useApInvoiceList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountPayableService.getApInvoiceSearchList).toHaveBeenCalledWith(filterParams);
    });

    it('should handle error when fetching list fails', async () => {
      const error = new Error('Network error');
      vi.mocked(accountPayableService.getApInvoiceSearchList).mockRejectedValueOnce(error);

      const filterParams = {
        Limit: 10,
        Page: 1,
      };

      const { result } = renderHook(() => useApInvoiceList(filterParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe('useApInvoiceDetail', () => {
    it('should fetch AP invoice detail successfully', async () => {
      vi.mocked(accountPayableService.getApInvoiceDetail).mockResolvedValueOnce(mockApInvoiceDetail);

      const { result } = renderHook(() => useApInvoiceDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockApInvoiceDetail);
      expect(accountPayableService.getApInvoiceDetail).toHaveBeenCalledWith(1);
    });

    it('should not fetch when ApInvhSeq is 0', () => {
      const { result } = renderHook(() => useApInvoiceDetail(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should handle error when fetching detail fails', async () => {
      const error = new Error('Invoice not found');
      vi.mocked(accountPayableService.getApInvoiceDetail).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useApInvoiceDetail(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Invoice not found');
    });

    it('should contain correct vendor information', async () => {
      vi.mocked(accountPayableService.getApInvoiceDetail).mockResolvedValueOnce(mockApInvoiceDetail);

      const { result } = renderHook(() => useApInvoiceDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.VendorCode).toBe('VEN001');
      expect(result.current.data?.VendorName).toBe('Test Vendor Co., Ltd.');
    });

    it('should calculate amounts correctly', async () => {
      vi.mocked(accountPayableService.getApInvoiceDetail).mockResolvedValueOnce(mockApInvoiceDetail);

      const { result } = renderHook(() => useApInvoiceDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.InvAmount).toBe(10700);
      expect(result.current.data?.VatAmount).toBe(700);
      expect(result.current.data?.NetAmount).toBe(10700);
    });
  });

  describe('useCreateApInvoice', () => {
    it('should create AP invoice successfully', async () => {
      const newInvoice = {
        InvNo: 'INV-2024-0002',
        InvDate: '2024-01-16',
        VendorId: 1,
        VendorCode: 'VEN001',
        VendorName: 'Test Vendor Co., Ltd.',
        Description: 'New Invoice',
        CurCode: 'THB',
        CurRate: 1,
        InvAmount: 5000,
        InvAmountBase: 5000,
        VatAmount: 350,
        WhtAmount: 0,
        NetAmount: 5350,
        Status: 'Draft' as const,
        Detail: [],
        UserModified: 'testuser',
      };

      const createdInvoice = { ...newInvoice, ApInvhSeq: 2 };
      vi.mocked(accountPayableService.createApInvoice).mockResolvedValueOnce(createdInvoice);

      const { result } = renderHook(() => useCreateApInvoice(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(newInvoice);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(createdInvoice);
      expect(accountPayableService.createApInvoice).toHaveBeenCalledTimes(1);
    });

    it('should handle creation error', async () => {
      const error = new Error('Validation failed');
      vi.mocked(accountPayableService.createApInvoice).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateApInvoice(), {
        wrapper: createWrapper(),
      });

      const newInvoice = {
        InvNo: 'INV-2024-0002',
        InvDate: '2024-01-16',
        VendorId: 1,
        VendorCode: 'VEN001',
        VendorName: 'Test Vendor Co., Ltd.',
        Description: 'New Invoice',
        CurCode: 'THB',
        CurRate: 1,
        InvAmount: 5000,
        InvAmountBase: 5000,
        VatAmount: 350,
        WhtAmount: 0,
        NetAmount: 5350,
        Status: 'Draft' as const,
        Detail: [],
        UserModified: 'testuser',
      };

      result.current.mutate(newInvoice);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Validation failed');
    });
  });

  describe('useUpdateApInvoice', () => {
    it('should update AP invoice successfully', async () => {
      const updatedInvoice = {
        ...mockApInvoiceDetail,
        Description: 'Updated Description',
        InvAmount: 15000,
      };

      vi.mocked(accountPayableService.updateApInvoice).mockResolvedValueOnce(updatedInvoice);

      const { result } = renderHook(() => useUpdateApInvoice(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(updatedInvoice);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedInvoice);
      expect(accountPayableService.updateApInvoice).toHaveBeenCalledTimes(1);
    });
  });

  describe('useDeleteApInvoice', () => {
    it('should delete AP invoice successfully', async () => {
      vi.mocked(accountPayableService.deleteApInvoice).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteApInvoice(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        ApInvhSeq: 1,
        username: 'testuser',
        remark: 'Void reason',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(accountPayableService.deleteApInvoice).toHaveBeenCalledWith(
        1,
        'testuser',
        'Void reason'
      );
    });
  });

  describe('usePostApInvoice', () => {
    it('should post AP invoice successfully', async () => {
      const postedInvoice = {
        ...mockApInvoiceDetail,
        Status: 'Normal' as const,
      };

      vi.mocked(accountPayableService.postApInvoice).mockResolvedValueOnce(postedInvoice);

      const { result } = renderHook(() => usePostApInvoice(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(postedInvoice);
      expect(accountPayableService.postApInvoice).toHaveBeenCalledTimes(1);
    });

    it('should handle post error', async () => {
      const error = new Error('Cannot post draft invoice');
      vi.mocked(accountPayableService.postApInvoice).mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePostApInvoice(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Cannot post draft invoice');
    });
  });
});
