const DEFAULT_SCHOOL_COLOR = '#6B5A48';

const SCHOOL_COLOR_MAP: Record<string, string> = {
  abjuration: '#3E6A8A',
  conjuration: '#B7791F',
  divination: '#2F8076',
  enchantment: '#A8336F',
  evocation: '#A33A2E',
  illusion: '#7A4B8F',
  necromancy: '#3F7D4A',
  transmutation: '#8B5E2B',
};

export const getSchoolColor = (school: string | null): string =>
  (school && SCHOOL_COLOR_MAP[school]) || DEFAULT_SCHOOL_COLOR;
