import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppCard, AppCheckbox, AppDivider, AppIcon, AppPressable, AppText, AppTextInput } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import { styles } from './styles';

type LoginError = { title: string; message: string } | null;
type FocusedField = 'email' | 'password' | null;

type LoginViewProps = {
  appVersion: string;
  biometricLabel: string;
  email: string;
  error: LoginError;
  focusedField: FocusedField;
  isLoading: boolean;
  isOffline: boolean;
  onBiometricSignIn: () => void;
  onDismissError: () => void;
  onEmailBlur: () => void;
  onEmailChange: (value: string) => void;
  onEmailFocus: () => void;
  onForgotPassword: () => void;
  onPasswordBlur: () => void;
  onPasswordChange: (value: string) => void;
  onPasswordFocus: () => void;
  onPasswordSubmit: () => void;
  onRememberDeviceChange: (remember: boolean) => void;
  onSubmit: () => void;
  onTogglePassword: () => void;
  password: string;
  passwordVisible: boolean;
  rememberDevice: boolean;
};

const BrandMark = () => (
  <View accessible accessibilityLabel={strings.auth.brand} style={styles.brandMark}>
    <View style={styles.brandLines}>
      <View style={[styles.brandLine, styles.brandLineLong]} />
      <View style={[styles.brandLine, styles.brandLineMedium]} />
      <View style={[styles.brandLine, styles.brandLineShort]} />
    </View>
    <View style={styles.brandPlus}>
      <View style={styles.brandPlusHorizontal} />
      <View style={styles.brandPlusVertical} />
    </View>
    <View style={styles.brandBoltBadge}>
      <AppIcon color="successStrong" name="bolt" size={16} />
    </View>
  </View>
);

const LoginView = ({
  appVersion, biometricLabel, email, error, focusedField, isLoading, isOffline,
  onBiometricSignIn, onDismissError, onEmailBlur, onEmailChange, onEmailFocus,
  onForgotPassword, onPasswordBlur, onPasswordChange, onPasswordFocus,
  onPasswordSubmit, onRememberDeviceChange, onSubmit, onTogglePassword,
  password, passwordVisible, rememberDevice,
}: LoginViewProps) => {
  const passwordInputRef = useRef<TextInput>(null);

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.brandSection}>
              <BrandMark />
              <View style={styles.brandTitleRow}>
                <AppText accessibilityRole="header" color="primary" variant="headlineLg">{strings.auth.brand}</AppText>
                <View style={styles.proBadge}>
                  <AppText color="brand" style={styles.proBadgeText} variant="labelMd">{strings.auth.plan}</AppText>
                </View>
              </View>
              <AppText color="secondary" style={styles.brandSubtitle} variant="bodySm">{strings.auth.subtitle}</AppText>
            </View>

            <AppCard>
              <View style={styles.intro}>
                <AppText accessibilityRole="header" color="primary" variant="headlineMd">{strings.auth.welcome}</AppText>
                <AppText color="secondary" style={styles.description} variant="bodySm">{strings.auth.signInDescription}</AppText>
              </View>

              {isOffline && (
                <View accessibilityLiveRegion="polite" style={styles.offlineNotice}>
                  <View style={styles.offlineMessage}>
                    <AppIcon color="info" name="wifiOff" size={16} />
                    <AppText color="secondary" style={styles.offlineText} variant="caption">{strings.auth.offline.title}</AppText>
                  </View>
                  <AppText color="info" variant="caption">{strings.auth.offline.detail}</AppText>
                </View>
              )}

              {error && (
                <View accessibilityRole="alert" style={styles.errorNotice}>
                  <AppIcon color="error" name="error" size={18} />
                  <View style={styles.errorCopy}>
                    <AppText color="error" variant="labelMd">{error.title}</AppText>
                    <AppText color="error" variant="caption">{error.message}</AppText>
                  </View>
                  <AppPressable
                    accessibilityLabel={strings.auth.closeError}
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={onDismissError}
                    style={styles.dismissErrorButton}
                  >
                    <AppIcon color="error" name="close" size={16} />
                  </AppPressable>
                </View>
              )}

              <View style={styles.form}>
                <AppTextInput
                  accessibilityLabel={strings.auth.emailAccessibility}
                  accessibilityHint={strings.auth.emailPlaceholder}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  focused={focusedField === 'email'}
                  keyboardType="email-address"
                  label={strings.auth.emailLabel}
                  labelAccessory={<AppText color="secondary" variant="caption">{strings.auth.required}</AppText>}
                  leftAccessory={<AppIcon color="secondary" name="mail" size={20} />}
                  onBlur={onEmailBlur}
                  onChangeText={onEmailChange}
                  onFocus={onEmailFocus}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  placeholder={strings.auth.emailPlaceholder}
                  returnKeyType="next"
                  textContentType="emailAddress"
                  value={email}
                />

                <AppTextInput
                  accessibilityLabel={strings.auth.passwordAccessibility}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  focused={focusedField === 'password'}
                  label={strings.auth.passwordLabel}
                  leftAccessory={<AppIcon color="secondary" name="lock" size={20} />}
                  onBlur={onPasswordBlur}
                  onChangeText={onPasswordChange}
                  onFocus={onPasswordFocus}
                  onSubmitEditing={onPasswordSubmit}
                  placeholder={strings.auth.passwordPlaceholder}
                  ref={passwordInputRef}
                  returnKeyType="go"
                  rightAccessory={(
                    <AppPressable
                      accessibilityLabel={passwordVisible ? strings.auth.hidePassword : strings.auth.showPassword}
                      accessibilityRole="button"
                      accessibilityState={{ selected: passwordVisible }}
                      hitSlop={6}
                      onPress={onTogglePassword}
                      style={styles.passwordToggle}
                    >
                      <AppIcon color="secondary" name={passwordVisible ? 'eyeOff' : 'eye'} size={20} />
                    </AppPressable>
                  )}
                  secureTextEntry={!passwordVisible}
                  textContentType="password"
                  value={password}
                />

                <View style={styles.optionsRow}>
                  <AppCheckbox
                    accessibilityLabel={strings.auth.rememberAccessibility}
                    checked={rememberDevice}
                    label={strings.auth.rememberDevice}
                    onChange={onRememberDeviceChange}
                  />
                  <AppPressable
                    accessibilityHint={strings.auth.forgotAccessibility}
                    accessibilityLabel={strings.auth.forgotPassword}
                    accessibilityRole="button"
                    onPress={onForgotPassword}
                    style={styles.forgotButton}
                  >
                    <AppText color="brand" variant="labelLg">{strings.auth.forgotPassword}</AppText>
                  </AppPressable>
                </View>

                <AppButton
                  accessibilityHint={strings.auth.signInAccessibility}
                  accessibilityRole="button"
                  loading={isLoading}
                  onPress={onSubmit}
                  title={isLoading ? strings.auth.authenticating : strings.auth.signIn}
                  trailingIcon={<AppIcon color="inverse" name="arrowForward" size={20} />}
                />
              </View>

              <View style={styles.fastAccessSection}>
                <AppDivider label={strings.auth.fastAccess} />
                <AppPressable
                  accessibilityHint={strings.auth.biometricAccessibility}
                  accessibilityLabel={biometricLabel}
                  accessibilityRole="button"
                  onPress={onBiometricSignIn}
                  pressedStyle={styles.biometricButtonPressed}
                  style={styles.biometricButton}
                >
                  <AppIcon color="brand" name="face" size={22} />
                  <AppText color="brand" variant="labelLg">{biometricLabel}</AppText>
                </AppPressable>
              </View>
            </AppCard>

            <View style={styles.footer}>
              <View style={styles.securityLine}>
                <AppIcon color="successStrong" name="lock" size={16} />
                <AppText color="secondary" style={styles.securityText} variant="bodySm">{strings.auth.securityFooter}</AppText>
              </View>
              <AppText color="muted" variant="caption">{strings.auth.version.replace('{version}', appVersion)}</AppText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginView;
