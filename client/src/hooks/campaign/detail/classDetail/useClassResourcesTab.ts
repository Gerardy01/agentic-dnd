// interfaces
import type { ClassResourceDataReturn } from '@/models/classInterfaces';

interface UseClassResourcesTabReturn {
  getUnlockLevel: (resource: ClassResourceDataReturn) => number | null;
}

export default function useClassResourcesTab(): UseClassResourcesTabReturn {

  // A resource unlocks at the lowest level whose max value is not 0
  const getUnlockLevel = (resource: ClassResourceDataReturn): number | null => {
    const unlockedLevels = resource.maxPerLevel
      .filter((progression) => progression.value > 0)
      .map((progression) => progression.level);

    return unlockedLevels.length > 0 ? Math.min(...unlockedLevels) : null;
  };

  return { getUnlockLevel };
}
