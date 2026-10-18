import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppCard, AppText } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import { colors } from '../../../theme';
import { styles } from './styles';

export type LeadDetailsData = {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  stage: string;
  priority: string;
  dealValue: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadDetailsViewProps =
  | { state: 'loading' }
  | { state: 'notFound' }
  | { state: 'error'; onRetry: () => void }
  | {
    state: 'success';
    lead: LeadDetailsData;
    isDeleting: boolean;
    hasDeleteError: boolean;
    onDelete: () => void;
    onEdit: () => void;
  };

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <AppText color="secondary" variant="bodyMd">{label}</AppText>
    <AppText numberOfLines={3} style={styles.detailValue} variant="bodyMd">{value}</AppText>
  </View>
);

const LeadDetailsView = (props: LeadDetailsViewProps) => {
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

  if (props.state === 'notFound') {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.feedbackState}>
          <AppText color="secondary" variant="bodyMd">{strings.leads.details.notFound}</AppText>
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

  const { lead, onEdit, onDelete, isDeleting, hasDeleteError } = props;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <AppText style={styles.leadName} variant="headlineXl">{lead.name}</AppText>
          <AppText color="secondary" variant="bodyLg">{lead.title}</AppText>
        </View>

        <AppCard style={styles.sectionCard}>
          <AppText style={styles.sectionTitle} variant="headlineSm">{strings.leads.details.contactSection}</AppText>
          <DetailRow label={strings.leads.details.company} value={lead.company} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.email} value={lead.email} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.phone} value={lead.phone} />
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <AppText style={styles.sectionTitle} variant="headlineSm">{strings.leads.details.pipelineSection}</AppText>
          <DetailRow label={strings.leads.details.stage} value={lead.stage} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.priority} value={lead.priority} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.dealValue} value={lead.dealValue} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.createdAt} value={lead.createdAt} />
          <View style={styles.separator} />
          <DetailRow label={strings.leads.details.updatedAt} value={lead.updatedAt} />
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <AppText style={styles.sectionTitle} variant="headlineSm">{strings.leads.details.notesSection}</AppText>
          <AppText color="secondary" variant="bodyMd">{lead.notes}</AppText>
        </AppCard>

        {hasDeleteError ? (
          <AppText accessibilityRole="alert" color="error" variant="bodyMd">
            {strings.leads.deleteConfirmation.error}
          </AppText>
        ) : null}
        <AppButton disabled={isDeleting} onPress={onEdit} title={strings.leads.editLead} />
        <AppButton
          loading={isDeleting}
          onPress={onDelete}
          title={isDeleting ? strings.leads.deleteConfirmation.deleting : strings.leads.deleteLead}
          variant="destructive"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeadDetailsView;
