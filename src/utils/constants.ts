/**
 * Permission Constants
 * Based on original src/utils/constants.js
 */

export const permissionName = {
  // System Administration
  'Sys.Administration': 'Sys.Administration',
  'Sys.ProductLicense': 'Sys.ProductLicense',
  'Sys.Company': 'Sys.Company',
  'Sys.Pref': 'Sys.Pref',
  'Sys.Policy': 'Sys.Policy',
  'Sys.User': 'Sys.User',
  'Sys.Permission': 'Sys.Permission',
  'Sys.Currency': 'Sys.Currency',
  'Sys.Interface': 'Sys.Interface',
  'Sys.Dimension': 'Sys.Dimension',
  'Sys.Email': 'Sys.Email',
  'Sys.Workflow': 'Sys.Workflow',
  'Sys.Setting': 'Sys.Setting',

  // GL Module
  'GL.Department': 'GL.Department',
  'GL.Prefix': 'GL.Prefix',
  'GL.Authorize': 'GL.Authorize',
  'GL.Jv': 'GL.Jv',
  'GL.AllocationJv': 'GL.AllocationJv',
  'GL.StdJv': 'GL.StdJv',
  'GL.RecurringStdJv': 'GL.RecurringStdJv',
  'GL.AmortizationStdJv': 'GL.AmortizationStdJv',
  'GL.FinancialReport': 'GL.FinancialReport',
  'GL.ChartOfAccount': 'GL.ChartOfAccount',
  'GL.Period': 'GL.Period',
  'GL.Budget': 'GL.Budget',
  'GL.Report': 'GL.Report',
  'GL.Procedure.ApplyAmortizeVoucher': 'GL.Procedure.ApplyAmortizeVoucher',
  'GL.Procedure.ApplyStandardVoucher': 'GL.Procedure.ApplyStandardVoucher',
  'GL.Post.AP': 'GL.Post.AP',
  'GL.Post.AR': 'GL.Post.AR',
  'GL.Post.Invent': 'GL.Post.Invent',
  'GL.Post.Asset': 'GL.Post.Asset',
  'GL.Post.PMS': 'GL.Post.PMS',
  'GL.Post.POS': 'GL.Post.POS',
  'GL.Post.HRM': 'GL.Post.HRM',
  'GL.Procedure.PeriodEnd': 'GL.Procedure.PeriodEnd',

  // AP Module
  'AP.PaymentType': 'AP.PaymentType',
  'AP.Unit': 'AP.Unit',
  'AP.VendorCate': 'AP.VendorCate',
  'AP.Config.Wht': 'AP.Config.Wht',
  'AP.Config.WhtType': 'AP.Config.WhtType',
  'AP.Authorize': 'AP.Authorize',
  'AP.Vendor': 'AP.Vendor',
  'AP.Invoice': 'AP.Invoice',
  'AP.Payment': 'AP.Payment',
  'AP.Report': 'AP.Report',
  'AP.Post.Receiving': 'AP.Post.Receiving',
  'AP.Procedure.ChequeReconciliation': 'AP.Procedure.ChequeReconciliation',
  'AP.Procedure.VatReconciliation': 'AP.Procedure.VatReconciliation',
  'AP.Procedure.EditVatReconciliation': 'AP.Procedure.EditVatReconciliation',
  'AP.Procedure.WHTReconciliation': 'AP.Procedure.WHTReconciliation',
  'AP.Procedure.PeriodEnd': 'AP.Procedure.PeriodEnd',

  // AR Module
  'AR.Type': 'AR.Type',
  'AR.Title': 'AR.Title',
  'AR.Owner': 'AR.Owner',
  'AR.Project': 'AR.Project',
  'AR.Authorize': 'AR.Authorize',
  'AR.Profile': 'AR.Profile',
  'AR.Folio': 'AR.Folio',
  'AR.Invoice': 'AR.Invoice',
  'AR.Receipt': 'AR.Receipt',
  'AR.Procedure.ApplyContract': 'AR.Procedure.ApplyContract',
  'AR.Post.PMS': 'AR.Post.PMS',
  'AR.Procedure.PeriodEnd': 'AR.Procedure.PeriodEnd',

  // Asset Module
  'Ast.Category': 'Ast.Category',
  'Ast.Department': 'Ast.Department',
  'Ast.Location': 'Ast.Location',
  'Ast.Authorize': 'Ast.Authorize',
  'Ast.Vendor': 'Ast.Vendor',
  'Ast.Register': 'Ast.Register',
  'Ast.Disposal': 'Ast.Disposal',
  'Ast.Impairment': 'Ast.Impairment',
  'Ast.Post.AP': 'Ast.Post.AP',
  'Ast.Procedure.PeriodEnd': 'Ast.Procedure.PeriodEnd',
} as const;

export type Permission = keyof typeof permissionName;

/**
 * Check if user has permission
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: Permission
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('Sys.Administration')) return true;
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('Sys.Administration')) return true;
  return requiredPermissions.some((p) => userPermissions.includes(p));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: Permission[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes('Sys.Administration')) return true;
  return requiredPermissions.every((p) => userPermissions.includes(p));
}
