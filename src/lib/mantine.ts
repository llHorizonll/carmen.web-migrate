import { createTheme, MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 8 },
  colors: {
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6', // Primary
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
    ],
    green: [
      '#ebfbee',
      '#d3f9d8',
      '#b2f2bb',
      '#8ce99a',
      '#69db7c',
      '#51cf66',
      '#40c057', // Success
      '#37b24d',
      '#2f9e44',
      '#2b8a3e',
    ],
    red: [
      '#fff5f5',
      '#ffe3e3',
      '#ffc9c9',
      '#ffa8a8',
      '#ff8787',
      '#ff6b6b',
      '#fa5252', // Danger
      '#f03e3e',
      '#e03131',
      '#c92a2a',
    ],
    yellow: [
      '#fff9db',
      '#fff3bf',
      '#ffec99',
      '#ffe066',
      '#ffd43b',
      '#fcc419',
      '#fab005', // Warning
      '#f59f00',
      '#f08c00',
      '#e67700',
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        size: 'sm',
      },
    },
    Table: {
      styles: {
        table: {
          borderCollapse: 'collapse',
        },
        th: {
          fontWeight: 600,
          backgroundColor: '#f8f9fa',
        },
      },
    },
  },
});
