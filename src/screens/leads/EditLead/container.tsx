import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../navigation/types';
import EditLeadView from './view';

const EditLeadContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'EditLead'>>();
  return <EditLeadView onAction1={() => navigation.goBack()} />;
};

export default EditLeadContainer;
