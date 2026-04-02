/**
 * Carmen API Authentication Test (Node.js Compatible)
 * Tests the login flow and token management
 * 
 * Run with: npx tsx src/services/carmenAuth.node.test.ts
 */

// Mock localStorage for Node.js
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

// @ts-ignore
global.localStorage = localStorageMock;

// Mock window
global.window = {
  config: {
    apiUrl: 'http://localhost:5000',
    adminToken: '',
    arrCompany: [],
  },
  location: {
    href: 'http://localhost:5173',
    origin: 'http://localhost:5173',
    replace: () => {},
  },
} as any;

import {
  carmenLogin,
  carmenLogout,
  getAccessToken,
  getCurrentUser,
  isAuthenticated,
  decodeToken,
  carmenConfig,
  clearAuth,
  carmenAxios,
} from './carmenAuth.js';

// Simple test runner
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: unknown;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      results.push({ name, passed: true });
      console.log(`✅ ${name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({ name, passed: false, error: errorMessage });
      console.log(`❌ ${name}: ${errorMessage}`);
    }
  };
}

// ============================================================================
// Tests
// ============================================================================

async function runTests() {
  console.log('==============================================');
  console.log('🧪 Carmen API Authentication Tests');
  console.log('==============================================');
  console.log(`API Base URL: ${carmenConfig.baseURL}`);
  console.log('');

  // Clear any existing auth
  clearAuth();

  // Test 1: Initial state - not authenticated
  await test('Initial state: not authenticated', () => {
    if (isAuthenticated()) {
      throw new Error('Should not be authenticated initially');
    }
  })();

  // Test 2: Login with default credentials
  await test('Login with default credentials', async () => {
    try {
      const response = await carmenLogin();
      
      if (!response.AccessToken) {
        throw new Error('No access token received');
      }
      
      console.log('   📧 Login Response:');
      console.log('   - AccessToken:', response.AccessToken.substring(0, 50) + '...');
      if (response.RefreshToken) {
        console.log('   - RefreshToken:', response.RefreshToken.substring(0, 50) + '...');
      }
      if (response.ExpiresIn) {
        console.log('   - ExpiresIn:', response.ExpiresIn, 'seconds');
      }
      if (response.User) {
        console.log('   - User:', JSON.stringify(response.User, null, 2));
      }
    } catch (error: any) {
      if (error.response) {
        console.log('   ⚠️ API Error:', error.response.status);
        console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  })();

  // Test 3: Check token is stored
  await test('Token is stored in localStorage', () => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    console.log('   🔑 Token stored:', token.substring(0, 50) + '...');
  })();

  // Test 4: Check authenticated state
  await test('Authenticated after login', () => {
    if (!isAuthenticated()) {
      throw new Error('Should be authenticated after login');
    }
    console.log('   ✅ User is authenticated');
  })();

  // Test 5: Decode token
  await test('Decode JWT token', () => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No token to decode');
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
      throw new Error('Failed to decode token');
    }
    
    console.log('   📋 Decoded Token:');
    console.log('   - UserId:', decoded.UserId);
    console.log('   - UserName:', decoded.UserName);
    console.log('   - Email:', decoded.Email);
    console.log('   - Exp:', new Date(decoded.exp * 1000).toISOString());
  })();

  // Test 6: Get current user
  await test('Get current user from token', () => {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Failed to get current user');
    }
    
    console.log('   👤 Current User:');
    console.log('   - UserId:', user.UserId);
    console.log('   - UserName:', user.UserName);
    console.log('   - Email:', user.Email);
  })();

  // Test 7: Make an authenticated API call
  await test('Make authenticated API call', async () => {
    try {
      // Try to fetch current user info from API
      const response = await carmenAxios.get('/api/User/Me');
      console.log('   📡 API Response:', JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('   ⚠️ Endpoint not found (expected for this API version)');
      } else {
        throw error;
      }
    }
  })();

  // Test 8: Login with custom credentials
  await test('Login with custom credentials', async () => {
    clearAuth();
    
    try {
      const response = await carmenLogin({
        UserName: 'admin',
        Password: 'alpha',
        Tenant: 'dev',
        Email: 'admin@carmen.com',
        Language: 'en-US',
      });
      
      if (!response.AccessToken) {
        throw new Error('Login with custom credentials failed');
      }
      
      console.log('   ✅ Custom credentials login successful');
    } catch (error: any) {
      if (error.response) {
        console.log('   ⚠️ API Error:', error.response.status);
        console.log('   Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  })();

  // Test 9: Logout
  await test('Logout clears authentication', () => {
    carmenLogout();
    
    if (isAuthenticated()) {
      throw new Error('Should not be authenticated after logout');
    }
    
    if (getAccessToken()) {
      throw new Error('Token should be cleared after logout');
    }
    
    console.log('   ✅ Logout successful');
  })();

  // ============================================================================
  // Summary
  // ============================================================================
  
  console.log('');
  console.log('==============================================');
  console.log('📊 Test Summary');
  console.log('==============================================');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`Total: ${results.length} tests`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('');
    console.log('Failed Tests:');
    results
      .filter(r => !r.passed)
      .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  
  console.log('');
  console.log(failed === 0 ? '🎉 All tests passed!' : '⚠️ Some tests failed');
  
  return failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
