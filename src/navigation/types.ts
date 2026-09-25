import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Leads: undefined;
  FollowUps: undefined;
  More: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  LeadDetails: undefined;
  CreateLead: undefined;
  EditLead: undefined;
  CreateFollowUp: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  App: NavigatorScreenParams<AppStackParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    // React Navigation augments this interface through declaration merging.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
