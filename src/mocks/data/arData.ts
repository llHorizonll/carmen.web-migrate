/**
 * AR Module Mock Data
 * AR Invoices, AR Receipts, AR Profiles, AR Folio
 */

import type { ArInvoice, ArInvoiceDetail, ArReceipt, ArReceiptDetail, ArProfile, ArFolio } from '../../types';

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// AR Profile (Customer) Mock Data
export const generateArProfiles = (count = 30): ArProfile[] => {
  const profiles: ArProfile[] = [
    { ProfileId: 1, ProfileCode: 'C001', ProfileName: 'Acme Corporation', ArTypeId: 1, ArTypeName: 'Corporate', TitleId: 1, TitleName: 'Mr.', OwnerId: 1, OwnerName: 'John Smith', ProjectId: 1, ProjectName: 'Project Alpha', Address: '100 Business Park, Bangkok', TaxId: '010554501', ContactPerson: 'Jane Doe', Phone: '02-111-2222', Email: 'billing@acme.com', CreditLimit: 500000, CurCode: 'THB', IsActive: true },
    { ProfileId: 2, ProfileCode: 'C002', ProfileName: 'Global Industries', ArTypeId: 1, ArTypeName: 'Corporate', TitleId: 2, TitleName: 'Ms.', OwnerId: 2, OwnerName: 'Sarah Johnson', ProjectId: 2, ProjectName: 'Project Beta', Address: '200 Industrial Zone, Bangkok', TaxId: '010554502', ContactPerson: 'Mike Chen', Phone: '02-222-3333', Email: 'ap@globalind.com', CreditLimit: 1000000, CurCode: 'THB', IsActive: true },
    { ProfileId: 3, ProfileCode: 'C003', ProfileName: 'Tech Ventures', ArTypeId: 2, ArTypeName: 'SME', TitleId: 1, TitleName: 'Mr.', OwnerId: 3, OwnerName: 'David Lee', ProjectId: 3, ProjectName: 'Project Gamma', Address: '300 Tech Hub, Bangkok', TaxId: '010554503', ContactPerson: 'Lisa Wang', Phone: '02-333-4444', Email: 'finance@techventures.com', CreditLimit: 300000, CurCode: 'THB', IsActive: true },
    { ProfileId: 4, ProfileCode: 'C004', ProfileName: 'Service Solutions', ArTypeId: 2, ArTypeName: 'SME', TitleId: 2, TitleName: 'Ms.', OwnerId: 1, OwnerName: 'John Smith', ProjectId: 4, ProjectName: 'Project Delta', Address: '400 Service Center, Bangkok', TaxId: '010554504', ContactPerson: 'Tom Brown', Phone: '02-444-5555', Email: 'accounting@servicesol.com', CreditLimit: 200000, CurCode: 'THB', IsActive: true },
    { ProfileId: 5, ProfileCode: 'C005', ProfileName: 'Mega Trading', ArTypeId: 1, ArTypeName: 'Corporate', TitleId: 1, TitleName: 'Mr.', OwnerId: 2, OwnerName: 'Sarah Johnson', ProjectId: 5, ProjectName: 'Project Epsilon', Address: '500 Trade Center, Bangkok', TaxId: '010554505', ContactPerson: 'Amy Zhang', Phone: '02-555-6666', Email: 'payments@megatrading.com', CreditLimit: 800000, CurCode: 'THB', IsActive: true },
  ];

  for (let i = 6; i <= count; i++) {
    profiles.push({
      ProfileId: i,
      ProfileCode: `C${String(i).padStart(3, '0')}`,
      ProfileName: `Customer ${i} Ltd.`,
      ArTypeId: (i % 2) + 1,
      ArTypeName: i % 2 === 0 ? 'Corporate' : 'SME',
      TitleId: (i % 2) + 1,
      TitleName: i % 2 === 0 ? 'Mr.' : 'Ms.',
      OwnerId: (i % 3) + 1,
      OwnerName: `Owner ${(i % 3) + 1}`,
      ProjectId: i,
      ProjectName: `Project ${String.fromCharCode(65 + (i % 26))}`,
      Address: `${i * 100} Customer Rd, Bangkok`,
      TaxId: `010554${String(i + 500).padStart(3, '0')}`,
      ContactPerson: `Contact ${i}`,
      Phone: `02-${String(i).padStart(3, '0')}-${String(i * 10).padStart(4, '0')}`,
      Email: `customer${i}@example.com`,
      CreditLimit: Math.round(Math.random() * 500000) + 100000,
      CurCode: 'THB',
      IsActive: true,
    });
  }

  return profiles;
};

// AR Invoice Mock Data
export const generateArInvoices = (count = 50): ArInvoice[] => {
  const profiles = generateArProfiles(10);
  const invoices: ArInvoice[] = [];

  for (let i = 1; i <= count; i++) {
    const profile = profiles[i % profiles.length];
    const invAmount = Math.round(Math.random() * 150000) + 10000;
    const vatAmount = invAmount * 0.07;
    const netAmount = invAmount + vatAmount;
    const status = i % 10 === 0 ? 'Void' : i % 5 === 0 ? 'Draft' : 'Normal';

    const details: ArInvoiceDetail[] = [
      {
        index: 0,
        ArInvdSeq: i * 100,
        ArInvhSeq: i,
        DeptCode: ['HQ', 'SALES', 'IT'][i % 3],
        AccCode: ['4000', '4100', '4200'][i % 3],
        Description: `Service ${i} - ${['Consulting', 'Maintenance', 'License'][i % 3]}`,
        Amount: invAmount,
        AmountBase: invAmount,
        VatCode: 'VAT7',
        VatAmount: vatAmount,
      },
    ];

    invoices.push({
      ArInvhSeq: i,
      InvNo: `AR-${String(2024)}-${String(i).padStart(4, '0')}`,
      InvDate: generateDate(i * 2),
      ProfileId: profile.ProfileId,
      ProfileCode: profile.ProfileCode,
      ProfileName: profile.ProfileName,
      Description: `Invoice for ${profile.ProfileName}`,
      CurCode: 'THB',
      CurRate: 1,
      InvAmount: invAmount,
      InvAmountBase: invAmount,
      VatAmount: vatAmount,
      NetAmount: netAmount,
      Status: status as 'Draft' | 'Normal' | 'Void',
      Detail: details,
      UserModified: 'admin',
    });
  }

  return invoices;
};

// AR Receipt Mock Data
export const generateArReceipts = (count = 40): ArReceipt[] => {
  const profiles = generateArProfiles(10);
  const receipts: ArReceipt[] = [];

  for (let i = 1; i <= count; i++) {
    const profile = profiles[i % profiles.length];
    const rcptAmount = Math.round(Math.random() * 80000) + 5000;
    const status = i % 8 === 0 ? 'Void' : 'Normal';

    const details: ArReceiptDetail[] = [
      {
        index: 0,
        ArRcptdSeq: i * 100,
        ArRcptSeq: i,
        ArInvhSeq: i,
        InvNo: `AR-2024-${String(i).padStart(4, '0')}`,
        InvAmount: rcptAmount + 2000,
        InvBalance: 2000,
        RcptAmount: rcptAmount,
      },
    ];

    receipts.push({
      ArRcptSeq: i,
      RcptNo: `RCPT-2024-${String(i).padStart(4, '0')}`,
      RcptDate: generateDate(i * 3),
      ProfileId: profile.ProfileId,
      ProfileCode: profile.ProfileCode,
      ProfileName: profile.ProfileName,
      Description: `Receipt from ${profile.ProfileName}`,
      CurCode: 'THB',
      CurRate: 1,
      RcptAmount: rcptAmount,
      RcptAmountBase: rcptAmount,
      BankCode: ['SCB', 'KBANK', 'BBL'][i % 3],
      ChqNo: i % 2 === 0 ? `CHQ${String(i).padStart(6, '0')}` : undefined,
      ChqDate: i % 2 === 0 ? generateDate(i) : undefined,
      Status: status as 'Draft' | 'Normal' | 'Void',
      Detail: details,
      UserModified: 'admin',
    });
  }

  return receipts;
};

// AR Folio Mock Data (Running Balance)
export const generateArFolios = (profileId: number, count = 20): ArFolio[] => {
  const folios: ArFolio[] = [];
  let balance = 0;

  for (let i = 1; i <= count; i++) {
    const transType = i % 3 === 0 ? 'Receipt' : i % 3 === 1 ? 'Credit Note' : 'Invoice';
    const debit = transType === 'Invoice' ? Math.round(Math.random() * 50000) + 5000 : 0;
    const credit = transType === 'Receipt' || transType === 'Credit Note' ? Math.round(Math.random() * 30000) + 3000 : 0;
    balance += debit - credit;

    folios.push({
      FolioId: i,
      ProfileId: profileId,
      ProfileCode: `C${String(profileId).padStart(3, '0')}`,
      ProfileName: `Customer ${profileId}`,
      TransDate: generateDate(i * 5),
      TransType: transType,
      TransNo: transType === 'Invoice' ? `AR-2024-${String(i).padStart(4, '0')}` : `RCPT-2024-${String(i).padStart(4, '0')}`,
      Description: `${transType} transaction ${i}`,
      Debit: debit,
      Credit: credit,
      Balance: balance,
    });
  }

  return folios.reverse();
};
