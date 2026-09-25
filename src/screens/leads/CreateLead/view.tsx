import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type CreateLeadViewProps = {
  onAction1: () => void;
};

const CreateLeadView = ({ onAction1 }: CreateLeadViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>CreateLead Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Back</Text></Pressable>
  </View>
);

export default CreateLeadView;
