import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { AppIcon } from '../components/ui';
import { strings } from '../constants/strings';
import { colors, scaleFont, typography } from '../theme';
import DashboardScreen from '../screens/dashboard/Dashboard';
import FollowUpsScreen from '../screens/followUps/FollowUps';
import LeadsScreen from '../screens/leads/Leads';
import MoreScreen from '../screens/more/More';
import { ROUTES } from '../constants/routes';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: colors.surface.primary,
    borderTopColor: colors.border.default,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: scaleFont(10),
  },
});

export const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName={ROUTES.Leads}
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary.default,
      tabBarInactiveTintColor: colors.text.primary,
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name={ROUTES.Dashboard}
      component={DashboardScreen}
      options={{ title: strings.leads.tabHome, tabBarIcon: ({ focused }) => <AppIcon color={focused ? 'brand' : 'primary'} name="home" size={23} /> }}
    />
    <Tab.Screen
      name={ROUTES.Leads}
      component={LeadsScreen}
      options={{ title: strings.leads.tabLeads, tabBarIcon: ({ focused }) => <AppIcon color={focused ? 'brand' : 'primary'} name="briefcase" size={23} /> }}
    />
    <Tab.Screen
      name={ROUTES.FollowUps}
      component={FollowUpsScreen}
      options={{ title: strings.leads.tabFollowUps, tabBarIcon: ({ focused }) => <AppIcon color={focused ? 'brand' : 'primary'} name="followUp" size={23} /> }}
    />
    <Tab.Screen
      name={ROUTES.More}
      component={MoreScreen}
      options={{ title: strings.leads.tabMore, tabBarIcon: ({ focused }) => <AppIcon color={focused ? 'brand' : 'primary'} name="filter" size={23} /> }}
    />
  </Tab.Navigator>
);
