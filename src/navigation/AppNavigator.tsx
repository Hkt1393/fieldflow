import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateFollowUpScreen from '../screens/followUps/CreateFollowUp';
import EditFollowUpScreen from '../screens/followUps/EditFollowUp';
import CreateLeadScreen from '../screens/leads/CreateLead';
import EditLeadScreen from '../screens/leads/EditLead';
import LeadDetailsScreen from '../screens/leads/LeadDetails';
import { ROUTES } from '../constants/routes';
import { TabNavigator } from './TabNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={ROUTES.Tabs}
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen name={ROUTES.LeadDetails} component={LeadDetailsScreen} />
    <Stack.Screen name={ROUTES.CreateLead} component={CreateLeadScreen} />
    <Stack.Screen name={ROUTES.EditLead} component={EditLeadScreen} />
    <Stack.Screen name={ROUTES.CreateFollowUp} component={CreateFollowUpScreen} />
    <Stack.Screen name={ROUTES.EditFollowUp} component={EditFollowUpScreen} />
  </Stack.Navigator>
);
