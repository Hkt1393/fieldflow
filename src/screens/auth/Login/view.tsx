import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRef } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { strings } from '../../../constants/strings';
import { colors } from '../../../theme';
import { styles } from './styles';

type IconName =
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eyeOff'
  | 'arrowForward'
  | 'face'
  | 'bolt'
  | 'error'
  | 'wifiOff'
  | 'close'
  | 'check';

type LoginError = {
  title: string;
  message: string;
} | null;

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

type IconProps = {
  color: string;
  name: IconName;
  size: number;
};

const Icon = ({ color, name, size }: IconProps) => {
  const strokeProps = {
    fill: 'none' as const,
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg height={size} width={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'mail' && (
        <>
          <Path {...strokeProps} d="M3.5 5.5h17v13h-17z" />
          <Path {...strokeProps} d="m4 6 8 6 8-6" />
        </>
      )}
      {name === 'lock' && (
        <>
          <Path {...strokeProps} d="M5 10h14v11H5z" />
          <Path {...strokeProps} d="M8 10V7a4 4 0 0 1 8 0v3" />
          <Circle cx={12} cy={15} r={1} fill={color} />
        </>
      )}
      {name === 'eye' && (
        <>
          <Path {...strokeProps} d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" />
          <Circle {...strokeProps} cx={12} cy={12} r={2.7} />
        </>
      )}
      {name === 'eyeOff' && (
        <>
          <Path {...strokeProps} d="M3 3l18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.3 0 9.5 6 9.5 6a15 15 0 0 1-3.2 3.8M6.2 6.2A16.5 16.5 0 0 0 2.5 12s3.2 6 9.5 6c.9 0 1.8-.2 2.6-.4" />
          <Path {...strokeProps} d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
      {name === 'arrowForward' && (
        <Path {...strokeProps} d="M4 12h15m-6-6 6 6-6 6" />
      )}
      {name === 'face' && (
        <>
          <Circle {...strokeProps} cx={12} cy={12} r={9} />
          <Path {...strokeProps} d="M8.5 10h.01M15.5 10h.01M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2" />
        </>
      )}
      {name === 'bolt' && (
        <Path fill={color} d="M13.2 2.5 5.7 13h5l-.2 8.5 7.8-11.2h-5.1l.8-7.8Z" />
      )}
      {name === 'error' && (
        <>
          <Circle {...strokeProps} cx={12} cy={12} r={9} />
          <Path {...strokeProps} d="M12 7.5v5m0 3h.01" />
        </>
      )}
      {name === 'wifiOff' && (
        <>
          <Path {...strokeProps} d="m3 3 18 18M8.5 8.5a9 9 0 0 1 11 2.1M5 11a11 11 0 0 0-2 2m7 1a5 5 0 0 1 3.2-.8M9 18l3 3 1.2-1.2" />
        </>
      )}
      {name === 'close' && <Path {...strokeProps} d="m6 6 12 12M18 6 6 18" />}
      {name === 'check' && <Path {...strokeProps} d="m4 12 5 5L20 6" />}
    </Svg>
  );
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
      <Icon color={colors.success.text} name="bolt" size={16} />
    </View>
  </View>
);

const LoginView = ({
  appVersion,
  biometricLabel,
  email,
  error,
  focusedField,
  isLoading,
  isOffline,
  onBiometricSignIn,
  onDismissError,
  onEmailBlur,
  onEmailChange,
  onEmailFocus,
  onForgotPassword,
  onPasswordBlur,
  onPasswordChange,
  onPasswordFocus,
  onPasswordSubmit,
  onRememberDeviceChange,
  onSubmit,
  onTogglePassword,
  password,
  passwordVisible,
  rememberDevice,
}: LoginViewProps) => {
  const passwordInputRef = useRef<TextInput>(null);

  return (
  <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
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
              <Text accessibilityRole="header" style={styles.brandTitle}>
                {strings.auth.brand}
              </Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{strings.auth.plan}</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>{strings.auth.subtitle}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.intro}>
              <Text accessibilityRole="header" style={styles.heading}>
                {strings.auth.welcome}
              </Text>
              <Text style={styles.description}>
                {strings.auth.signInDescription}
              </Text>
            </View>

            {isOffline && (
              <View
                accessibilityLiveRegion="polite"
                style={styles.offlineNotice}
              >
                <View style={styles.offlineMessage}>
                  <Icon
                    color={colors.info.default}
                    name="wifiOff"
                    size={16}
                  />
                  <Text style={styles.offlineText}>
                    {strings.auth.offline.title}
                  </Text>
                </View>
                <Text style={styles.offlineSyncText}>
                  {strings.auth.offline.detail}
                </Text>
              </View>
            )}

            {error && (
              <View
                accessibilityRole="alert"
                style={styles.errorNotice}
              >
                <Icon color={colors.error.default} name="error" size={18} />
                <View style={styles.errorCopy}>
                  <Text style={styles.errorTitle}>{error.title}</Text>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                </View>
                <Pressable
                  accessibilityLabel={strings.auth.closeError}
                  accessibilityRole="button"
                  onPress={onDismissError}
                  style={styles.dismissErrorButton}
                >
                  <Icon color={colors.error.default} name="close" size={16} />
                </Pressable>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>{strings.auth.emailLabel}</Text>
                  <Text style={styles.requiredLabel}>{strings.auth.required}</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === 'email' && styles.inputContainerFocused,
                  ]}
                >
                  <View importantForAccessibility="no" style={styles.leadingIcon}>
                    <Icon
                      color={colors.text.secondary}
                      name="mail"
                      size={20}
                    />
                  </View>
                  <TextInput
                    accessibilityLabel={strings.auth.emailAccessibility}
                    accessibilityHint={strings.auth.emailPlaceholder}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onBlur={onEmailBlur}
                    onChangeText={onEmailChange}
                    onFocus={onEmailFocus}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    placeholder={strings.auth.emailPlaceholder}
                    placeholderTextColor={colors.text.muted}
                    returnKeyType="next"
                    style={styles.input}
                    textContentType="emailAddress"
                    value={email}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{strings.auth.passwordLabel}</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === 'password' && styles.inputContainerFocused,
                  ]}
                >
                  <View importantForAccessibility="no" style={styles.leadingIcon}>
                    <Icon
                      color={colors.text.secondary}
                      name="lock"
                      size={20}
                    />
                  </View>
                  <TextInput
                    accessibilityLabel={strings.auth.passwordAccessibility}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    ref={passwordInputRef}
                    onBlur={onPasswordBlur}
                    onChangeText={onPasswordChange}
                    onFocus={onPasswordFocus}
                    onSubmitEditing={onPasswordSubmit}
                    placeholder={strings.auth.passwordPlaceholder}
                    placeholderTextColor={colors.text.muted}
                    returnKeyType="go"
                    secureTextEntry={!passwordVisible}
                    style={styles.passwordInput}
                    textContentType="password"
                    value={password}
                  />
                  <Pressable
                    accessibilityLabel={
                      passwordVisible
                        ? strings.auth.hidePassword
                        : strings.auth.showPassword
                    }
                    accessibilityRole="button"
                    accessibilityState={{ selected: passwordVisible }}
                    onPress={onTogglePassword}
                    style={styles.passwordToggle}
                  >
                    <Icon
                      color={colors.text.secondary}
                      name={passwordVisible ? 'eyeOff' : 'eye'}
                      size={20}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.optionsRow}>
                <Pressable
                  accessibilityLabel={strings.auth.rememberAccessibility}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberDevice }}
                  onPress={() => onRememberDeviceChange(!rememberDevice)}
                  style={styles.rememberButton}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberDevice && styles.checkboxChecked,
                    ]}
                  >
                    {rememberDevice && (
                      <Icon
                        color={colors.text.inverse}
                        name="check"
                        size={16}
                      />
                    )}
                  </View>
                  <Text style={styles.rememberText}>
                    {strings.auth.rememberDevice}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityHint={strings.auth.forgotAccessibility}
                  accessibilityLabel={strings.auth.forgotPassword}
                  accessibilityRole="button"
                  onPress={onForgotPassword}
                  style={styles.forgotButton}
                >
                  <Text style={styles.forgotText}>
                    {strings.auth.forgotPassword}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityHint={strings.auth.signInAccessibility}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading, busy: isLoading }}
                disabled={isLoading}
                onPress={onSubmit}
                style={({ pressed }) => [
                  styles.signInButton,
                  pressed && !isLoading && styles.signInButtonPressed,
                  isLoading && styles.signInButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.signInText,
                    isLoading && styles.signInTextDisabled,
                  ]}
                >
                  {isLoading ? strings.auth.authenticating : strings.auth.signIn}
                </Text>
                {isLoading ? (
                  <ActivityIndicator
                    color={colors.primary.default}
                    size="small"
                  />
                ) : (
                  <Icon
                    color={colors.primary.inverse}
                    name="arrowForward"
                    size={20}
                  />
                )}
              </Pressable>
            </View>

            <View style={styles.fastAccessSection}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerLabel}>{strings.auth.fastAccess}</Text>
                <View style={styles.divider} />
              </View>
              <Pressable
                accessibilityHint={strings.auth.biometricAccessibility}
                accessibilityLabel={biometricLabel}
                accessibilityRole="button"
                onPress={onBiometricSignIn}
                style={({ pressed }) => [
                  styles.biometricButton,
                  pressed && styles.biometricButtonPressed,
                ]}
              >
                <Icon color={colors.primary.default} name="face" size={22} />
                <Text style={styles.biometricText}>{biometricLabel}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.securityLine}>
              <Icon color={colors.success.text} name="lock" size={16} />
              <Text style={styles.securityText}>
                {strings.auth.securityFooter}
              </Text>
            </View>
            <Text style={styles.versionText}>
              {strings.auth.version.replace('{version}', appVersion)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
};

export default LoginView;
