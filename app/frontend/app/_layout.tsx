import "../src/i18n";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from "../src/auth/AuthContext";
import { useRouter, useSegments } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';

function NavigationController({ children }: { children: React.ReactNode }) {
  const { authenticated, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!authenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (authenticated && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [authenticated, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <NavigationController>
            <View style={styles.stackWrapper}>
              <Stack screenOptions={{ headerShown: false }} />
            </View>
          </NavigationController>
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  stackWrapper: {
    flex: 1,
    ...Platform.select({
      web: {
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
      },
    }),
  },
});
