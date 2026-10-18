import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppText } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import { colors } from '../../../theme';
import { LeadFormView } from '../CreateLead/view';
import type { LeadFormViewProps } from '../CreateLead/view';
import { styles } from './styles';

type EditLeadViewProps =
  | { state: 'loading' }
  | { state: 'error'; onRetry: () => void }
  | { state: 'notFound'; onBack: () => void }
  | ({ state: 'form' } & Omit<LeadFormViewProps, 'title' | 'submitTitle' | 'submittingTitle' | 'errorMessage'>);

const EditLeadView = (props: EditLeadViewProps) => {
  if (props.state === 'loading') {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View accessibilityLiveRegion="polite" style={styles.feedbackState}>
          <ActivityIndicator color={colors.primary.default} size="small" />
          <AppText color="secondary" variant="bodyMd">{strings.leads.details.loading}</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (props.state === 'error') {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View accessibilityRole="alert" style={styles.feedbackState}>
          <AppText color="error" variant="bodyMd">{strings.leads.details.loadError}</AppText>
          <AppButton onPress={props.onRetry} title={strings.common.retry} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  if (props.state === 'notFound') {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <AppText color="secondary" variant="bodyMd">{strings.leads.details.notFound}</AppText>
          <AppButton onPress={props.onBack} title={strings.common.back} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LeadFormView
      control={props.control}
      errorMessage={strings.leads.edit.error}
      hasError={props.hasError}
      isSubmitting={props.isSubmitting}
      onCancel={props.onCancel}
      onFormChange={props.onFormChange}
      onSubmit={props.onSubmit}
      submittingTitle={strings.leads.edit.submitting}
      submitTitle={strings.common.save}
      title={strings.leads.edit.title}
    />
  );
};

export default EditLeadView;
