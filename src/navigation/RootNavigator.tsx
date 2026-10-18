import { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthenticationContext } from './AuthenticationContext';
import { ROUTES } from '../constants/routes';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authenticationContext = useMemo(
    () => ({
      onContinue: () => setIsAuthenticated(true),
      onSignOut: () => setIsAuthenticated(false),
    }),
    [],
  );

  return (
    <AuthenticationContext.Provider value={authenticationContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name={ROUTES.App} component={AppNavigator} />
          ) : (
            <Stack.Screen name={ROUTES.Auth} component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthenticationContext.Provider>
  );
};
