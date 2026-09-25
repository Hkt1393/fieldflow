import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type FollowUpsViewProps = {
  onAction1: () => void;
};

const FollowUpsView = ({ onAction1 }: FollowUpsViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>FollowUps Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Create follow-up</Text></Pressable>
  </View>
);

export default FollowUpsView;
