import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Container, Title, Text, Button, Stack } from '@mantine/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Stack gap="md" align="center">
            <Title order={1} c="red">
              Something went wrong
            </Title>
            <Text c="dimmed" ta="center">
              {this.state.error?.message ||
                'An unexpected error has occurred.'}
            </Text>
            <Button onClick={this.handleReload} variant="filled">
              Reload Page
            </Button>
            <Button onClick={this.handleGoHome} variant="subtle">
              Go to Home
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
