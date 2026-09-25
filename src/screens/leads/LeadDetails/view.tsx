import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type LeadDetailsViewProps = {
  onAction1: () => void;
};

const LeadDetailsView = ({ onAction1 }: LeadDetailsViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>LeadDetails Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Edit lead</Text></Pressable>
  </View>
);

export default LeadDetailsView;
