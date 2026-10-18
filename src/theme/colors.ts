export const colors = {
  // Brand
  primary: {
    default: '#1E40AF',
    pressed: '#1D4ED8',
    subtle: '#DDE1FF',
    inverse: '#FFFFFF',
  },

  // Informational / utility
  info: {
    default: '#0284C7',
    background: '#DBEAFE',
  },

  // Semantic states
  success: {
    default: '#10B981',
    background: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
  },

  warning: {
    default: '#F59E0B',
    background: '#FFFBEB',
    border: '#FDE68A',
    text: '#B45309',
  },

  error: {
    default: '#EF4444',
    background: '#FEF2F2',
    border: '#FECACA',
    text: '#DC2626',
  },

  // Surfaces
  background: {
    primary: '#F8FAFC',
    elevated: '#F1F5F9',
  },

  surface: {
    primary: '#FFFFFF',
    elevated: '#F1F5F9',
  },

  // Borders
  border: {
    default: '#E2E8F0',
    strong: '#CBD5E1',
  },

  // Typography
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },

  // Pipeline / stage-specific colors
  stage: {
    prospecting: {
      background: '#F0F9FF',
      border: '#BAE6FD',
      text: '#0369A1',
    },

    negotiation: {
      background: '#FFFBEB',
      border: '#FDE68A',
      text: '#B45309',
    },

    closedWon: {
      background: '#ECFDF5',
      border: '#A7F3D0',
      text: '#047857',
    },

    disqualified: {
      background: '#F1F5F9',
      border: '#CBD5E1',
      text: '#475569',
    },
  },

  // Interactive
  interactive: {
    focusRing: 'rgba(30, 64, 175, 0.15)',
    disabledBackground: '#F1F5F9',
    disabledText: '#94A3B8',
  },

  avatar: {
    sky: '#7DD3FC',
  },

  // Scrim / overlays
  overlay: {
    modal: 'rgba(15, 23, 42, 0.24)',
  },
} as const;

export type Colors = typeof colors;
