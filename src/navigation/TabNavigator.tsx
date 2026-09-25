import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/dashboard/Dashboard';
import FollowUpsScreen from '../screens/followUps/FollowUps';
import LeadsScreen from '../screens/leads/Leads';
import MoreScreen from '../screens/more/More';
import { ROUTES } from '../constants/routes';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name={ROUTES.Dashboard} component={DashboardScreen} />
    <Tab.Screen name={ROUTES.Leads} component={LeadsScreen} />
    <Tab.Screen name={ROUTES.FollowUps} component={FollowUpsScreen} />
    <Tab.Screen name={ROUTES.More} component={MoreScreen} />
  </Tab.Navigator>
);
