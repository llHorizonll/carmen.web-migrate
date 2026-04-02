/**
 * Carmen User Service
 * User management via Carmen API
 */

import { carmenAxios } from './carmenAuth';
import type { PagingResult, UriQueryString } from '../types/api';

// ============================================================================
// Carmen User APIs
// ============================================================================

export interface CarmenUserResponse {
  UserId: number;
  UserName: string;
  Email: string;
  FullName?: string;
  IsActive: boolean;
  Permissions?: string[];
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface CarmenUserListParams extends UriQueryString {
  Search?: string;
  IsActive?: boolean;
}

/**
 * Get list of users from Carmen API
 * GET /api/User
 */
export async function getCarmenUserList(
  params?: CarmenUserListParams
): Promise<PagingResult<CarmenUserResponse>> {
  const { data } = await carmenAxios.get('/api/User', { params });
  return data;
}

/**
 * Get user detail from Carmen API
 * GET /api/User/{id}
 */
export async function getCarmenUserDetail(id: number): Promise<CarmenUserResponse> {
  const { data } = await carmenAxios.get(`/api/User/${id}`);
  return data;
}

/**
 * Get current user info from Carmen API
 * GET /api/User/Me
 */
export async function getCarmenCurrentUser(): Promise<CarmenUserResponse> {
  const { data } = await carmenAxios.get('/api/User/Me');
  return data;
}

/**
 * Create new user in Carmen API
 * POST /api/User
 */
export async function createCarmenUser(
  userData: Omit<CarmenUserResponse, 'UserId'>
): Promise<CarmenUserResponse> {
  const { data } = await carmenAxios.post('/api/User', userData);
  return data;
}

/**
 * Update user in Carmen API
 * PUT /api/User/{id}
 */
export async function updateCarmenUser(
  id: number,
  userData: Partial<CarmenUserResponse>
): Promise<CarmenUserResponse> {
  const { data } = await carmenAxios.put(`/api/User/${id}`, userData);
  return data;
}

/**
 * Delete user from Carmen API
 * DELETE /api/User/{id}
 */
export async function deleteCarmenUser(id: number): Promise<void> {
  await carmenAxios.delete(`/api/User/${id}`);
}

/**
 * Change user password
 * POST /api/User/ChangePassword
 */
export interface ChangePasswordRequest {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

export async function changeCarmenPassword(
  passwordData: ChangePasswordRequest
): Promise<void> {
  await carmenAxios.post('/api/User/ChangePassword', passwordData);
}
