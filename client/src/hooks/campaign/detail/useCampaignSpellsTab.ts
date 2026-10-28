import { useState, useMemo } from 'react';

// hooks
import { useTranslation } from 'react-i18next';

// interfaces
import type { SpellDataReturn } from '@/models/spellInterfaces';

const ALL_FILTER = 'all';

interface FilterOption {
  value: string;
  label: string;
}

interface UseCampaignSpellsTabReturn {
  searchQuery: string;
  levelFilter: string;
  schoolFilter: string;
  classFilter: string;
  levelOptions: FilterOption[];
  schoolOptions: FilterOption[];
  classOptions: FilterOption[];
  filteredSpells: SpellDataReturn[];
  selectedSpell: SpellDataReturn | null;
  setSearchQuery: (query: string) => void;
  setLevelFilter: (level: string) => void;
  setSchoolFilter: (school: string) => void;
  setClassFilter: (classId: string) => void;
  getLevelLabel: (level: number) => string;
  handleSelectSpell: (spell: SpellDataReturn) => void;
  handleCloseSpell: () => void;
}

export default function useCampaignSpellsTab(spells: SpellDataReturn[]): UseCampaignSpellsTabReturn {

  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>(ALL_FILTER);
  const [schoolFilter, setSchoolFilter] = useState<string>(ALL_FILTER);
  const [classFilter, setClassFilter] = useState<string>(ALL_FILTER);
  const [selectedSpell, setSelectedSpell] = useState<SpellDataReturn | null>(null);

  const getLevelLabel = (level: number): string =>
    level === 0 ? t('campaignDetail.spells.cantrip') : t('campaignDetail.spells.level', { level });

  const levelOptions = useMemo<FilterOption[]>(() => {
    const levels = [...new Set(spells.map((spell) => spell.level))].sort((a, b) => a - b);
    return [
      { value: ALL_FILTER, label: t('campaignDetail.spells.allLevels') },
      ...levels.map((level) => ({
        value: String(level),
        label: level === 0 ? t('campaignDetail.spells.cantrip') : t('campaignDetail.spells.level', { level }),
      })),
    ];
  }, [spells, t]);

  const schoolOptions = useMemo<FilterOption[]>(() => {
    const schools = [...new Set(spells.flatMap((spell) => (spell.school ? [spell.school] : [])))].sort();
    return [
      { value: ALL_FILTER, label: t('campaignDetail.spells.allSchools') },
      ...schools.map((school) => ({ value: school, label: school.charAt(0).toUpperCase() + school.slice(1) })),
    ];
  }, [spells, t]);

  const classOptions = useMemo<FilterOption[]>(() => {
    const classNameById = new Map(spells.flatMap((spell) => spell.classes).map((cls) => [cls.id, cls.name]));
    const sortedClasses = [...classNameById.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    return [
      { value: ALL_FILTER, label: t('campaignDetail.spells.allClasses') },
      ...sortedClasses.map(([id, name]) => ({ value: String(id), label: name })),
    ];
  }, [spells, t]);

  const filteredSpells = useMemo<SpellDataReturn[]>(() => {
    const query = searchQuery.trim().toLowerCase();

    return spells.filter((spell) => {
      const matchesSearch =
        !query ||
        spell.name.toLowerCase().includes(query) ||
        (spell.description?.toLowerCase().includes(query) ?? false) ||
        (spell.school?.toLowerCase().includes(query) ?? false) ||
        spell.classes.some((cls) => cls.name.toLowerCase().includes(query));

      const matchesLevel = levelFilter === ALL_FILTER || String(spell.level) === levelFilter;
      const matchesSchool = schoolFilter === ALL_FILTER || spell.school === schoolFilter;
      const matchesClass = classFilter === ALL_FILTER || spell.classes.some((cls) => String(cls.id) === classFilter);

      return matchesSearch && matchesLevel && matchesSchool && matchesClass;
    });
  }, [spells, searchQuery, levelFilter, schoolFilter, classFilter]);

  const handleSelectSpell = (spell: SpellDataReturn): void => {
    setSelectedSpell(spell);
  };

  const handleCloseSpell = (): void => {
    setSelectedSpell(null);
  };

  return {
    searchQuery,
    levelFilter,
    schoolFilter,
    classFilter,
    levelOptions,
    schoolOptions,
    classOptions,
    filteredSpells,
    selectedSpell,
    setSearchQuery,
    setLevelFilter,
    setSchoolFilter,
    setClassFilter,
    getLevelLabel,
    handleSelectSpell,
    handleCloseSpell,
  };
}
