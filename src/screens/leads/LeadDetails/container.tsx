import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../navigation/types';
import { ROUTES } from '../../../constants/routes';
import LeadDetailsView from './view';

const LeadDetailsContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'LeadDetails'>>();
  return (
    <LeadDetailsView onAction1={() => navigation.navigate(ROUTES.EditLead)} />
  );
};

export default LeadDetailsContainer;
