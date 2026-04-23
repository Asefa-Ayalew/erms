'use client';

import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { AuthProvider } from '@/lib/auth/providers/auth-provider';
import { ReduxProvider } from '@/lib/core/store/redux-provider';

const colorSchemeManager = localStorageColorSchemeManager();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <MantineProvider colorSchemeManager={colorSchemeManager} theme={theme}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MantineProvider>
    </ReduxProvider>
  );
}