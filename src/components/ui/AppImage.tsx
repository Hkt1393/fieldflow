import { Image, type ImageProps, type ImageResizeMode, type ImageStyle, type StyleProp } from 'react-native';

export type AppImageProps = Omit<ImageProps, 'accessibilityLabel' | 'resizeMode' | 'style'> & {
  accessibilityLabel: string;
  resizeMode?: ImageResizeMode;
  style?: StyleProp<ImageStyle>;
};

export const AppImage = ({ accessibilityLabel, resizeMode = 'cover', style, ...props }: AppImageProps) => (
  <Image
    {...props}
    accessible
    accessibilityLabel={accessibilityLabel}
    resizeMode={resizeMode}
    style={style}
  />
);
