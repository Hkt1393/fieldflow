import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../navigation/types';
import CreateLeadView from './view';

const CreateLeadContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'CreateLead'>>();
  return <CreateLeadView onAction1={() => navigation.goBack()} />;
};

export default CreateLeadContainer;
