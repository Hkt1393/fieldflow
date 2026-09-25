import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type EditLeadViewProps = {
  onAction1: () => void;
};

const EditLeadView = ({ onAction1 }: EditLeadViewProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>EditLead Screen</Text>
      <Pressable accessibilityRole="button" onPress={onAction1} style={styles.action}><Text style={styles.actionText}>Back</Text></Pressable>
  </View>
);

export default EditLeadView;
