import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignApi, worldApi, factionApi, classApi } from '@/api';
import type { CampaignListReturn } from '@/models/campaignInterfaces';
import type { AreaWithDetailsReturn, POIDataReturn } from '@/models/worldInterfaces';
import type { FactionDataReturn } from '@/models/factionInterfaces';
import type { ClassDataReturn } from '@/models/classInterfaces';

export type SelectedMapNode =
  | { type: 'area'; data: AreaWithDetailsReturn }
  | { type: 'poi'; data: POIDataReturn; parentAreaName: string };

export interface AreaTreeNode {
  key: string;
  title: string;
  levelType: string;
  areaId: number;
  poiCount: number;
  children: AreaTreeNode[];
  pois: POIDataReturn[];
  rawArea: AreaWithDetailsReturn;
}

export default function useCampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<CampaignListReturn | null>(null);
  const [areas, setAreas] = useState<AreaWithDetailsReturn[]>([]);
  const [factions, setFactions] = useState<FactionDataReturn[]>([]);
  const [classes, setClasses] = useState<ClassDataReturn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedNode, setSelectedNode] = useState<SelectedMapNode | null>(null);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');

  const campaignId = Number(id);

  const fetchCampaignData = useCallback(async () => {
    if (!campaignId || isNaN(campaignId)) {
      navigate('/campaigns');
      return;
    }

    setLoading(true);
    try {
      const [
        [campaignErr, campaignData],
        [areasErr, areasData],
        [factionsErr, factionsData],
        [classesErr, classesData],
      ] = await Promise.all([
        campaignApi.getCampaignById(campaignId),
        worldApi.getAreas(campaignId),
        factionApi.getFactions(campaignId),
        classApi.getClasses(campaignId),
      ]);

      if (campaignErr || !campaignData) {
        navigate('/campaigns');
        return;
      }

      setCampaign(campaignData);

      const loadedAreas = !areasErr && areasData ? areasData : [];
      setAreas(loadedAreas);

      const loadedFactions = !factionsErr && factionsData ? factionsData : [];
      setFactions(loadedFactions);

      const loadedClasses = !classesErr && classesData ? classesData : [];
      setClasses(loadedClasses);

      // Auto-select first area if available
      if (loadedAreas.length > 0) {
        setSelectedNode({ type: 'area', data: loadedAreas[0] });
      }
    } finally {
      setLoading(false);
    }
  }, [campaignId, navigate]);

  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  // Build hierarchical area tree
  const areaTree = useMemo(() => {
    const areaMap = new Map<number, AreaTreeNode>();
    const rootNodes: AreaTreeNode[] = [];

    // Create node objects
    for (const area of areas) {
      areaMap.set(area.id, {
        key: `area-${area.id}`,
        title: area.name,
        levelType: area.levelType,
        areaId: area.id,
        poiCount: area.pois ? area.pois.length : 0,
        children: [],
        pois: area.pois || [],
        rawArea: area,
      });
    }

    // Connect parents and children
    for (const area of areas) {
      const node = areaMap.get(area.id);
      if (!node) continue;

      if (area.parentAreaId && areaMap.has(area.parentAreaId)) {
        areaMap.get(area.parentAreaId)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }, [areas]);

  // Total POIs count calculation
  const totalPOIs = useMemo(() => {
    return areas.reduce((acc, area) => acc + (area.pois ? area.pois.length : 0), 0);
  }, [areas]);

  const handleSelectArea = (area: AreaWithDetailsReturn) => {
    setSelectedNode({ type: 'area', data: area });
  };

  const handleSelectPOI = (poi: POIDataReturn, parentAreaName: string) => {
    setSelectedNode({ type: 'poi', data: poi, parentAreaName });
  };

  const handleBackToCampaigns = () => {
    navigate('/campaigns');
  };

  return {
    campaign,
    areas,
    factions,
    classes,
    totalPOIs,
    areaTree,
    loading,
    activeTab,
    selectedNode,
    treeSearchQuery,
    setActiveTab,
    setSelectedNode,
    setTreeSearchQuery,
    handleSelectArea,
    handleSelectPOI,
    handleBackToCampaigns,
  };
}
