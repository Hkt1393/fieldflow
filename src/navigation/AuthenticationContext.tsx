import { createContext, useContext } from 'react';

export type AuthenticationContextValue = {
  onContinue: () => void;
};

export const AuthenticationContext =
  createContext<AuthenticationContextValue | null>(null);

export const useAuthentication = (): AuthenticationContextValue => {
  const context = useContext(AuthenticationContext);

  if (context === null) {
    throw new Error('useAuthentication must be used within RootNavigator.');
  }

  return context;
};
