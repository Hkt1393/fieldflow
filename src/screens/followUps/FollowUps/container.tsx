import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import { ROUTES } from '../../../constants/routes';
import FollowUpsView from './view';

const FollowUpsContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'FollowUps'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();

  return (
    <FollowUpsView
      onAction1={() => navigation.navigate(ROUTES.CreateFollowUp)}
    />
  );
};

export default FollowUpsContainer;
