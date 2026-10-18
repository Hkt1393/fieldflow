import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '../../../constants/routes';
import { useDashboard } from '../../../hooks/useDashboard';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import DashboardView from './view';

const DashboardContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Dashboard'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
  const { metrics, isLoading, hasError, completeFollowUp, retry } = useDashboard();

  return (
    <DashboardView
      hasError={hasError}
      isLoading={isLoading}
      metrics={metrics}
      onAddLead={() => navigation.navigate(ROUTES.CreateLead)}
      onCompleteFollowUp={completeFollowUp}
      onOpenLead={(leadId) => navigation.navigate(ROUTES.LeadDetails, { leadId })}
      onRetry={retry}
      onViewFollowUps={() => navigation.navigate(ROUTES.FollowUps)}
    />
  );
};

export default DashboardContainer;
