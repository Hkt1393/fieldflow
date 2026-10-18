import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppCard, AppIcon, AppPressable, AppText, AppTextInput } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { FollowUpCategory, FollowUpGroup, FollowUpTypeFilter } from '../../../features/followUps/useFollowUps';
import { colors } from '../../../theme';
import { styles } from './styles';

type FollowUpsViewProps = {
  category: FollowUpCategory;
  categoryCounts: Record<FollowUpCategory, number>;
  groups: FollowUpGroup[];
  hasActiveFilters: boolean;
  hasAnyRecords: boolean;
  hasError: boolean;
  isLoading: boolean;
  onCall: (phone: string) => void;
  onClearFilters: () => void;
  onEmail: (email: string) => void;
  onMarkComplete: (id: string) => void;
  onOpenActions: (id: string) => void;
  onOpenLead: (id: string) => void;
  onRetry: () => void;
  onSchedule: () => void;
  onSearchChange: (value: string) => void;
  onSelectCategory: (category: FollowUpCategory) => void;
  onSelectType: (filter: FollowUpTypeFilter) => void;
  search: string;
  todayDateLabel: string;
  todayScheduledCount: number;
  typeFilter: FollowUpTypeFilter;
};

const categories: { id: FollowUpCategory; label: string }[] = [
  { id: 'today', label: strings.followUps.today },
  { id: 'upcoming', label: strings.followUps.upcoming },
  { id: 'completed', label: strings.followUps.completedTab },
];

const typeOptions: { id: FollowUpTypeFilter; label: string }[] = [
  { id: 'all', label: strings.followUps.allTypes },
  { id: 'call', label: strings.followUps.type.call },
  { id: 'email', label: strings.followUps.type.email },
  { id: 'meeting', label: strings.followUps.type.meeting },
  { id: 'task', label: strings.followUps.type.task },
];

const FollowUpCard = ({
  item,
  onCall,
  onComplete,
  onEmail,
  onOpenActions,
  onOpenLead,
}: {
  item: FollowUpGroup['items'][number];
  onCall: (phone: string) => void;
  onComplete: (id: string) => void;
  onEmail: (email: string) => void;
  onOpenActions: (id: string) => void;
  onOpenLead: (id: string) => void;
}) => {
  const phone = item.leadPhone;
  const email = item.leadEmail;
  const contextualAction = item.type === 'call' && phone
    ? { label: strings.followUps.call, icon: 'phone' as const, onPress: () => onCall(phone) }
    : item.type === 'email' && email
      ? { label: strings.followUps.email, icon: 'mail' as const, onPress: () => onEmail(email) }
      : !item.leadUnavailable
        ? { label: strings.followUps.viewLead, icon: 'briefcase' as const, onPress: () => onOpenLead(item.leadId) }
        : null;
  return (
    <AppCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <AppText color="brand" variant="labelLg">{item.initials}</AppText>
        </View>
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <AppText numberOfLines={1} style={styles.leadName} variant="headlineSm">{item.leadName}</AppText>
            {item.leadCompany ? <AppText color="muted" variant="caption">·</AppText> : null}
            {item.leadCompany ? <AppText color="secondary" numberOfLines={1} style={styles.company} variant="bodyMd">{item.leadCompany}</AppText> : null}
          </View>
          {item.leadTitle ? <AppText color="secondary" numberOfLines={1} variant="bodySm">{item.leadTitle}</AppText> : null}
        </View>
        {item.leadPriorityLabel ? (
          <View style={[styles.priorityBadge, item.leadPriority === 'high' ? styles.highPriority : styles.otherPriority]}>
            <AppText color={item.leadPriority === 'high' ? 'error' : 'brand'} variant="labelMd">
              {strings.followUps.leadPriority.replace('{priority}', item.leadPriorityLabel)}
            </AppText>
          </View>
        ) : null}
        <AppPressable
          accessibilityLabel={strings.followUps.actionsAccessibility.replace('{name}', item.leadName)}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onOpenActions(item.id)}
          style={styles.moreButton}
        >
          <AppIcon color="secondary" name="more" size={20} />
        </AppPressable>
      </View>

      <View style={styles.dueRow}>
        <AppIcon color="info" name="clock" size={15} />
        <AppText color="info" variant="labelMd">{item.dueTimeLabel}</AppText>
        {item.dueDateLabel !== strings.followUps.today && item.dueDateLabel !== strings.followUps.overdue ? (
          <AppText color="secondary" variant="caption">{item.dueDateLabel}</AppText>
        ) : null}
        <View style={styles.typePill}>
          <AppText color="brand" variant="caption">{item.typeLabel}</AppText>
        </View>
        {item.dueDateLabel === strings.followUps.overdue ? (
          <View style={styles.overdueBadge}>
            <AppText color="error" variant="caption">{strings.followUps.overdue}</AppText>
          </View>
        ) : null}
      </View>

      <AppText numberOfLines={2} style={styles.followUpTitle} variant="labelLg">{item.title}</AppText>
      {item.notes?.trim() ? (
        <View style={styles.notesPanel}>
          <AppIcon color="brand" name="followUp" size={16} />
          <AppText style={styles.notesText} variant="bodyMd">{item.notes}</AppText>
        </View>
      ) : null}

      {item.completionError ? (
        <AppText accessibilityRole="alert" color="error" variant="caption">{item.completionError}</AppText>
      ) : null}

      <View style={styles.actionsRow}>
        {contextualAction ? (
          <AppButton
            leadingIcon={<AppIcon color="inverse" name={contextualAction.icon} size={17} />}
            onPress={contextualAction.onPress}
            style={styles.contextAction}
            title={contextualAction.label}
          />
        ) : null}
        {item.isCompleted ? (
          <View accessibilityLabel={strings.followUps.status.completed} style={styles.completedStatus}>
            <AppIcon color="successStrong" name="check" size={17} />
            <AppText color="successStrong" variant="labelLg">{strings.followUps.status.completed}</AppText>
          </View>
        ) : (
          <AppPressable
            accessibilityHint={strings.followUps.markCompleteHint}
            accessibilityLabel={strings.followUps.markComplete}
            accessibilityRole="button"
            accessibilityState={{ busy: item.isCompleting, disabled: item.isCompleting }}
            disabled={item.isCompleting}
            onPress={() => onComplete(item.id)}
            style={styles.completeButton}
          >
            {item.isCompleting ? <ActivityIndicator color={colors.success.text} size="small" /> : <AppIcon color="successStrong" name="check" size={17} />}
            <AppText color="successStrong" variant="labelLg">
              {item.isCompleting ? strings.followUps.completing : strings.followUps.markComplete}
            </AppText>
          </AppPressable>
        )}
      </View>
    </AppCard>
  );
};

const FollowUpsView = ({
  category,
  categoryCounts,
  groups,
  hasActiveFilters,
  hasAnyRecords,
  hasError,
  isLoading,
  onCall,
  onClearFilters,
  onEmail,
  onMarkComplete,
  onOpenActions,
  onOpenLead,
  onRetry,
  onSchedule,
  onSearchChange,
  onSelectCategory,
  onSelectType,
  search,
  todayDateLabel,
  todayScheduledCount,
  typeFilter,
}: FollowUpsViewProps) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const emptyMessage = hasActiveFilters
    ? strings.followUps.emptyFiltered
    : category === 'today'
      ? strings.followUps.emptyToday
      : category === 'upcoming'
        ? strings.followUps.emptyUpcoming
        : strings.followUps.emptyCompleted;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <AppIcon color="inverse" name="briefcase" size={21} />
          </View>
          <View style={styles.brandCopy}>
            <AppText style={styles.brandName} variant="headlineMd">{strings.auth.brand}</AppText>
            <AppText color="secondary" variant="caption">{strings.leads.tabFollowUps}</AppText>
          </View>
          <View style={styles.localPill}>
            <View style={styles.localDot} />
            <AppText color="successStrong" variant="caption">{strings.followUps.localMode}</AppText>
          </View>
          <View accessibilityLabel={strings.common.profile} style={styles.profileAvatar}>
            <AppText color="inverse" variant="labelMd">{strings.leads.profileInitials}</AppText>
          </View>
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <AppIcon color="brand" name="calendar" size={23} />
          </View>
          <View style={styles.titleCopy}>
            <View style={styles.titleLabelRow}>
              <AppText variant="headlineLg">{strings.followUps.title}</AppText>
              <View style={styles.todayPill}><AppText color="brand" variant="labelMd">{strings.followUps.today}</AppText></View>
            </View>
            <AppText color="secondary" variant="bodyMd">
              {strings.followUps.scheduledSummary
                .replace('{count}', String(todayScheduledCount))
                .replace('{date}', todayDateLabel)}
            </AppText>
          </View>
          <AppButton
            leadingIcon={<AppIcon color="inverse" name="plus" size={17} />}
            onPress={onSchedule}
            style={styles.scheduleButton}
            title={strings.followUps.schedule}
          />
        </View>

        <View accessibilityRole="tablist" style={styles.tabs}>
          {categories.map((tab) => (
            <AppPressable
              accessibilityLabel={strings.followUps.categoryAccessibility
                .replace('{category}', tab.label)
                .replace('{count}', String(categoryCounts[tab.id]))}
              accessibilityRole="tab"
              accessibilityState={{ selected: category === tab.id }}
              key={tab.id}
              onPress={() => onSelectCategory(tab.id)}
              style={[styles.tab, category === tab.id && styles.selectedTab]}
            >
              <AppText color={category === tab.id ? 'inverse' : 'primary'} variant="labelLg">{tab.label}</AppText>
              <View style={[styles.tabCount, category === tab.id && styles.selectedTabCount]}>
                <AppText color={category === tab.id ? 'inverse' : 'brand'} variant="caption">{categoryCounts[tab.id]}</AppText>
              </View>
            </AppPressable>
          ))}
        </View>

        <View style={styles.searchRow}>
          <AppTextInput
            accessibilityLabel={strings.followUps.searchAccessibility}
            autoCapitalize="none"
            leftAccessory={<AppIcon color="secondary" name="search" size={20} />}
            onChangeText={onSearchChange}
            placeholder={strings.followUps.searchPlaceholder}
            returnKeyType="search"
            value={search}
            containerStyle={styles.searchInput}
          />
          <AppPressable
            accessibilityLabel={strings.followUps.filterAccessibility}
            accessibilityRole="button"
            accessibilityState={{ expanded: filtersExpanded, selected: typeFilter !== 'all' }}
            onPress={() => setFiltersExpanded((expanded) => !expanded)}
            style={[styles.filterButton, typeFilter !== 'all' && styles.filterButtonActive]}
          >
            <AppIcon color={typeFilter !== 'all' ? 'brand' : 'primary'} name="filter" size={21} />
            {typeFilter !== 'all' ? <View style={styles.filterDot} /> : null}
          </AppPressable>
        </View>

        {filtersExpanded ? (
          <View style={styles.filterOptions}>
            {typeOptions.map((option) => (
              <AppPressable
                accessibilityRole="button"
                accessibilityState={{ selected: typeFilter === option.id }}
                key={option.id}
                onPress={() => onSelectType(option.id)}
                style={[styles.typeChip, typeFilter === option.id && styles.typeChipSelected]}
              >
                <AppText color={typeFilter === option.id ? 'inverse' : 'secondary'} variant="labelMd">{option.label}</AppText>
              </AppPressable>
            ))}
            {hasActiveFilters ? (
              <AppPressable accessibilityRole="button" onPress={onClearFilters} style={styles.clearFilter}>
                <AppText color="brand" variant="labelMd">{strings.followUps.clearFilters}</AppText>
              </AppPressable>
            ) : null}
          </View>
        ) : null}

        {isLoading ? (
          <View accessibilityRole="progressbar" style={styles.feedback}>
            <ActivityIndicator color={colors.primary.default} size="small" />
            <AppText color="secondary">{strings.followUps.loading}</AppText>
          </View>
        ) : hasError ? (
          <View accessibilityRole="alert" style={styles.feedback}>
            <AppText color="error">{strings.followUps.loadError}</AppText>
            <AppButton onPress={onRetry} title={strings.common.retry} variant="secondary" />
          </View>
        ) : !hasAnyRecords ? (
          <AppCard style={styles.emptyCard}>
            <AppText color="secondary" style={styles.emptyText}>{emptyMessage}</AppText>
            {category === 'today' ? <AppButton onPress={onSchedule} title={strings.followUps.scheduleFirst} style={styles.emptyAction} /> : null}
          </AppCard>
        ) : (
          <View style={styles.groups}>
            {groups.map((group) => (
              <View key={group.id} style={styles.group}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupTitleRow}>
                    <AppIcon color={group.id === 'overdue' ? 'error' : 'brand'} name={group.id === 'morning' ? 'home' : group.id === 'afternoon' ? 'trend' : 'clock'} size={17} />
                    <AppText variant="headlineSm">{group.title}</AppText>
                    <AppText color="secondary" variant="caption">{group.rangeLabel}</AppText>
                  </View>
                  <View style={styles.pendingPill}>
                    <AppText color="secondary" variant="caption">
                      {group.countLabel.replace('{count}', String(group.count))}
                    </AppText>
                  </View>
                </View>
                {group.items.map((item) => (
                  <FollowUpCard
                    item={item}
                    key={item.id}
                    onCall={onCall}
                    onComplete={onMarkComplete}
                    onEmail={onEmail}
                    onOpenActions={onOpenActions}
                    onOpenLead={onOpenLead}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FollowUpsView;
