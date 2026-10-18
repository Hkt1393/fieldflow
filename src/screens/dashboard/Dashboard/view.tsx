import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppCard, AppIcon, AppPressable, AppText } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { DashboardMetrics } from '../../../hooks/useDashboard';
import { colors } from '../../../theme';
import {
  getStageSegmentFlex,
  metricAccentStyles,
  stageSegmentStyles,
  styles,
} from './styles';

type DashboardViewProps = {
  hasError: boolean;
  isLoading: boolean;
  metrics: DashboardMetrics | null;
  onAddLead: () => void;
  onCompleteFollowUp: (id: string) => void;
  onOpenLead: (id: string) => void;
  onRetry: () => void;
  onViewFollowUps: () => void;
};

type MetricCardProps = {
  accent: 'blue' | 'green' | 'cyan' | 'amber';
  label: string;
  value: string | number;
  caption: string;
};

const MetricCard = ({ accent, label, value, caption }: MetricCardProps) => (
  <AppCard style={styles.metricCard}>
    <View style={styles.metricHeading}>
      <AppText color="secondary" numberOfLines={1} variant="labelMd">{label}</AppText>
      <View style={[styles.metricDot, metricAccentStyles[accent]]} />
    </View>
    <AppText style={styles.metricValue} variant="headlineMd">{String(value)}</AppText>
    <AppText color={accent === 'green' ? 'successStrong' : accent === 'blue' ? 'brand' : 'secondary'} numberOfLines={1} variant="caption">
      {caption}
    </AppText>
  </AppCard>
);

const DashboardView = ({
  hasError,
  isLoading,
  metrics,
  onAddLead,
  onCompleteFollowUp,
  onOpenLead,
  onRetry,
  onViewFollowUps,
}: DashboardViewProps) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <AppIcon color="inverse" name="briefcase" size={20} />
          </View>
          <View style={styles.brandText}>
            <View style={styles.brandNameRow}>
              <AppText style={styles.brandName} variant="headlineSm">{strings.auth.brand}</AppText>
              <View style={styles.modePill}>
                <View style={styles.modeDot} />
                <AppText color="successStrong" variant="caption">{strings.dashboard.mode}</AppText>
              </View>
            </View>
            <AppText color="secondary" variant="caption">{strings.dashboard.title}</AppText>
          </View>
          <View accessibilityLabel={strings.common.profile} style={styles.profileAvatar}>
            <AppText color="inverse" variant="labelMd">{strings.leads.profileInitials}</AppText>
          </View>
        </View>

        {isLoading ? (
          <View accessibilityRole="progressbar" style={styles.feedback}>
            <ActivityIndicator color={colors.primary.default} size="small" />
            <AppText color="secondary">{strings.dashboard.loading}</AppText>
          </View>
        ) : hasError ? (
          <View accessibilityRole="alert" style={styles.feedback}>
            <AppText color="error">{strings.dashboard.loadError}</AppText>
            <AppButton onPress={onRetry} title={strings.common.retry} variant="secondary" />
          </View>
        ) : metrics ? (
          <>
            <View style={styles.greetingBlock}>
              <AppText style={styles.greeting} variant="headlineLg">{metrics.greeting}</AppText>
              <AppText color="secondary" variant="bodyMd">
                {strings.dashboard.todaySummary.replace('{count}', String(metrics.todayFollowUpCount))}
              </AppText>
            </View>

            <View style={styles.actionEngine}>
              <View style={styles.actionHeading}>
                <AppText color="inverse" variant="labelMd">{strings.dashboard.actionEngine}</AppText>
                <AppIcon color="inverse" name="followUp" size={22} />
              </View>
              <View style={styles.actionCountRow}>
                <AppText color="inverse" style={styles.actionCount} variant="headlineXl">{metrics.todayFollowUpCount}</AppText>
                <AppText color="inverse" variant="bodyMd">{strings.dashboard.followUpsToday}</AppText>
              </View>
              {metrics.nextFollowUp ? (
                <View style={styles.nextUp}>
                  <View style={styles.nextUpDot} />
                  <View style={styles.nextUpCopy}>
                    <AppText color="inverse" variant="caption">
                      {strings.dashboard.nextUp.replace('{time}', metrics.nextFollowUp.dueTime)}
                    </AppText>
                    <AppText color="inverse" numberOfLines={1} variant="labelMd">
                      {metrics.nextFollowUp.leadCompany} · {metrics.nextFollowUp.leadName}
                    </AppText>
                  </View>
                </View>
              ) : (
                <View style={styles.nextUpEmpty}>
                  <AppText color="inverse" variant="bodySm">{strings.dashboard.noFollowUpsToday}</AppText>
                </View>
              )}
              <AppPressable
                accessibilityRole="button"
                onPress={onViewFollowUps}
                pressedStyle={styles.actionButtonPressed}
                style={styles.actionButton}
              >
                <AppIcon color="brand" name="followUp" size={18} />
                <AppText color="brand" variant="labelLg">{strings.dashboard.viewFollowUps}</AppText>
              </AppPressable>
            </View>

            <View style={styles.metricGrid}>
              <MetricCard accent="blue" caption={strings.dashboard.activePipeline} label={strings.dashboard.totalLeads} value={metrics.totalLeads} />
              <MetricCard
                accent="cyan"
                caption={strings.dashboard.qualifiedPipeline.replace('{value}', metrics.qualifiedPipelineValue)}
                label={strings.dashboard.qualified}
                value={metrics.qualifiedLeads}
              />
              <MetricCard accent="green" caption={strings.dashboard.contactedCaption} label={strings.dashboard.contacted} value={metrics.contactedLeads} />
              <MetricCard accent="amber" caption={strings.dashboard.newLeadsCaption} label={strings.dashboard.newLeads} value={metrics.newLeads} />
            </View>

            <AppCard style={styles.pipelineCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <AppIcon color="brand" name="trend" size={17} />
                  <AppText variant="labelLg">{strings.dashboard.pipelineDistribution}</AppText>
                </View>
                <AppText color="secondary" variant="caption">
                  {strings.dashboard.totalLeadsShort.replace('{count}', String(metrics.totalLeads))}
                </AppText>
              </View>
              <View
                accessibilityLabel={strings.dashboard.pipelineDistribution}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: metrics.totalLeads > 0 ? 100 : 0 }}
                style={styles.pipelineBar}
              >
                {metrics.pipelineStages.map((stage) => (
                  <View
                    accessibilityLabel={strings.dashboard.distributionLegend
                      .replace('{label}', stage.label)
                      .replace('{count}', String(stage.count))
                      .replace('{percentage}', String(stage.percentage))}
                    key={stage.stage}
                    style={[styles.pipelineSegment, stageSegmentStyles[stage.stage], getStageSegmentFlex(stage.count)]}
                  />
                ))}
              </View>
              <View style={styles.legendGrid}>
                {metrics.pipelineStages.map((stage) => (
                  <View key={stage.stage} style={styles.legendItem}>
                    <View style={[styles.legendDot, stageSegmentStyles[stage.stage]]} />
                    <AppText color="secondary" numberOfLines={1} variant="caption">
                      {strings.dashboard.distributionLegend
                        .replace('{label}', stage.label)
                        .replace('{count}', String(stage.count))
                        .replace('{percentage}', String(stage.percentage))}
                    </AppText>
                  </View>
                ))}
              </View>
            </AppCard>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <AppText variant="headlineSm">{strings.dashboard.todayPriorityFollowUps}</AppText>
                <View style={styles.countBadge}>
                  <AppText color="error" variant="labelMd">{metrics.todayFollowUpCount}</AppText>
                </View>
              </View>
              <AppPressable accessibilityRole="button" onPress={onViewFollowUps} style={styles.textAction}>
                <AppText color="brand" variant="labelMd">{strings.dashboard.viewAll}</AppText>
              </AppPressable>
            </View>

            {metrics.priorityFollowUps.length === 0 ? (
              <AppCard style={styles.emptyCard}>
                <AppText color="secondary" style={styles.emptyText}>{strings.dashboard.noPriorityFollowUps}</AppText>
              </AppCard>
            ) : metrics.priorityFollowUps.map((followUp) => (
              <AppCard key={followUp.id} style={styles.followUpCard}>
                <View style={styles.followUpHeader}>
                  <View style={styles.leadAvatar}>
                    <AppText color="brand" variant="labelLg">{followUp.leadInitials}</AppText>
                  </View>
                  <View style={styles.followUpIdentity}>
                    <AppText numberOfLines={1} variant="labelLg">{followUp.leadName}</AppText>
                    <AppText color="secondary" numberOfLines={1} variant="bodySm">
                      {followUp.leadTitle} · {followUp.leadCompany}
                    </AppText>
                  </View>
                  {followUp.leadPriorityLabel ? (
                    <View style={[styles.priorityBadge, followUp.leadPriority === 'high' ? styles.highPriorityBadge : styles.otherPriorityBadge]}>
                      <AppText color={followUp.leadPriority === 'high' ? 'error' : 'brand'} variant="caption">
                        {strings.dashboard.leadPriority.replace('{priority}', followUp.leadPriorityLabel)}
                      </AppText>
                    </View>
                  ) : null}
                </View>
                <AppText numberOfLines={1} style={styles.followUpTitle} variant="labelMd">{followUp.title}</AppText>
                <View style={styles.followUpMeta}>
                  <AppText color="secondary" variant="caption">{followUp.dueTime}</AppText>
                  <AppText color="secondary" numberOfLines={1} variant="caption">{followUp.typeLabel}</AppText>
                </View>
                {followUp.completionError ? (
                  <AppText accessibilityRole="alert" color="error" variant="caption">{followUp.completionError}</AppText>
                ) : null}
                <View style={styles.followUpActions}>
                  <AppButton
                    onPress={() => onOpenLead(followUp.leadId)}
                    style={styles.followUpActionButton}
                    title={strings.dashboard.viewLead}
                    variant="secondary"
                  />
                  <AppButton
                    disabled={followUp.isCompleting}
                    loading={followUp.isCompleting}
                    onPress={() => onCompleteFollowUp(followUp.id)}
                    style={styles.followUpActionButton}
                    title={followUp.isCompleting ? strings.dashboard.completing : strings.dashboard.complete}
                    variant="secondary"
                  />
                </View>
              </AppCard>
            ))}

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <AppText variant="headlineSm">{strings.dashboard.recentLeads}</AppText>
                <AppText color="secondary" variant="caption">{strings.dashboard.last24Hours}</AppText>
              </View>
              <AppPressable accessibilityRole="button" onPress={onAddLead} style={styles.textAction}>
                <AppIcon color="brand" name="userPlus" size={15} />
                <AppText color="brand" variant="labelMd">{strings.dashboard.addLead}</AppText>
              </AppPressable>
            </View>

            {metrics.recentLeads.length === 0 ? (
              <AppCard style={styles.emptyCard}>
                <AppText color="secondary" style={styles.emptyText}>{strings.dashboard.noRecentLeads}</AppText>
              </AppCard>
            ) : metrics.recentLeads.map((lead) => (
              <AppPressable
                accessibilityLabel={strings.dashboard.recentLeadAccessibility
                  .replace('{name}', lead.name)
                  .replace('{company}', lead.company)
                  .replace('{value}', lead.value)
                  .replace('{stage}', lead.stageLabel)}
                accessibilityRole="button"
                key={lead.id}
                onPress={() => onOpenLead(lead.id)}
                pressedStyle={styles.recentLeadPressed}
                style={styles.recentLeadCard}
              >
                <View style={styles.leadAvatar}>
                  <AppText color="brand" variant="labelLg">{lead.initials}</AppText>
                </View>
                <View style={styles.recentLeadIdentity}>
                  <View style={styles.recentLeadNameRow}>
                    <AppText numberOfLines={1} style={styles.recentLeadName} variant="labelLg">{lead.name}</AppText>
                    <AppText color="secondary" variant="caption">{lead.createdAgo}</AppText>
                  </View>
                  <AppText color="secondary" numberOfLines={1} variant="bodySm">{lead.company}</AppText>
                </View>
                <View style={styles.recentLeadValue}>
                  <AppText variant="labelLg">{lead.value}</AppText>
                  <AppText color="brand" variant="caption">{lead.stageLabel}</AppText>
                </View>
              </AppPressable>
            ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  </SafeAreaView>
);

export default DashboardView;
