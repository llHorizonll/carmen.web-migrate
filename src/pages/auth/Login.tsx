import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconBuilding,
  IconCheck,
  IconLanguage,
  IconLock,
  IconLogin,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import {
  useAuthStore,
  loginApi,
  getTenantsByUsername,
  getStoredUsername,
  getStoredTenant,
  getStoredLanguage,
  type Tenant,
} from '../../contexts/AuthContext';

// ============================================================================
// Validation Schema
// ============================================================================

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().optional(),
  tenant: z.string().optional(),
  language: z.string().optional(),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================================
// Language Options
// ============================================================================

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'th-TH', label: 'ไทย (Thai)' },
  { value: 'vi-VN', label: 'Tiếng Việt (Vietnamese)' },
];

// ============================================================================
// Copyright Component
// ============================================================================

function Copyright() {
  return (
    <Text size="sm" c="dimmed" ta="center" mt="xl">
      Copyright ©{' '}
      <Text component="a" href="https://carmensoftware.com/" inherit c="blue">
        Carmen Software Co.,Ltd.
      </Text>{' '}
      {new Date().getFullYear()}.
    </Text>
  );
}

// ============================================================================
// Main Login Component
// ============================================================================

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [passwordVisible, { toggle: togglePassword }] = useDisclosure(false);

  const { login, isAuthenticated } = useAuthStore();

  // Get redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Initialize form with stored values
  const form = useForm<LoginFormValues>({
    initialValues: {
      username: getStoredUsername(),
      password: '',
      tenant: getStoredTenant() || 'dev',
      language: getStoredLanguage() || 'en-US',
      rememberMe: localStorage.getItem('RememberMe') === 'true',
    },
    validate: zodResolver(loginSchema),
  });

  // Step 1: Validate username and get tenants
  const handleCheckUser = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Try to get tenants from API
      let tenantList: Tenant[] = [];
      try {
        tenantList = await getTenantsByUsername(values.username);
      } catch (apiError) {
        // Fallback for development - use default tenant
        console.warn('API not available, using default tenant for development');
        tenantList = [
          {
            TenantId: 1,
            Tenant: 'dev',
            Description: 'Development',
            IsDefault: true,
          },
        ];
      }
      
      if (!tenantList || tenantList.length === 0) {
        notifications.show({
          title: 'User Not Found',
          message: 'No tenants available for this user.',
          color: 'red',
          icon: <IconX size={16} />,
        });
        return;
      }

      setTenants(tenantList);
      
      // Auto-select default tenant if available
      const defaultTenant = tenantList.find((t) => t.IsDefault);
      if (defaultTenant) {
        form.setFieldValue('tenant', defaultTenant.Tenant);
      } else if (tenantList.length > 0) {
        form.setFieldValue('tenant', tenantList[0].Tenant);
      }

      setStep(2);
      notifications.show({
        title: 'Success',
        message: 'User validated. Please enter your password.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to validate user';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Perform login
  const handleLogin = async (values: LoginFormValues) => {
    // Validate required fields for step 2
    if (!values.password || values.password.length < 1) {
      notifications.show({
        title: 'Validation Error',
        message: 'Password is required',
        color: 'red',
        icon: <IconX size={16} />,
      });
      return;
    }
    if (!values.tenant || values.tenant.length < 1) {
      notifications.show({
        title: 'Validation Error',
        message: 'Tenant is required',
        color: 'red',
        icon: <IconX size={16} />,
      });
      return;
    }
    if (!values.language || values.language.length < 1) {
      notifications.show({
        title: 'Validation Error',
        message: 'Language is required',
        color: 'red',
        icon: <IconX size={16} />,
      });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      try {
        response = await loginApi({
          Tenant: values.tenant,
          UserName: values.username,
          Password: values.password,
          Language: values.language,
        });
      } catch (apiError) {
        // Fallback for development mode
        console.warn('API not available, using mock login for development');
        if (values.username === 'admin' && values.password === 'alpha') {
          response = {
            AccessToken: 'mock-token-' + Date.now(),
            RefreshToken: 'mock-refresh-' + Date.now(),
            ExpiresIn: 3600,
            User: {
              UserId: 1,
              UserName: values.username,
              FullName: 'Administrator',
              Email: 'admin@carmen.com',
              Permissions: ['Sys.Administration'],
              DefaultLanguage: values.language,
            },
          };
        } else {
          throw new Error('Invalid credentials. Use admin/alpha for development.');
        }
      }

      login(response, values.tenant, values.rememberMe);

      notifications.show({
        title: 'Welcome Back!',
        message: `Hello, ${response.User.FullName || response.User.UserName}!`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // Navigate to the intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      notifications.show({
        title: 'Login Failed',
        message,
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (values: LoginFormValues) => {
    if (step === 1) {
      handleCheckUser(values);
    } else {
      handleLogin(values);
    }
  };

  const handleBack = () => {
    setStep(1);
    setTenants([]);
    form.setFieldValue('password', '');
  };

  // Get tenant select data
  const tenantSelectData = tenants.map((t) => ({
    value: t.Tenant,
    label: t.Description ? `${t.Description} (${t.Tenant})` : t.Tenant,
  }));

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: rem(16),
      }}
    >
      <Container size={420} w="100%">
        <Paper
          radius="md"
          p="xl"
          withBorder
          shadow="xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'md', blur: 2 }} />

          {/* Header */}
          <Stack align="center" gap="xs" mb="lg">
            <Box
              style={{
                width: rem(64),
                height: rem(64),
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #228be6 0%, #1864ab 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconLock size={32} color="white" />
            </Box>
            <Title order={2} ta="center" c="dark">
              {step === 1 ? 'Sign In' : 'Enter Password'}
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              {step === 1
                ? 'Enter your username to continue'
                : `Welcome back, ${form.values.username}`}
            </Text>
          </Stack>

          <Divider mb="lg" />

          {/* Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {/* Username Field - Always visible */}
              <TextInput
                label="Username"
                placeholder="Enter your username"
                leftSection={<IconUser size={16} />}
                disabled={step === 2 || isLoading}
                {...form.getInputProps('username')}
                styles={{
                  input: {
                    '&:disabled': {
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                    },
                  },
                }}
              />

              {/* Step 2 Fields */}
              {step === 2 && (
                <>
                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    leftSection={<IconLock size={16} />}
                    visible={passwordVisible}
                    onVisibilityChange={togglePassword}
                    autoFocus
                    {...form.getInputProps('password')}
                  />

                  <Select
                    label="Business Unit (Tenant)"
                    placeholder="Select tenant"
                    leftSection={<IconBuilding size={16} />}
                    data={tenantSelectData}
                    disabled={tenants.length === 0}
                    {...form.getInputProps('tenant')}
                  />

                  <Select
                    label="Language"
                    placeholder="Select language"
                    leftSection={<IconLanguage size={16} />}
                    data={LANGUAGE_OPTIONS}
                    {...form.getInputProps('language')}
                  />

                  <Checkbox
                    label="Remember me"
                    {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                  />
                </>
              )}

              {/* Buttons */}
              <Group justify="space-between" mt="md">
                {step === 2 ? (
                  <Button
                    variant="subtle"
                    onClick={handleBack}
                    disabled={isLoading}
                    color="gray"
                  >
                    Back
                  </Button>
                ) : (
                  <Box /> // Spacer
                )}

                <Button
                  type="submit"
                  loading={isLoading}
                  leftSection={step === 1 ? undefined : <IconLogin size={16} />}
                  disabled={step === 2 && tenants.length === 0}
                >
                  {step === 1 ? 'Next' : 'Sign In'}
                </Button>
              </Group>
            </Stack>
          </form>

          {/* Forgot Password Link */}
          {step === 2 && (
            <Group justify="center" mt="md">
              <Button
                variant="transparent"
                size="xs"
                color="blue"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Button>
            </Group>
          )}

          <Copyright />
        </Paper>

        {/* Developer Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card mt="md" p="sm" withBorder radius="md" bg="rgba(255,255,255,0.9)">
            <Text size="xs" c="dimmed" ta="center">
              🔧 Developer Mode
              <br />
              Default: Tenant=dev, UserName=admin, Password=alpha
            </Text>
          </Card>
        )}
      </Container>
    </Box>
  );
}
