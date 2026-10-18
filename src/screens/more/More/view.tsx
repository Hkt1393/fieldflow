import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import appConfig from '../../../../app.json';

import { AppButton, AppCard, AppIcon, AppPressable, AppText } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { AppIconName } from '../../../components/ui/AppIcon';
import { colors } from '../../../theme';
import { getQualifiedProgressStyle, styles } from './styles';

type MoreMetrics = {
  totalLeads: number;
  qualifiedLeads: number;
  qualifiedPercentage: number;
  todayFollowUps: number;
  qualifiedPipelineValue: string;
};

type MoreAction = 'pipeline' | 'routing' | 'integrations' | 'offline' | 'notifications' | 'theme' | 'help' | 'about';

type MoreViewProps = {
  hasError: boolean;
  isLoading: boolean;
  metrics: MoreMetrics | null;
  onMenuAction: (action: MoreAction) => void;
  onRetry: () => void;
  onSignOut: () => void;
};

type MenuItem = {
  id: MoreAction;
  icon: AppIconName;
  title: string;
  subtitle: string;
  status?: string;
};

const crmItems: MenuItem[] = [
  { id: 'pipeline', icon: 'trend', title: strings.more.pipeline, subtitle: strings.more.pipelineDescription },
  { id: 'routing', icon: 'filter', title: strings.more.routing, subtitle: strings.more.routingDescription, status: strings.more.comingSoon },
  { id: 'integrations', icon: 'building', title: strings.more.integrations, subtitle: strings.more.integrationsDescription, status: strings.more.unavailable },
];

const preferenceItems: MenuItem[] = [
  { id: 'offline', icon: 'wifiOff', title: strings.more.offlineStorage, subtitle: strings.more.offlineDescription, status: strings.more.localBadge },
  { id: 'notifications', icon: 'bell', title: strings.more.notifications, subtitle: strings.more.notificationsDescription, status: strings.more.comingSoon },
  { id: 'theme', icon: 'eye', title: strings.more.theme, subtitle: strings.more.themeDescription, status: strings.more.light },
];

const supportItems: MenuItem[] = [
  { id: 'help', icon: 'followUp', title: strings.more.help, subtitle: strings.more.helpDescription, status: strings.more.comingSoon },
  {
    id: 'about',
    icon: 'error',
    title: strings.more.about,
    subtitle: strings.more.aboutDescription.replace('{version}', appConfig.expo.version),
    status: strings.more.appVersion.replace('{version}', appConfig.expo.version),
  },
];

const MenuSection = ({
  items,
  onMenuAction,
  title,
}: {
  items: MenuItem[];
  onMenuAction: (action: MoreAction) => void;
  title: string;
}) => (
  <View style={styles.section}>
    <AppText color="secondary" style={styles.sectionTitle} variant="labelMd">{title}</AppText>
    <AppCard style={styles.menuCard}>
      {items.map((item, index) => (
        <AppPressable
          accessibilityLabel={strings.more.menuItemAccessibility
            .replace('{title}', item.title)
            .replace('{subtitle}', item.subtitle)
            .replace('{status}', item.status ?? '')}
          accessibilityRole="button"
          key={item.id}
          onPress={() => onMenuAction(item.id)}
          pressedStyle={styles.menuItemPressed}
          style={[styles.menuItem, index === items.length - 1 && styles.menuItemLast]}
        >
          <View style={styles.menuIconBox}>
            <AppIcon color="brand" name={item.icon} size={20} />
          </View>
          <View style={styles.menuCopy}>
            <AppText numberOfLines={1} variant="labelLg">{item.title}</AppText>
            <AppText color="secondary" numberOfLines={1} variant="bodySm">{item.subtitle}</AppText>
          </View>
          {item.status ? (
            <View style={[styles.statusBadge, item.status === strings.more.localBadge && styles.localBadge, item.status === strings.more.light && styles.lightBadge]}>
              <AppText color={item.status === strings.more.localBadge ? 'brand' : 'secondary'} numberOfLines={1} variant="caption">{item.status}</AppText>
            </View>
          ) : null}
          {item.id === 'pipeline' ? <AppIcon color="muted" name="arrowForward" size={18} /> : null}
        </AppPressable>
      ))}
    </AppCard>
  </View>
);

const MoreView = ({ hasError, isLoading, metrics, onMenuAction, onRetry, onSignOut }: MoreViewProps) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.brandMark}><AppIcon color="inverse" name="briefcase" size={21} /></View>
        <View style={styles.brandCopy}>
          <AppText style={styles.brandName} variant="headlineMd">{strings.auth.brand}</AppText>
          <AppText color="secondary" variant="caption">{strings.more.title}</AppText>
        </View>
        <View style={styles.localPill}>
          <View style={styles.localDot} />
          <AppText color="successStrong" variant="caption">{strings.more.localMode}</AppText>
        </View>
        <View accessibilityLabel={strings.more.profileAccessibility.replace('{name}', strings.more.demoName)} style={styles.profileAvatar}>
          <AppText color="inverse" variant="labelLg">{strings.more.demoInitials}</AppText>
        </View>
      </View>

      <AppCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.largeAvatar}>
            <AppText color="brand" variant="headlineMd">{strings.more.demoInitials}</AppText>
          </View>
          <View style={styles.profileCopy}>
            <AppText numberOfLines={1} style={styles.profileName} variant="headlineMd">{strings.more.demoName}</AppText>
            <AppText color="secondary" variant="bodyMd">{strings.more.demoRole}</AppText>
          </View>
          <View style={styles.demoBadge}>
            <AppText color="brand" variant="labelMd">{strings.more.demoBadge}</AppText>
          </View>
        </View>

        <View style={styles.pipelineSummary}>
          <View style={styles.pipelineSummaryHeader}>
            <View style={styles.pipelineSummaryTitle}>
              <AppIcon color="brand" name="trend" size={17} />
              <AppText variant="labelLg">{strings.more.qualifiedPipeline}</AppText>
            </View>
            {metrics ? <AppText color="brand" variant="labelLg">{metrics.qualifiedPercentage}%</AppText> : null}
          </View>
          {isLoading ? (
            <View accessibilityRole="progressbar" style={styles.metricFeedback}>
              <ActivityIndicator color={colors.primary.default} size="small" />
              <AppText color="secondary" variant="caption">{strings.more.summaryLoading}</AppText>
            </View>
          ) : hasError ? (
            <View style={styles.metricFeedback}>
              <AppText accessibilityRole="alert" color="error" variant="caption">{strings.more.summaryError}</AppText>
              <AppButton onPress={onRetry} title={strings.common.retry} variant="secondary" />
            </View>
          ) : metrics ? (
            <>
              <View accessibilityLabel={strings.more.qualifiedLeadsSummary
                .replace('{qualified}', String(metrics.qualifiedLeads))
                .replace('{total}', String(metrics.totalLeads))}
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: 100, now: metrics.qualifiedPercentage }}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, getQualifiedProgressStyle(metrics.qualifiedPercentage)]} />
              </View>
              <AppText color="secondary" variant="bodySm">
                {strings.more.qualifiedLeadsSummary
                  .replace('{qualified}', String(metrics.qualifiedLeads))
                  .replace('{total}', String(metrics.totalLeads))}
              </AppText>
              <AppText color="secondary" variant="caption">
                {strings.more.qualifiedPipelineAmount.replace('{value}', metrics.qualifiedPipelineValue)}
              </AppText>
            </>
          ) : null}
        </View>

        {metrics && !hasError ? (
          <View style={styles.metricRow}>
            <MetricTile label={strings.more.totalLeads} value={metrics.totalLeads} />
            <MetricTile label={strings.more.qualifiedLeads} value={metrics.qualifiedLeads} />
            <MetricTile label={strings.more.todayFollowUps} value={metrics.todayFollowUps} />
          </View>
        ) : null}
      </AppCard>

      <MenuSection items={crmItems} onMenuAction={onMenuAction} title={strings.more.crmPipeline} />
      <MenuSection items={preferenceItems} onMenuAction={onMenuAction} title={strings.more.appPreferences} />
      <MenuSection items={supportItems} onMenuAction={onMenuAction} title={strings.more.supportAbout} />

      <AppPressable
        accessibilityLabel={strings.more.signOutAccessibility}
        accessibilityRole="button"
        onPress={onSignOut}
        pressedStyle={styles.signOutPressed}
        style={styles.signOutCard}
      >
        <View style={styles.signOutIcon}><AppIcon color="error" name="arrowForward" size={20} /></View>
        <View style={styles.signOutCopy}>
          <AppText color="error" variant="labelLg">{strings.more.signOut}</AppText>
          <AppText color="secondary" variant="caption">{strings.more.signOutSubtitle}</AppText>
        </View>
        <AppIcon color="error" name="arrowForward" size={21} />
      </AppPressable>

      <View style={styles.footer}>
        <AppIcon color="secondary" name="briefcase" size={15} />
        <AppText color="secondary" style={styles.footerText} variant="caption">{strings.more.demoFooter}</AppText>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const MetricTile = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.metricTile}>
    <AppText color="brand" style={styles.metricValue} variant="headlineMd">{value}</AppText>
    <AppText color="secondary" numberOfLines={1} variant="caption">{label}</AppText>
  </View>
);

export default MoreView;
