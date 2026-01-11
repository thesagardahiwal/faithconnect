import CustomSafeAreaView from '@/components/CustomSafeAreaView';
import ExpoUpdateChecker from '@/components/system/ExpoUpdateChecker';
import { store } from '@/store';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import "../global.css";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackTitle}>Something went wrong</Text>
      <Text style={styles.fallbackMessage}>{error?.message ?? 'App crashed.'}</Text>
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={resetErrorBoundary}
        activeOpacity={0.8}
      >
        <Text style={styles.reloadText}>Reload App</Text>
      </TouchableOpacity>
    </View>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  // Catch errors from any descendant
  if (error) {
    const reload = () => {
      setError(null);
      // For a hard reload, use Expo Updates or React Native restart.
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        // Fallback - reset to rerender
      }
    };
    return <ErrorFallback error={error} resetErrorBoundary={reload} />;
  }

  // We use an error boundary for function components with this hack:
  // See https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
  return (
    <ErrorBoundaryInner onError={setError}>
      {children}
    </ErrorBoundaryInner>
  );
}


class ErrorBoundaryInner extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff1fc',
    padding: 30,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: '#9c37eb',
    textAlign: 'center',
  },
  fallbackMessage: {
    color: '#2f2852',
    fontSize: 16,
    marginBottom: 28,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#885cf5',
    borderRadius: 48,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#a391e3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  reloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  }
});

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <CustomSafeAreaView>
          <ExpoUpdateChecker />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <Toast/>
        </CustomSafeAreaView>
      </ErrorBoundary>
    </Provider>
  );
}
