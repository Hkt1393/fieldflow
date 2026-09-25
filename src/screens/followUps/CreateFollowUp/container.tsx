import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../navigation/types';
import CreateFollowUpView from './view';

const CreateFollowUpContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'CreateFollowUp'>>();
  return <CreateFollowUpView onAction1={() => navigation.goBack()} />;
};

export default CreateFollowUpContainer;
