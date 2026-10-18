import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../../theme';

export type AppIconName =
  | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'arrowForward' | 'face'
  | 'bolt' | 'error' | 'wifiOff' | 'close' | 'check' | 'bell' | 'search'
  | 'filter' | 'sort' | 'plus' | 'building' | 'clock' | 'calendar'
  | 'phone' | 'more' | 'dollar' | 'trend' | 'sync' | 'home'
  | 'briefcase' | 'followUp' | 'chevronDown' | 'userPlus' | 'queue'
  | 'swipe';
export type AppIconColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'success' | 'successStrong' | 'error' | 'info' | 'white';

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
  white: colors.surface.primary,
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
      {name === 'bell' && <><Path {...strokeProps} d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><Path {...strokeProps} d="M10 21h4" /></>}
      {name === 'search' && <><Circle {...strokeProps} cx={10.8} cy={10.8} r={6.8} /><Path {...strokeProps} d="m16 16 5 5" /></>}
      {name === 'filter' && <><Path {...strokeProps} d="M4 6h4m4 0h8M4 12h8m4 0h4M4 18h2m4 0h10" /><Path {...strokeProps} d="M8 4v4m4 2v4m-6 2v4" /></>}
      {name === 'sort' && <><Path {...strokeProps} d="M4 6h16M4 12h11M4 18h6" /></>}
      {name === 'plus' && <Path {...strokeProps} d="M12 5v14m-7-7h14" />}
      {name === 'building' && <><Path {...strokeProps} d="M4 21V4h12v17M16 10h4v11M8 8h2m2 0h1m-5 4h2m2 0h1m-5 4h2m2 0h1m-5 5v-3h3v3" /><Path {...strokeProps} d="M2 21h20" /></>}
      {name === 'clock' && <><Circle {...strokeProps} cx={12} cy={12} r={9} /><Path {...strokeProps} d="M12 7v5l3 2" /></>}
      {name === 'calendar' && <><Path {...strokeProps} d="M4 5h16v16H4zM8 3v4m8-4v4M4 10h16" /><Path {...strokeProps} d="M8 14h.01M12 14h.01M16 14h.01" /></>}
      {name === 'phone' && <Path {...strokeProps} d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 3a15 15 0 0 1-7-7l3-2-3-6Z" />}
      {name === 'more' && <><Circle cx={5} cy={12} r={1.2} fill={strokeColor} /><Circle cx={12} cy={12} r={1.2} fill={strokeColor} /><Circle cx={19} cy={12} r={1.2} fill={strokeColor} /></>}
      {name === 'dollar' && <><Circle {...strokeProps} cx={12} cy={12} r={9} /><Path {...strokeProps} d="M15.5 8.5c-.6-1-1.8-1.5-3.5-1.5-2 0-3.5.9-3.5 2.5s1.5 2.3 3.5 2.5 3.5.9 3.5 2.5-1.5 2.5-3.5 2.5c-1.7 0-2.9-.5-3.5-1.5M12 5v14" /></>}
      {name === 'trend' && <><Path {...strokeProps} d="m4 16 5-5 4 3 7-8" /><Path {...strokeProps} d="M14 6h6v6" /></>}
      {name === 'sync' && <><Path {...strokeProps} d="M20 7V3l-3 3a8 8 0 0 0-13 4m0 7v4l3-3a8 8 0 0 0 13-4" /><Path {...strokeProps} d="M4 10h4m8 4h4" /></>}
      {name === 'home' && <><Path {...strokeProps} d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" /></>}
      {name === 'briefcase' && <><Path {...strokeProps} d="M3 7h18v14H3zM8 7V4h8v3M3 12h18m-10 0v2h2v-2" /></>}
      {name === 'followUp' && <><Path {...strokeProps} d="M4 5h12v15H4zM8 3v4m4-4v4M7 11h6" /><Circle {...strokeProps} cx={18} cy={18} r={4} /><Path {...strokeProps} d="M18 16v2l1.5 1" /></>}
      {name === 'chevronDown' && <Path {...strokeProps} d="m6 9 6 6 6-6" />}
      {name === 'userPlus' && <><Circle {...strokeProps} cx={9} cy={8} r={4} /><Path {...strokeProps} d="M2 21v-2a7 7 0 0 1 14 0v2m4-12v8m-4-4h8" /></>}
      {name === 'queue' && <><Path {...strokeProps} d="M8 5 5 8l3 3m-3-3h10a5 5 0 0 1 5 5v1m-5 5 3-3-3-3m3 3H8a5 5 0 0 1-5-5v-1" /></>}
      {name === 'swipe' && <><Path {...strokeProps} d="M8 11V6a1.5 1.5 0 0 1 3 0v4-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v6l1-1a1.7 1.7 0 0 1 2.5 2l-3 6a4 4 0 0 1-3.6 2H11a4 4 0 0 1-3.4-1.8L4 14a1.7 1.7 0 0 1 2.8-2L8 13" /></>}
    </Svg>
  );
};
