import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type CreateFollowUpViewProps = {
  onAction1: () => void;
};

const CreateFollowUpView = ({ onAction1 }: CreateFollowUpViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>CreateFollowUp Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Back</Text></Pressable>
  </View>
);

export default CreateFollowUpView;
