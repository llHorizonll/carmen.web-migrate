/**
 * Carmen Generic API Service
 * Generic CRUD operations for Carmen API endpoints
 */

import { carmenAxios } from './carmenAuth';
import type { PagingResult, UriQueryString } from '../types/api';

// ============================================================================
// Generic CRUD Factory
// ============================================================================

export interface CarmenApiOptions {
  baseEndpoint: string;
  idField?: string;
}

export interface CarmenSearchParams extends UriQueryString {
  [key: string]: unknown;
}

/**
 * Create a generic CRUD service for a Carmen API endpoint
 */
export function createCarmenService<T>(
  options: CarmenApiOptions
) {
  const { baseEndpoint, idField = 'Id' } = options;

  return {
    /**
     * Search/List items
     * POST /api/{endpoint}/search
     */
    async search(params?: CarmenSearchParams): Promise<PagingResult<T>> {
      const { data } = await carmenAxios.post(`${baseEndpoint}/search`, params);
      return data;
    },

    /**
     * Get all items
     * GET /api/{endpoint}
     */
    async getAll(): Promise<T[]> {
      const { data } = await carmenAxios.get(baseEndpoint);
      return data;
    },

    /**
     * Get item by ID
     * GET /api/{endpoint}/{id}
     */
    async getById(id: number | string): Promise<T> {
      const { data } = await carmenAxios.get(`${baseEndpoint}/${id}`);
      return data;
    },

    /**
     * Create new item
     * POST /api/{endpoint}
     */
    async create(item: Omit<T, typeof idField>): Promise<T> {
      const { data } = await carmenAxios.post(baseEndpoint, item);
      return data;
    },

    /**
     * Update item
     * PUT /api/{endpoint}/{id}
     */
    async update(id: number | string, item: Partial<T>): Promise<T> {
      const { data } = await carmenAxios.put(`${baseEndpoint}/${id}`, item);
      return data;
    },

    /**
     * Delete item
     * DELETE /api/{endpoint}/{id}
     */
    async delete(id: number | string): Promise<void> {
      await carmenAxios.delete(`${baseEndpoint}/${id}`);
    },

    /**
     * Custom post request
     */
    async post<R = unknown>(
      path: string,
      payload?: unknown
    ): Promise<R> {
      const { data } = await carmenAxios.post(`${baseEndpoint}${path}`, payload);
      return data;
    },

    /**
     * Custom get request
     */
    async get<R = unknown>(
      path: string,
      params?: Record<string, unknown>
    ): Promise<R> {
      const { data } = await carmenAxios.get(`${baseEndpoint}${path}`, { params });
      return data;
    },
  };
}

// ============================================================================
// Pre-configured Services for Common Endpoints
// ============================================================================

/**
 * Company/Organization Service
 */
export interface CarmenCompany {
  CompanyId: number;
  CompanyCode: string;
  CompanyName: string;
  Address?: string;
  Phone?: string;
  Email?: string;
  TaxId?: string;
  CurCode: string;
  IsActive: boolean;
}

export const carmenCompanyService = createCarmenService<CarmenCompany>({
  baseEndpoint: '/api/Company',
  idField: 'CompanyId',
});

/**
 * Department Service
 */
export interface CarmenDepartment {
  DeptId: number;
  DeptCode: string;
  DeptName: string;
  ParentId?: number;
  IsActive: boolean;
}

export const carmenDepartmentService = createCarmenService<CarmenDepartment>({
  baseEndpoint: '/api/Department',
  idField: 'DeptId',
});

/**
 * Chart of Accounts Service
 */
export interface CarmenAccount {
  AccId: number;
  AccCode: string;
  AccName: string;
  AccType: string;
  ParentId?: number;
  IsActive: boolean;
  IsPostable: boolean;
}

export const carmenAccountService = createCarmenService<CarmenAccount>({
  baseEndpoint: '/api/Account',
  idField: 'AccId',
});

/**
 * Currency Service
 */
export interface CarmenCurrency {
  CurId: number;
  CurCode: string;
  CurName: string;
  ExchangeRate: number;
  IsActive: boolean;
}

export const carmenCurrencyService = createCarmenService<CarmenCurrency>({
  baseEndpoint: '/api/Currency',
  idField: 'CurId',
});
