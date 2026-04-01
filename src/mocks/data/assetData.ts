/**
 * Asset Module Mock Data
 * Asset Register, Asset Disposal, Pre-Asset
 */

import type { AssetRegister } from '../../types';

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Asset Register Mock Data
export const generateAssetRegisters = (count = 50): AssetRegister[] => {
  const assets: AssetRegister[] = [
    { AssetId: 1, AssetCode: 'COMP-001', AssetName: 'Dell Laptop - CEO', CategoryId: 1, CategoryName: 'Computer Equipment', DepartmentId: 1, DepartmentName: 'Executive', LocationId: 1, LocationName: 'Head Office', VendorId: 1, VendorName: 'Tech Solutions', PurchaseDate: generateDate(365), PurchasePrice: 45000, CurCode: 'THB', DepreciationMethod: 'Straight Line', UsefulLife: 3, SalvageValue: 5000, AccumulatedDepreciation: 13333, NetBookValue: 31667, Status: 'Active' },
    { AssetId: 2, AssetCode: 'COMP-002', AssetName: 'HP Laptop - Finance', CategoryId: 1, CategoryName: 'Computer Equipment', DepartmentId: 2, DepartmentName: 'Finance', LocationId: 1, LocationName: 'Head Office', VendorId: 1, VendorName: 'Tech Solutions', PurchaseDate: generateDate(300), PurchasePrice: 38000, CurCode: 'THB', DepreciationMethod: 'Straight Line', UsefulLife: 3, SalvageValue: 4000, AccumulatedDepreciation: 9444, NetBookValue: 28556, Status: 'Active' },
    { AssetId: 3, AssetCode: 'FURN-001', AssetName: 'Office Desk Set', CategoryId: 2, CategoryName: 'Furniture', DepartmentId: 3, DepartmentName: 'Admin', LocationId: 1, LocationName: 'Head Office', VendorId: 2, VendorName: 'Office Mart', PurchaseDate: generateDate(730), PurchasePrice: 25000, CurCode: 'THB', DepreciationMethod: 'Straight Line', UsefulLife: 5, SalvageValue: 2500, AccumulatedDepreciation: 9000, NetBookValue: 16000, Status: 'Active' },
    { AssetId: 4, AssetCode: 'VEH-001', AssetName: 'Toyota Camry', CategoryId: 3, CategoryName: 'Vehicle', DepartmentId: 4, DepartmentName: 'Sales', LocationId: 2, LocationName: 'Parking', VendorId: 3, VendorName: 'Car Dealer', PurchaseDate: generateDate(545), PurchasePrice: 1200000, CurCode: 'THB', DepreciationMethod: 'Straight Line', UsefulLife: 5, SalvageValue: 200000, AccumulatedDepreciation: 333333, NetBookValue: 866667, Status: 'Active' },
    { AssetId: 5, AssetCode: 'MACH-001', AssetName: 'Printer - Color', CategoryId: 4, CategoryName: 'Machinery', DepartmentId: 3, DepartmentName: 'Admin', LocationId: 1, LocationName: 'Head Office', VendorId: 1, VendorName: 'Tech Solutions', PurchaseDate: generateDate(200), PurchasePrice: 85000, CurCode: 'THB', DepreciationMethod: 'Straight Line', UsefulLife: 5, SalvageValue: 5000, AccumulatedDepreciation: 26667, NetBookValue: 58333, Status: 'Active' },
  ];

  for (let i = 6; i <= count; i++) {
    const purchasePrice = Math.round(Math.random() * 100000) + 10000;
    const usefulLife = [3, 5, 7][i % 3];
    const age = Math.floor(Math.random() * usefulLife * 365) + 30;
    const annualDep = (purchasePrice - purchasePrice * 0.1) / usefulLife;
    const accDep = Math.min(annualDep * (age / 365), purchasePrice * 0.9);
    const netBook = purchasePrice - accDep;

    assets.push({
      AssetId: i,
      AssetCode: `ASSET-${String(i).padStart(3, '0')}`,
      AssetName: `Asset ${i} - ${['Computer', 'Furniture', 'Vehicle', 'Equipment'][i % 4]}`,
      CategoryId: (i % 4) + 1,
      CategoryName: ['Computer Equipment', 'Furniture', 'Vehicle', 'Machinery'][i % 4],
      DepartmentId: (i % 5) + 1,
      DepartmentName: ['Executive', 'Finance', 'Admin', 'Sales', 'IT'][i % 5],
      LocationId: (i % 3) + 1,
      LocationName: ['Head Office', 'Branch 1', 'Branch 2'][i % 3],
      VendorId: (i % 5) + 1,
      VendorName: `Vendor ${(i % 5) + 1}`,
      PurchaseDate: generateDate(age),
      PurchasePrice: purchasePrice,
      CurCode: 'THB',
      DepreciationMethod: 'Straight Line',
      UsefulLife: usefulLife,
      SalvageValue: purchasePrice * 0.1,
      AccumulatedDepreciation: Math.round(accDep),
      NetBookValue: Math.round(netBook),
      Status: i % 15 === 0 ? 'Disposed' : i % 12 === 0 ? 'Impaired' : 'Active',
    });
  }

  return assets;
};

// Asset Disposal Mock Data (subset of disposed assets)
export const generateAssetDisposals = (): AssetRegister[] => {
  const assets = generateAssetRegisters(20);
  return assets.filter(a => a.Status === 'Disposed').map(a => ({
    ...a,
    PurchasePrice: a.NetBookValue, // Disposal at book value
  }));
};

// Pre-Asset Mock Data (assets not yet capitalized)
export const generatePreAssets = (count = 15): AssetRegister[] => {
  const preAssets: AssetRegister[] = [];

  for (let i = 1; i <= count; i++) {
    preAssets.push({
      AssetId: 100 + i,
      AssetCode: `PRE-${String(i).padStart(3, '0')}`,
      AssetName: `Pre-Asset ${i} - Pending capitalization`,
      CategoryId: 1,
      CategoryName: 'Computer Equipment',
      DepartmentId: 1,
      DepartmentName: 'Executive',
      LocationId: 1,
      LocationName: 'Head Office',
      VendorId: 1,
      VendorName: 'Tech Solutions',
      PurchaseDate: generateDate(30),
      PurchasePrice: Math.round(Math.random() * 50000) + 10000,
      CurCode: 'THB',
      DepreciationMethod: 'Straight Line',
      UsefulLife: 3,
      SalvageValue: 0,
      AccumulatedDepreciation: 0,
      NetBookValue: 0,
      Status: 'Active', // Will become Asset when capitalized
    });
  }

  return preAssets;
};
