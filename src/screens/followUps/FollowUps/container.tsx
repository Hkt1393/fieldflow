import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import { ROUTES } from '../../../constants/routes';
import { strings } from '../../../constants/strings';
import { useFollowUps } from '../../../features/followUps/useFollowUps';
import FollowUpsView from './view';

const FollowUpsContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'FollowUps'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
  const {
    category,
    categoryCounts,
    clearFilters,
    groups,
    hasActiveFilters,
    hasAnyRecords,
    hasError,
    isLoading,
    markCompleted,
    retry,
    search,
    setCategory,
    setSearch,
    setTypeFilter,
    todayDateLabel,
    todayScheduledCount,
    typeFilter,
  } = useFollowUps();

  const openPhone = async (phone: string) => {
    const normalizedPhone = phone.trim();
    const digitCount = normalizedPhone.replace(/\D/g, '').length;
    if (!/^\+?[\d\s().-]+$/.test(normalizedPhone) || digitCount < 7 || digitCount > 15) return;
    try {
      await Linking.openURL(`tel:${normalizedPhone.replace(/[^+\d]/g, '')}`);
    } catch {
      Alert.alert(strings.followUps.contactUnavailableTitle, strings.followUps.callUnavailable);
    }
  };

  const openEmail = async (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    try {
      await Linking.openURL(`mailto:${encodeURIComponent(email.trim())}`);
    } catch {
      Alert.alert(strings.followUps.contactUnavailableTitle, strings.followUps.emailUnavailable);
    }
  };

  const showActions = (followUpId: string) => Alert.alert(
    strings.followUps.actionsTitle,
    undefined,
    [
      { text: strings.followUps.edit.action, onPress: () => navigation.navigate(ROUTES.EditFollowUp, { followUpId }) },
      { text: strings.common.cancel, style: 'cancel' },
    ],
  );

  return (
    <FollowUpsView
      category={category}
      categoryCounts={categoryCounts}
      groups={groups}
      hasActiveFilters={hasActiveFilters}
      hasError={hasError}
      hasAnyRecords={hasAnyRecords}
      isLoading={isLoading}
      onCall={openPhone}
      onClearFilters={clearFilters}
      onMarkComplete={markCompleted}
      onOpenActions={showActions}
      onOpenLead={(leadId) => navigation.navigate(ROUTES.LeadDetails, { leadId })}
      onRetry={retry}
      onSchedule={() => navigation.navigate(ROUTES.CreateFollowUp)}
      onSearchChange={setSearch}
      onSelectCategory={setCategory}
      onSelectType={setTypeFilter}
      onEmail={openEmail}
      search={search}
      todayDateLabel={todayDateLabel}
      todayScheduledCount={todayScheduledCount}
      typeFilter={typeFilter}
    />
  );
};

export default FollowUpsContainer;
