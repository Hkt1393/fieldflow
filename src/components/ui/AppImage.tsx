import { Image, type ImageProps, type ImageStyle, type StyleProp } from 'react-native';

export type AppImageProps = Omit<ImageProps, 'style'> & {
  borderRadius?: number;
  height: number;
  style?: StyleProp<ImageStyle>;
  width: number;
};

export const AppImage = ({ borderRadius, height, style, width, ...props }: AppImageProps) => (
  <Image {...props} style={[{ width, height, borderRadius }, style]} />
);
