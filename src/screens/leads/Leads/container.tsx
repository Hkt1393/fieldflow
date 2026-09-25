import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import { ROUTES } from '../../../constants/routes';
import LeadsView from './view';

const LeadsContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Leads'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();

  return (
    <LeadsView
      onAction1={() => navigation.navigate(ROUTES.LeadDetails)}
      onAction2={() => navigation.navigate(ROUTES.CreateLead)}
      onAction3={() => navigation.navigate(ROUTES.EditLead)}
    />
  );
};

export default LeadsContainer;
