/**
 * User & Authentication Services
 * Based on original src/services/user.js
 * Preserves exact API behavior, adds TypeScript types
 */

import axiosAuth from '../utils/request';
import type { User } from '../types/models';
import type {
  LoginRequest,
  LoginResponse,
  UriQueryString,
  PagingResult,
} from '../types/api';

// ============================================================================
// Authentication APIs
// ============================================================================

export async function login(param: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosAuth.post('/api/auth/login', param);
  return data;
}

export async function logout(): Promise<void> {
  const { data } = await axiosAuth.post('/api/auth/logout');
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await axiosAuth.get('/api/auth/currentUser');
  return data;
}

export interface ChangePasswordRequest {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

export async function changePassword(
  param: ChangePasswordRequest
): Promise<void> {
  const { data } = await axiosAuth.post('/api/auth/changePassword', param);
  return data;
}

// ============================================================================
// User Management APIs
// ============================================================================

export async function getUserList(
  params: UriQueryString
): Promise<PagingResult<User>> {
  const { data } = await axiosAuth.post('/api/user/search', params);
  return data;
}

export async function getUserDetail(UserId: number): Promise<User> {
  const { data } = await axiosAuth.get(`/api/user/${UserId}`);
  return data;
}

export async function createUser(
  param: Omit<User, 'UserId'>
): Promise<User> {
  const { data } = await axiosAuth.post('/api/user', param);
  return data;
}

export async function updateUser(param: User): Promise<User> {
  const { data } = await axiosAuth.put(`/api/user/${param.UserId}`, param);
  return data;
}

export async function deleteUser(
  UserId: number,
  username: string
): Promise<void> {
  const { data } = await axiosAuth.delete(
    `/api/user/${UserId}?user=${username}`
  );
  return data;
}
