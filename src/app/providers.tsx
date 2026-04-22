'use client';

import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { AuthProvider } from '@/lib/auth/providers/auth-provider';
import { ReduxProvider } from '@/lib/core/store/redux-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <MantineProvider colorSchemeManager={localStorageColorSchemeManager()} theme={theme}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MantineProvider>
    </ReduxProvider>
  );
}