import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { strings } from '../../../constants/strings';
import { ROUTES } from '../../../constants/routes';
import { useDashboard } from '../../../hooks/useDashboard';
import { useAuthentication } from '../../../navigation/AuthenticationContext';
import type { TabParamList } from '../../../navigation/types';
import MoreView from './view';

type MoreAction = 'pipeline' | 'routing' | 'integrations' | 'offline' | 'notifications' | 'theme' | 'help' | 'about';

const MoreContainer = () => {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList, 'More'>>();
  const { onSignOut } = useAuthentication();
  const { metrics, isLoading, hasError, retry } = useDashboard();

  const onMenuAction = (action: MoreAction) => {
    if (action === 'pipeline') {
      navigation.navigate(ROUTES.Leads);
      return;
    }

    const informationalActions: Record<Exclude<MoreAction, 'pipeline'>, { title: string; message: string }> = {
      routing: { title: strings.more.crmUnavailableTitle, message: strings.more.routingUnavailable },
      integrations: { title: strings.more.crmUnavailableTitle, message: strings.more.integrationsUnavailable },
      offline: { title: strings.more.crmUnavailableTitle, message: strings.more.offlineUnavailable },
      notifications: { title: strings.more.crmUnavailableTitle, message: strings.more.notificationsUnavailable },
      theme: { title: strings.more.theme, message: strings.more.themeInfo },
      help: { title: strings.more.help, message: strings.more.helpUnavailable },
      about: { title: strings.more.about, message: strings.more.aboutMessage },
    };
    const information = informationalActions[action];
    Alert.alert(information.title, information.message);
  };

  const confirmSignOut = () => Alert.alert(
    strings.more.signOutTitle,
    strings.more.signOutMessage,
    [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.more.signOutConfirm, style: 'destructive', onPress: onSignOut },
    ],
  );

  return (
    <MoreView
      hasError={hasError}
      isLoading={isLoading}
      metrics={metrics ? {
        totalLeads: metrics.totalLeads,
        qualifiedLeads: metrics.qualifiedLeads,
        qualifiedPercentage: metrics.pipelineStages.find((stage) => stage.stage === 'qualified')?.percentage ?? 0,
        todayFollowUps: metrics.todayFollowUpCount,
        qualifiedPipelineValue: metrics.qualifiedPipelineValue,
      } : null}
      onMenuAction={onMenuAction}
      onRetry={retry}
      onSignOut={confirmSignOut}
    />
  );
};

export default MoreContainer;
