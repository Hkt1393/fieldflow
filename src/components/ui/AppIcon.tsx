import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../../theme';

export type AppIconName =
  | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'arrowForward' | 'face'
  | 'bolt' | 'error' | 'wifiOff' | 'close' | 'check';
export type AppIconColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'success' | 'successStrong' | 'error' | 'info';

const iconColors: Record<AppIconColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  inverse: colors.text.inverse,
  brand: colors.primary.default,
  success: colors.success.default,
  successStrong: colors.success.text,
  error: colors.error.default,
  info: colors.info.default,
};

export type AppIconProps = {
  color?: AppIconColor;
  name: AppIconName;
  size?: number;
};

export const AppIcon = ({ color = 'primary', name, size = 20 }: AppIconProps) => {
  const strokeColor = iconColors[color];
  const strokeProps = {
    fill: 'none' as const,
    stroke: strokeColor,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
  };

  return (
    <Svg height={size} width={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'mail' && <><Path {...strokeProps} d="M3.5 5.5h17v13h-17z" /><Path {...strokeProps} d="m4 6 8 6 8-6" /></>}
      {name === 'lock' && <><Path {...strokeProps} d="M5 10h14v11H5z" /><Path {...strokeProps} d="M8 10V7a4 4 0 0 1 8 0v3" /><Circle cx={12} cy={15} r={1} fill={strokeColor} /></>}
      {name === 'eye' && <><Path {...strokeProps} d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><Circle {...strokeProps} cx={12} cy={12} r={2.7} /></>}
      {name === 'eyeOff' && <><Path {...strokeProps} d="M3 3l18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.3 0 9.5 6 9.5 6a15 15 0 0 1-3.2 3.8M6.2 6.2A16.5 16.5 0 0 0 2.5 12s3.2 6 9.5 6c.9 0 1.8-.2 2.6-.4" /><Path {...strokeProps} d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>}
      {name === 'arrowForward' && <Path {...strokeProps} d="M4 12h15m-6-6 6 6-6 6" />}
      {name === 'face' && <><Circle {...strokeProps} cx={12} cy={12} r={9} /><Path {...strokeProps} d="M8.5 10h.01M15.5 10h.01M8 14c1 1.5 2.3 2.2 4 2.2s3-.7 4-2.2" /></>}
      {name === 'bolt' && <Path fill={strokeColor} d="M13.2 2.5 5.7 13h5l-.2 8.5 7.8-11.2h-5.1l.8-7.8Z" />}
      {name === 'error' && <><Circle {...strokeProps} cx={12} cy={12} r={9} /><Path {...strokeProps} d="M12 7.5v5m0 3h.01" /></>}
      {name === 'wifiOff' && <Path {...strokeProps} d="m3 3 18 18M8.5 8.5a9 9 0 0 1 11 2.1M5 11a11 11 0 0 0-2 2m7 1a5 5 0 0 1 3.2-.8M9 18l3 3 1.2-1.2" />}
      {name === 'close' && <Path {...strokeProps} d="m6 6 12 12M18 6 6 18" />}
      {name === 'check' && <Path {...strokeProps} d="m4 12 5 5L20 6" />}
    </Svg>
  );
};
