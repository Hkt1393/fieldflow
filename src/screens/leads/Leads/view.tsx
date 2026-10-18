import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppIcon, AppText } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { LeadPriority, LeadStatus, LeadSummary } from '../../../features/leads/types';
import { colors } from '../../../theme';
import { avatarTextTones, avatarTones, priorityTones, statusTones, styles } from './styles';

type LeadsViewProps = {
  leads: LeadSummary[];
  isLoading: boolean;
  hasError: boolean;
  search: string;
  selectedFilterCount: number;
  selectedPriority: LeadPriority | undefined;
  selectedStage: LeadStatus | undefined;
  sortOrder: 'updated' | 'value';
  onAddLead: () => void;
  onChangeSearch: (value: string) => void;
  onOpenLead: (leadId: string) => void;
  onRetry: () => void;
  onToggleQualifiedFilter: () => void;
  onTogglePriorityFilter: () => void;
  onToggleSort: () => void;
};

const statusLabels = {
  qualified: strings.leads.statuses.qualified,
  proposal: strings.leads.statuses.proposal,
  new: strings.leads.statuses.new,
  contacted: strings.leads.statuses.contacted,
} as const;

const LeadsView = ({
  leads,
  isLoading,
  hasError,
  search,
  selectedFilterCount,
  selectedPriority,
  selectedStage,
  sortOrder,
  onAddLead,
  onChangeSearch,
  onOpenLead,
  onRetry,
  onToggleQualifiedFilter,
  onTogglePriorityFilter,
  onToggleSort,
}: LeadsViewProps) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View style={styles.brandHeader}>
      <View style={styles.brandMark}>
        <View style={styles.brandMarkLine} />
        <View style={styles.brandMarkShortLine} />
        <View style={styles.brandMarkDot} />
      </View>
      <View style={styles.brandCopy}>
        <View style={styles.brandTitleRow}>
          <AppText style={styles.brandTitle} variant="headlineSm">{strings.leads.brand}</AppText>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <AppText color="success" variant="labelMd">{strings.leads.sync}</AppText>
          </View>
        </View>
        <AppText color="secondary" style={styles.brandSubtitle} variant="bodySm">{strings.leads.subtitle}</AppText>
      </View>
      <View style={styles.headerIconButton}>
        <AppIcon name="bell" size={23} />
      </View>
      <View accessibilityLabel={strings.common.profile} style={styles.profileAvatar}>
        <AppText color="inverse" style={styles.profileInitials} variant="labelLg">{strings.leads.profileInitials}</AppText>
      </View>
    </View>

    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.offlineBanner}>
        <View style={styles.offlineMessage}>
          <View style={styles.offlineDot} />
          <AppText style={styles.offlineText} variant="labelMd">
            {strings.leads.offlineStatus} · {strings.leads.pendingChanges}
          </AppText>
        </View>
        <View style={styles.queueAction}>
          <AppIcon color="brand" name="sync" size={15} />
          <AppText color="brand" variant="labelMd">{strings.leads.queue}</AppText>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.headingGroup}>
          <AppText style={styles.pageTitle} variant="headlineLg">{strings.leads.title}</AppText>
          <View style={styles.totalBadge}>
            <AppText color="brand" variant="labelMd">142</AppText>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={onAddLead} style={styles.addLeadButton}>
          <AppIcon color="inverse" name="userPlus" size={19} />
          <AppText color="inverse" style={styles.addLeadText} variant="labelLg">{strings.leads.addLead}</AppText>
        </Pressable>
      </View>

      <View style={styles.searchField}>
        <AppIcon color="secondary" name="search" size={20} />
        <TextInput
          accessibilityLabel={strings.leads.searchAccessibility}
          onChangeText={onChangeSearch}
          placeholder={strings.leads.searchPlaceholder}
          placeholderTextColor={colors.text.secondary}
          returnKeyType="search"
          style={styles.searchInput}
          value={search}
        />
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.filterButton}>
          <AppIcon color="brand" name="filter" size={17} />
          <AppText variant="labelLg">{strings.leads.filters}</AppText>
          <View style={styles.filterCount}>
            <AppText color="inverse" variant="labelMd">{selectedFilterCount}</AppText>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={onToggleSort} style={styles.sortButton}>
          <AppIcon color="secondary" name="sort" size={17} />
          <AppText numberOfLines={1} style={styles.sortLabel} variant="labelLg">
            {sortOrder === 'updated' ? strings.leads.recentlyUpdated : strings.leads.highestValue}
          </AppText>
          <AppIcon color="primary" name="chevronDown" size={16} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.chipsRow}
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
      >
        <Pressable
          accessibilityHint={selectedStage === 'qualified' ? strings.common.removeFilter : strings.leads.selectFilter}
          accessibilityLabel={strings.leads.qualifiedFilter}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedStage === 'qualified' }}
          hitSlop={7}
          onPress={onToggleQualifiedFilter}
          style={[
            styles.activeFilterChip,
            selectedStage !== 'qualified' && styles.inactiveFilterChip,
          ]}
        >
          <AppText color={selectedStage === 'qualified' ? 'inverse' : 'brand'} variant="labelMd">
            {strings.leads.qualifiedFilter}
          </AppText>
          <AppIcon color={selectedStage === 'qualified' ? 'inverse' : 'brand'} name={selectedStage === 'qualified' ? 'close' : 'plus'} size={14} />
        </Pressable>
        <Pressable
          accessibilityHint={selectedPriority === 'high' ? strings.common.removeFilter : strings.leads.selectFilter}
          accessibilityLabel={strings.leads.priorityFilter}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedPriority === 'high' }}
          hitSlop={7}
          onPress={onTogglePriorityFilter}
          style={[
            styles.activeFilterChip,
            selectedPriority !== 'high' && styles.inactiveFilterChip,
          ]}
        >
          <AppText color={selectedPriority === 'high' ? 'inverse' : 'brand'} variant="labelMd">
            {strings.leads.priorityFilter}
          </AppText>
          <AppIcon color={selectedPriority === 'high' ? 'inverse' : 'brand'} name={selectedPriority === 'high' ? 'close' : 'plus'} size={14} />
        </Pressable>
        <View style={styles.addFilterButton}>
          <AppIcon color="brand" name="plus" size={15} />
          <AppText color="brand" variant="labelMd">{strings.leads.addFilter}</AppText>
        </View>
      </ScrollView>

      <View style={styles.pipelineCard}>
        <View style={styles.pipelineIcon}>
          <AppIcon color="brand" name="dollar" size={21} />
        </View>
        <View style={styles.pipelineCopy}>
          <AppText color="secondary" style={styles.pipelineLabel} variant="labelMd">{strings.leads.activePipeline}</AppText>
          <AppText style={styles.pipelineValue} variant="headlineMd">{strings.leads.pipelineValue}</AppText>
        </View>
        <View style={styles.growthBadge}>
          <AppIcon color="successStrong" name="trend" size={16} />
          <AppText color="successStrong" variant="labelLg">{strings.leads.growth}</AppText>
        </View>
      </View>

      <View style={styles.listHeading}>
        <AppText style={styles.priorityHeading} variant="labelMd">{strings.leads.priorityFirst}</AppText>
        <AppText color="secondary" variant="labelMd">
          {strings.leads.shownCount.replace('{count}', String(leads.length))}
        </AppText>
      </View>

      {isLoading ? (
        <View accessibilityLiveRegion="polite" style={styles.emptyState}>
          <ActivityIndicator color={colors.primary.default} size="small" />
          <AppText color="secondary" variant="bodyMd">{strings.leads.loading}</AppText>
        </View>
      ) : hasError ? (
        <View accessibilityRole="alert" style={styles.emptyState}>
          <AppText color="secondary" variant="bodyMd">{strings.leads.loadError}</AppText>
          <AppButton onPress={onRetry} title={strings.common.retry} variant="secondary" />
        </View>
      ) : leads.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText color="secondary" variant="bodyMd">
            {selectedStage || selectedPriority
              ? strings.leads.emptyFilters
              : search.trim().length > 0 ? strings.leads.emptySearch : strings.leads.empty}
          </AppText>
        </View>
      ) : leads.map((lead) => (
        <Pressable
          accessibilityRole="button"
          key={lead.id}
          onPress={() => onOpenLead(lead.id)}
          style={styles.leadCard}
        >
          <View style={styles.leadMain}>
            <View style={[styles.leadAvatar, avatarTones[lead.avatar]]}>
              <AppText style={[styles.avatarInitials, avatarTextTones[lead.avatar]]} variant="headlineSm">
                {lead.initials}
              </AppText>
            </View>
            <View style={styles.leadIdentity}>
              <View style={styles.leadNameRow}>
                <AppText numberOfLines={1} style={styles.leadName} variant="headlineSm">{lead.name}</AppText>
                <View style={[styles.priorityDot, priorityTones[lead.status]]} />
              </View>
              <AppText color="secondary" numberOfLines={1} style={styles.leadTitle} variant="bodyMd">{lead.title}</AppText>
              <View style={styles.companyRow}>
                <AppIcon color="info" name="building" size={14} />
                <AppText numberOfLines={1} style={styles.companyName} variant="bodySm">{lead.company}</AppText>
              </View>
            </View>
            <View style={styles.leadValueColumn}>
              <AppText style={styles.leadValue} variant="headlineSm">{lead.value}</AppText>
              <View style={[styles.statusBadge, statusTones[lead.status]]}>
                <AppText style={styles.statusText} variant="labelMd">{statusLabels[lead.status]}</AppText>
              </View>
              <View style={styles.moreButton}>
                <AppIcon color="primary" name="more" size={19} />
              </View>
            </View>
          </View>
          <View style={styles.nextAction}>
            <AppIcon color="brand" name={lead.nextWhen.includes('Today') ? 'clock' : 'calendar'} size={16} />
            <AppText numberOfLines={1} style={styles.nextActionText} variant="labelMd">
              {strings.leads.next.replace('{when}', lead.nextWhen).replace('{reason}', lead.nextReason)}
            </AppText>
            <View style={styles.callButton}>
              <AppIcon color="brand" name="phone" size={17} />
            </View>
          </View>
          <View style={styles.updatedAtRow}>
            <AppIcon color="secondary" name="clock" size={13} />
            <AppText color="secondary" numberOfLines={1} style={styles.updatedAtText} variant="bodySm">
              {strings.leads.details.updatedAt}: {lead.updatedAt}
            </AppText>
          </View>
        </Pressable>
      ))}

      <View style={styles.showingFooter}>
        <AppIcon color="brand" name="swipe" size={17} />
        <AppText numberOfLines={1} style={styles.footerCopy} variant="labelMd">
          {strings.leads.showingLeads
            .replace('{shown}', String(leads.length))
            .replace('{total}', '142')} · {strings.leads.quickActions}
        </AppText>
        <AppText color="brand" variant="labelMd">{strings.leads.viewAll}</AppText>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default LeadsView;
