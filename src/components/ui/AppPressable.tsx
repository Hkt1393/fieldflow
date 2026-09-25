import { Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';

export type AppPressableProps = PressableProps & {
  pressedStyle?: StyleProp<ViewStyle>;
};

export const AppPressable = ({ pressedStyle, style, ...props }: AppPressableProps) => (
  <Pressable
    {...props}
    style={(state: PressableStateCallbackType) => [
      typeof style === 'function' ? style(state) : style,
      state.pressed && pressedStyle,
    ]}
  />
);
