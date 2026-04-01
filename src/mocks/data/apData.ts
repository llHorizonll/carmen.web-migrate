/**
 * AP Module Mock Data
 * AP Invoices, AP Payments, AP Vendors
 */

import type { ApInvoice, ApInvoiceDetail, ApPayment, ApPaymentDetail, ApVendor } from '../../types';

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// AP Vendor Mock Data
export const generateApVendors = (count = 30): ApVendor[] => {
  const vendors: ApVendor[] = [
    { VendorId: 1, VendorCode: 'V001', VendorName: 'ABC Supplies Co., Ltd.', Address: '123 Main St, Bangkok', TaxId: '010553201', ContactPerson: 'Mr. Smith', Phone: '02-123-4567', Email: 'contact@abcsupplies.com', PaymentTerms: 'Net 30', CurCode: 'THB', IsActive: true },
    { VendorId: 2, VendorCode: 'V002', VendorName: 'XYZ Trading', Address: '456 Second Rd, Bangkok', TaxId: '010553202', ContactPerson: 'Ms. Johnson', Phone: '02-234-5678', Email: 'info@xyztrading.com', PaymentTerms: 'Net 15', CurCode: 'THB', IsActive: true },
    { VendorId: 3, VendorCode: 'V003', VendorName: 'Global Logistics', Address: '789 Third Ave, Bangkok', TaxId: '010553203', ContactPerson: 'Mr. Brown', Phone: '02-345-6789', Email: 'sales@globallogistics.com', PaymentTerms: 'Net 45', CurCode: 'THB', IsActive: true },
    { VendorId: 4, VendorCode: 'V004', VendorName: 'Tech Solutions', Address: '321 Fourth St, Bangkok', TaxId: '010553204', ContactPerson: 'Ms. Davis', Phone: '02-456-7890', Email: 'support@techsolutions.com', PaymentTerms: 'Net 30', CurCode: 'THB', IsActive: true },
    { VendorId: 5, VendorCode: 'V005', VendorName: 'Office Mart', Address: '654 Fifth Rd, Bangkok', TaxId: '010553205', ContactPerson: 'Mr. Wilson', Phone: '02-567-8901', Email: 'orders@officemart.com', PaymentTerms: 'Net 15', CurCode: 'THB', IsActive: true },
  ];

  for (let i = 6; i <= count; i++) {
    vendors.push({
      VendorId: i,
      VendorCode: `V${String(i).padStart(3, '0')}`,
      VendorName: `Vendor ${i} Company`,
      Address: `${i * 100} Address St, Bangkok`,
      TaxId: `010553${String(i + 200).padStart(3, '0')}`,
      ContactPerson: `Contact ${i}`,
      Phone: `02-${String(i).padStart(3, '0')}-${String(i * 10).padStart(4, '0')}`,
      Email: `vendor${i}@example.com`,
      PaymentTerms: ['Net 15', 'Net 30', 'Net 45'][i % 3],
      CurCode: 'THB',
      IsActive: true,
    });
  }

  return vendors;
};

// AP Invoice Mock Data
export const generateApInvoices = (count = 50): ApInvoice[] => {
  const vendors = generateApVendors(10);
  const invoices: ApInvoice[] = [];

  for (let i = 1; i <= count; i++) {
    const vendor = vendors[i % vendors.length];
    const invAmount = Math.round(Math.random() * 100000) + 5000;
    const vatAmount = invAmount * 0.07;
    const whtAmount = i % 3 === 0 ? invAmount * 0.03 : 0;
    const netAmount = invAmount + vatAmount - whtAmount;
    const status = i % 10 === 0 ? 'Void' : i % 5 === 0 ? 'Draft' : 'Normal';

    const details: ApInvoiceDetail[] = [
      {
        index: 0,
        ApInvdSeq: i * 100,
        ApInvhSeq: i,
        DeptCode: ['HQ', 'SALES', 'IT'][i % 3],
        AccCode: ['6100', '6200', '6300'][i % 3],
        Description: `Invoice item ${i} - ${['Office supplies', 'Services', 'Equipment'][i % 3]}`,
        Amount: invAmount,
        AmountBase: invAmount,
        VatCode: 'VAT7',
        VatAmount: vatAmount,
        WhtCode: i % 3 === 0 ? 'WHT3' : undefined,
        WhtAmount: whtAmount,
        NetAmount: netAmount,
      },
    ];

    invoices.push({
      ApInvhSeq: i,
      InvNo: `INV-2024-${String(i).padStart(4, '0')}`,
      InvDate: generateDate(i * 2),
      VendorId: vendor.VendorId,
      VendorCode: vendor.VendorCode,
      VendorName: vendor.VendorName,
      Description: `Purchase from ${vendor.VendorName}`,
      CurCode: 'THB',
      CurRate: 1,
      InvAmount: invAmount,
      InvAmountBase: invAmount,
      VatAmount: vatAmount,
      WhtAmount: whtAmount,
      NetAmount: netAmount,
      Status: status as 'Draft' | 'Normal' | 'Void',
      Detail: details,
      UserModified: 'admin',
    });
  }

  return invoices;
};

// AP Payment Mock Data
export const generateApPayments = (count = 40): ApPayment[] => {
  const vendors = generateApVendors(10);
  const payments: ApPayment[] = [];

  for (let i = 1; i <= count; i++) {
    const vendor = vendors[i % vendors.length];
    const pmtAmount = Math.round(Math.random() * 50000) + 5000;
    const status = i % 8 === 0 ? 'Void' : 'Normal';

    const details: ApPaymentDetail[] = [
      {
        index: 0,
        ApPmtdSeq: i * 100,
        ApPmtSeq: i,
        ApInvhSeq: i,
        InvNo: `INV-2024-${String(i).padStart(4, '0')}`,
        InvAmount: pmtAmount + 1000,
        InvBalance: 1000,
        PmtAmount: pmtAmount,
      },
    ];

    payments.push({
      ApPmtSeq: i,
      PmtNo: `PMT-2024-${String(i).padStart(4, '0')}`,
      PmtDate: generateDate(i * 3),
      VendorId: vendor.VendorId,
      VendorCode: vendor.VendorCode,
      VendorName: vendor.VendorName,
      Description: `Payment to ${vendor.VendorName}`,
      CurCode: 'THB',
      CurRate: 1,
      PmtAmount: pmtAmount,
      PmtAmountBase: pmtAmount,
      BankCode: ['SCB', 'KBANK', 'BBL'][i % 3],
      ChqNo: i % 2 === 0 ? `CHQ${String(i).padStart(6, '0')}` : undefined,
      ChqDate: i % 2 === 0 ? generateDate(i) : undefined,
      Status: status as 'Draft' | 'Normal' | 'Void',
      Detail: details,
      UserModified: 'admin',
    });
  }

  return payments;
};
