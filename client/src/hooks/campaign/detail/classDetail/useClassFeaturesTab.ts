import { useMemo } from 'react';

// interfaces
import type { ClassFeature } from '@/models/classInterfaces';

interface FeatureLevelGroup {
  level: number;
  features: ClassFeature[];
}

interface UseClassFeaturesTabReturn {
  groupedFeatures: FeatureLevelGroup[];
}

export default function useClassFeaturesTab(features: ClassFeature[]): UseClassFeaturesTabReturn {

  // Group features by level ascending (1 to 20)
  const groupedFeatures = useMemo<FeatureLevelGroup[]>(() => {
    const featuresByLevel = new Map<number, ClassFeature[]>();

    for (const feature of features) {
      const levelFeatures = featuresByLevel.get(feature.level) ?? [];
      levelFeatures.push(feature);
      featuresByLevel.set(feature.level, levelFeatures);
    }

    return [...featuresByLevel.entries()]
      .sort(([levelA], [levelB]) => levelA - levelB)
      .map(([level, levelFeatures]) => ({ level, features: levelFeatures }));
  }, [features]);

  return { groupedFeatures };
}
