import { describe, it, expect, beforeEach } from 'vitest';
import {
  setCurrentUser,
  getCurrentUser,
  hasPermission,
  can,
  canView,
  canCreate,
  canEdit,
  canDelete,
  isAuthenticated,
  isAdmin,
  getUserDisplayName,
  getUserLanguage,
  clearUser,
  getUserPermissions,
  hasAnyPermission,
  hasAllPermissions,
  type PermissionModule,
  type PermissionAction,
} from '@/utils/permissions';
import type { User } from '@/types/models';

describe('permissions utilities', () => {
  const mockUser: User = {
    UserId: 1,
    UserName: 'testuser',
    FullName: 'Test User',
    Email: 'test@example.com',
    IsActive: true,
    Permissions: [
      'gl.view',
      'gl.journalVoucher.create',
      'gl.journalVoucher.edit',
      'ap.*',
      'ar.invoice.view',
      'ar.receipt.view',
      'admin',
    ],
    DefaultLanguage: 'th-TH',
  };

  const mockUserNoPermissions: User = {
    UserId: 2,
    UserName: 'noperm',
    FullName: 'No Permission User',
    Email: 'noperm@example.com',
    IsActive: true,
    Permissions: [],
    DefaultLanguage: 'en-US',
  };

  const mockInactiveUser: User = {
    UserId: 3,
    UserName: 'inactive',
    FullName: 'Inactive User',
    Email: 'inactive@example.com',
    IsActive: false,
    Permissions: ['gl.view'],
    DefaultLanguage: 'en-US',
  };

  beforeEach(() => {
    clearUser();
  });

  describe('setCurrentUser', () => {
    it('should set current user and cache permissions', () => {
      setCurrentUser(mockUser);
      expect(getCurrentUser()).toEqual(mockUser);
    });

    it('should handle null user', () => {
      setCurrentUser(mockUser);
      setCurrentUser(null);
      expect(getCurrentUser()).toBeNull();
    });

    it('should clear previous permissions when setting new user', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('gl.view')).toBe(true);
      
      setCurrentUser(mockUserNoPermissions);
      expect(hasPermission('gl.view')).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is set', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('should return current user when set', () => {
      setCurrentUser(mockUser);
      expect(getCurrentUser()?.UserName).toBe('testuser');
      expect(getCurrentUser()?.FullName).toBe('Test User');
    });
  });

  describe('hasPermission', () => {
    it('should return false when no user is set', () => {
      expect(hasPermission('gl.view')).toBe(false);
    });

    it('should check exact permission match', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('gl.view')).toBe(true);
      expect(hasPermission('gl.journalVoucher.create')).toBe(true);
    });

    it('should be case insensitive', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('GL.VIEW')).toBe(true);
      expect(hasPermission('Gl.JournalVoucher.Create')).toBe(true);
    });

    it('should support wildcard module permissions (ap.*)', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('ap.view')).toBe(true);
      expect(hasPermission('ap.invoice.view')).toBe(true);
      expect(hasPermission('ap.invoice.create')).toBe(true);
      expect(hasPermission('ap.payment.delete')).toBe(true);
    });

    it('should return false for non-matching permission (non-admin user)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(hasPermission('gl.view')).toBe(false);
      expect(hasPermission('unknown.permission')).toBe(false);
    });

    it('should grant all permissions to admin', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('anything.anywhere')).toBe(true);
      expect(hasPermission('random.permission.here')).toBe(true);
    });

    it('should support global wildcard (*)', () => {
      const wildcardUser: User = {
        ...mockUser,
        Permissions: ['*'],
      };
      setCurrentUser(wildcardUser);
      expect(hasPermission('anything')).toBe(true);
    });
  });

  describe('can', () => {
    it('should check module and action permission', () => {
      setCurrentUser(mockUser);
      expect(can('gl', 'view')).toBe(true);
      expect(can('gl.journalVoucher', 'create')).toBe(true);
      expect(can('gl.journalVoucher', 'edit')).toBe(true);
    });

    it('should return false for unauthorized action (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(can('gl.journalVoucher', 'delete')).toBe(false);
      expect(can('ar', 'create')).toBe(false);
    });

    it('should handle all permission actions', () => {
      setCurrentUser(mockUser);
      const actions: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'void', 'approve', 'export', 'print'];
      
      // Admin should have all actions
      actions.forEach(action => {
        expect(can('admin', action)).toBe(true);
      });
    });
  });

  describe('canView', () => {
    it('should check view permission', () => {
      setCurrentUser(mockUser);
      expect(canView('gl')).toBe(true);
      expect(canView('ar.invoice')).toBe(true);
    });

    it('should return false without view permission (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(canView('asset')).toBe(false);
    });
  });

  describe('canCreate', () => {
    it('should check create permission', () => {
      setCurrentUser(mockUser);
      expect(canCreate('gl.journalVoucher')).toBe(true);
    });

    it('should return false without create permission (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(canCreate('gl')).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should check edit permission', () => {
      setCurrentUser(mockUser);
      expect(canEdit('gl.journalVoucher')).toBe(true);
    });

    it('should return false without edit permission (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(canEdit('gl.journalVoucher')).toBe(false);
      expect(canEdit('gl')).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should check delete permission', () => {
      setCurrentUser(mockUser);
      // User has ap.* which includes delete
      expect(canDelete('ap.invoice')).toBe(true);
    });

    it('should return false without delete permission (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(canDelete('gl')).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is set', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true for active user', () => {
      setCurrentUser(mockUser);
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false for inactive user', () => {
      setCurrentUser(mockInactiveUser);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return false when no user is set', () => {
      expect(isAdmin()).toBe(false);
    });

    it('should return true for admin user', () => {
      setCurrentUser(mockUser);
      expect(isAdmin()).toBe(true);
    });

    it('should return false for non-admin user', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(isAdmin()).toBe(false);
    });
  });

  describe('getUserDisplayName', () => {
    it('should return empty string when no user is set', () => {
      expect(getUserDisplayName()).toBe('');
    });

    it('should return FullName when available', () => {
      setCurrentUser(mockUser);
      expect(getUserDisplayName()).toBe('Test User');
    });

    it('should return UserName when FullName is empty', () => {
      const userWithoutFullName: User = {
        ...mockUser,
        FullName: '',
      };
      setCurrentUser(userWithoutFullName);
      expect(getUserDisplayName()).toBe('testuser');
    });
  });

  describe('getUserLanguage', () => {
    it('should return default language when no user is set', () => {
      expect(getUserLanguage()).toBe('en-US');
    });

    it('should return user language preference', () => {
      setCurrentUser(mockUser);
      expect(getUserLanguage()).toBe('th-TH');
    });

    it('should return default when user has no language set', () => {
      const userWithoutLang: User = {
        ...mockUser,
        DefaultLanguage: undefined as unknown as 'en-US',
      };
      setCurrentUser(userWithoutLang);
      expect(getUserLanguage()).toBe('en-US');
    });
  });

  describe('clearUser', () => {
    it('should clear current user', () => {
      setCurrentUser(mockUser);
      expect(getCurrentUser()).not.toBeNull();
      
      clearUser();
      expect(getCurrentUser()).toBeNull();
    });

    it('should clear permissions cache', () => {
      setCurrentUser(mockUser);
      expect(hasPermission('gl.view')).toBe(true);
      
      clearUser();
      expect(hasPermission('gl.view')).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('should return empty array when no user is set', () => {
      expect(getUserPermissions()).toEqual([]);
    });

    it('should return user permissions', () => {
      setCurrentUser(mockUser);
      expect(getUserPermissions()).toEqual(mockUser.Permissions);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return false when no user is set', () => {
      expect(hasAnyPermission(['gl.view', 'ap.view'])).toBe(false);
    });

    it('should return true if user has any of the permissions', () => {
      setCurrentUser(mockUser);
      expect(hasAnyPermission(['gl.view', 'nonexistent'])).toBe(true);
      expect(hasAnyPermission(['nonexistent', 'gl.view'])).toBe(true);
    });

    it('should return false if user has none of the permissions (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(hasAnyPermission(['nonexistent1', 'nonexistent2'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return false when no user is set', () => {
      expect(hasAllPermissions(['gl.view', 'ap.view'])).toBe(false);
    });

    it('should return true if user has all permissions', () => {
      setCurrentUser(mockUser);
      expect(hasAllPermissions(['gl.view', 'gl.journalVoucher.create'])).toBe(true);
    });

    it('should return false if user is missing any permission (non-admin)', () => {
      setCurrentUser(mockUserNoPermissions);
      expect(hasAllPermissions(['gl.view', 'nonexistent'])).toBe(false);
    });

    it('should work with admin wildcard', () => {
      setCurrentUser(mockUser);
      expect(hasAllPermissions(['anything.here', 'another.permission'])).toBe(true);
    });
  });
});
