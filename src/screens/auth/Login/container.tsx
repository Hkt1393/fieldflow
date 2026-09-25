import { useState } from 'react';
import { Platform } from 'react-native';

import appConfig from '../../../../app.json';
import { strings } from '../../../constants/strings';
import { useAuthentication } from '../../../navigation/AuthenticationContext';
import LoginView from './view';

type LoginError = 'invalid' | 'biometric' | 'recovery';
type FocusedField = 'email' | 'password' | null;

const errorContent: Record<LoginError, { title: string; message: string }> = {
  invalid: {
    title: strings.auth.errors.invalidTitle,
    message: strings.auth.errors.invalidMessage,
  },
  biometric: {
    title: strings.auth.errors.biometricTitle,
    message: strings.auth.errors.biometricMessage,
  },
  recovery: {
    title: strings.auth.errors.recoveryTitle,
    message: strings.auth.errors.recoveryMessage,
  },
};

const LoginContainer = () => {
  const { onContinue } = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  // Wire to useNetworkStatus when the network hook is introduced.
  const isOffline = false;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError(null);
  };

  const handleSubmit = () => {
    if (isLoading) {
      return;
    }

    setLoginError(null);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValidEmail || password.length === 0) {
      setLoginError('invalid');
      return;
    }

    // Authentication is not connected yet; preserve the app's temporary entry flow.
    setIsLoading(true);
    onContinue();
  };

  const handleBiometricSignIn = () => setLoginError('biometric');
  const handleForgotPassword = () => setLoginError('recovery');
  const handleDismissError = () => setLoginError(null);
  const handleTogglePassword = () => setPasswordVisible((visible) => !visible);

  const error = loginError ? errorContent[loginError] : null;
  const biometricLabel =
    Platform.OS === 'ios' ? strings.auth.faceId : strings.auth.biometrics;

  return (
    <LoginView
      appVersion={appConfig.expo.version}
      biometricLabel={biometricLabel}
      email={email}
      error={error}
      focusedField={focusedField}
      isLoading={isLoading}
      isOffline={isOffline}
      onBiometricSignIn={handleBiometricSignIn}
      onDismissError={handleDismissError}
      onEmailBlur={() => setFocusedField(null)}
      onEmailChange={handleEmailChange}
      onEmailFocus={() => setFocusedField('email')}
      onForgotPassword={handleForgotPassword}
      onPasswordBlur={() => setFocusedField(null)}
      onPasswordChange={handlePasswordChange}
      onPasswordFocus={() => setFocusedField('password')}
      onPasswordSubmit={handleSubmit}
      onRememberDeviceChange={setRememberDevice}
      onSubmit={handleSubmit}
      onTogglePassword={handleTogglePassword}
      password={password}
      passwordVisible={passwordVisible}
      rememberDevice={rememberDevice}
    />
  );
};

export default LoginContainer;
