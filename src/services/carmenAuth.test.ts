/**
 * Carmen API Authentication Test
 * Tests the login flow and token management
 * 
 * Run with: npx tsx src/services/carmenAuth.test.ts
 * Or: node --loader ts-node/esm src/services/carmenAuth.test.ts
 */

import {
  carmenLogin,
  carmenLogout,
  getAccessToken,
  getCurrentUser,
  isAuthenticated,
  decodeToken,
  carmenConfig,
  clearAuth,
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

  // Test 7: Login with custom credentials
  await test('Login with custom credentials', async () => {
    clearAuth();
    
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
  })();

  // Test 8: Logout
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
