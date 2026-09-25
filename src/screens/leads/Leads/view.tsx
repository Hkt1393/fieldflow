import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type LeadsViewProps = {
  onAction1: () => void;
  onAction2: () => void;
  onAction3: () => void;
};

const LeadsView = ({ onAction1, onAction2, onAction3 }: LeadsViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Leads Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Lead details</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={onAction2} style={styles.action}><Text style={styles.actionText}>Create lead</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={onAction3} style={styles.action}><Text style={styles.actionText}>Edit lead</Text></Pressable>
  </View>
);

export default LeadsView;
