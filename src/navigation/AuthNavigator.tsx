import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/Login';
import { ROUTES } from '../constants/routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={ROUTES.Login}
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
