/**
 * Permissions Utilities
 * Handle user permissions and access control
 */

import type { User } from '../types/models';

// Permission types
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'void' | 'approve' | 'export' | 'print';

export type PermissionModule = 
  | 'gl' 
  | 'gl.journalVoucher' 
  | 'gl.allocationVoucher' 
  | 'gl.standardVoucher'
  | 'ap' 
  | 'ap.vendor' 
  | 'ap.invoice' 
  | 'ap.payment'
  | 'ar' 
  | 'ar.profile' 
  | 'ar.invoice' 
  | 'ar.receipt'
  | 'asset' 
  | 'asset.register'
  | 'report'
  | 'admin';

// Permission cache
let currentUser: User | null = null;
let permissionCache: Set<string> = new Set();

/**
 * Set current user and cache permissions
 */
export function setCurrentUser(user: User | null): void {
  currentUser = user;
  permissionCache.clear();
  
  if (user?.Permissions) {
    user.Permissions.forEach(perm => permissionCache.add(perm.toLowerCase()));
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return currentUser;
}

/**
 * Check if user has specific permission
 * Supports wildcard patterns like 'gl.*' or 'gl.journalVoucher.*'
 */
export function hasPermission(permission: string): boolean {
  if (!currentUser) return false;
  
  // Admin has all permissions
  if (permissionCache.has('admin') || permissionCache.has('*')) {
    return true;
  }
  
  const normalizedPerm = permission.toLowerCase();
  
  // Direct permission check
  if (permissionCache.has(normalizedPerm)) {
    return true;
  }
  
  // Wildcard module check (e.g., 'gl.journalVoucher.view' matches 'gl.*')
  const parts = normalizedPerm.split('.');
  for (let i = parts.length - 1; i > 0; i--) {
    const wildcardPerm = [...parts.slice(0, i), '*'].join('.');
    if (permissionCache.has(wildcardPerm)) {
      return true;
    }
  }
  
  // Global wildcard check
  if (permissionCache.has(`${parts[0]}.*`)) {
    return true;
  }
  
  return false;
}

/**
 * Check if user can perform action on module
 */
export function can(module: PermissionModule, action: PermissionAction): boolean {
  return hasPermission(`${module}.${action}`);
}

/**
 * Check if user can view specific module
 */
export function canView(module: PermissionModule): boolean {
  return can(module, 'view');
}

/**
 * Check if user can create in specific module
 */
export function canCreate(module: PermissionModule): boolean {
  return can(module, 'create');
}

/**
 * Check if user can edit in specific module
 */
export function canEdit(module: PermissionModule): boolean {
  return can(module, 'edit');
}

/**
 * Check if user can delete in specific module
 */
export function canDelete(module: PermissionModule): boolean {
  return can(module, 'delete');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return currentUser !== null && currentUser.IsActive;
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  return hasPermission('admin');
}

/**
 * Get user's display name
 */
export function getUserDisplayName(): string {
  if (!currentUser) return '';
  return currentUser.FullName || currentUser.UserName;
}

/**
 * Get user's default language
 */
export function getUserLanguage(): string {
  if (!currentUser) return 'en-US';
  return currentUser.DefaultLanguage || 'en-US';
}

/**
 * Clear user session
 */
export function clearUser(): void {
  currentUser = null;
  permissionCache.clear();
}

/**
 * Get all user permissions
 */
export function getUserPermissions(): string[] {
  return currentUser?.Permissions || [];
}

/**
 * Check if user has any of the given permissions
 */
export function hasAnyPermission(permissions: string[]): boolean {
  return permissions.some(perm => hasPermission(perm));
}

/**
 * Check if user has all of the given permissions
 */
export function hasAllPermissions(permissions: string[]): boolean {
  return permissions.every(perm => hasPermission(perm));
}
