import { Dimensions } from 'react-native';

const REFERENCE_WIDTH = 375;
const REFERENCE_HEIGHT = 812;
const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.15;

export const scaleWidth = (size: number): number =>
  (Dimensions.get('window').width / REFERENCE_WIDTH) * size;

export const scaleHeight = (size: number): number =>
  (Dimensions.get('window').height / REFERENCE_HEIGHT) * size;

export const scaleFont = (size: number): number => {
  const factor = Dimensions.get('window').width / REFERENCE_WIDTH;
  return size * Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, factor));
};

export const scaleRadius = (size: number): number => scaleWidth(size);
