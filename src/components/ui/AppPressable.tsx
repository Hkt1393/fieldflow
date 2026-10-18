import { Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';

export type AppPressableProps = PressableProps & {
  pressedStyle?: StyleProp<ViewStyle>;
};

export const AppPressable = ({
  accessibilityState,
  disabled = false,
  pressedStyle,
  style,
  ...props
}: AppPressableProps) => (
  <Pressable
    {...props}
    accessibilityState={{
      ...accessibilityState,
      disabled: disabled || accessibilityState?.disabled,
    }}
    disabled={disabled}
    style={(state: PressableStateCallbackType) => [
      typeof style === 'function' ? style(state) : style,
      state.pressed && pressedStyle,
    ]}
  />
);
