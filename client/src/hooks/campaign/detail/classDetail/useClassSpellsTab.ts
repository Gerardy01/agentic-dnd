import { useMemo } from 'react';

// hooks
import { useTranslation } from 'react-i18next';

// interfaces
import type { SpellDataReturn } from '@/models/spellInterfaces';

interface SpellLevelGroup {
  level: number;
  spells: SpellDataReturn[];
}

interface UseClassSpellsTabReturn {
  groupedSpells: SpellLevelGroup[];
  getLevelLabel: (level: number) => string;
}

export default function useClassSpellsTab(spells: SpellDataReturn[]): UseClassSpellsTabReturn {

  const { t } = useTranslation();

  const getLevelLabel = (level: number): string =>
    level === 0 ? t('campaignDetail.spells.cantrip') : t('campaignDetail.spells.level', { level });

  // Group spells by level ascending (cantrips first)
  const groupedSpells = useMemo<SpellLevelGroup[]>(() => {
    const spellsByLevel = new Map<number, SpellDataReturn[]>();

    for (const spell of spells) {
      const levelSpells = spellsByLevel.get(spell.level) ?? [];
      levelSpells.push(spell);
      spellsByLevel.set(spell.level, levelSpells);
    }

    return [...spellsByLevel.entries()]
      .sort(([levelA], [levelB]) => levelA - levelB)
      .map(([level, levelSpells]) => ({ level, spells: levelSpells }));
  }, [spells]);

  return { groupedSpells, getLevelLabel };
}
