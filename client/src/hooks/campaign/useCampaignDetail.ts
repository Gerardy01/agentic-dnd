import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CampaignTabEnum, type CampaignTabType } from '@/utils/enums';
import { campaignApi, worldApi, factionApi, classApi, raceApi, npcApi, itemApi, spellApi } from '@/api';
import type { CampaignListReturn, CampaignCountsReturn } from '@/models/campaignInterfaces';
import type { AreaWithDetailsReturn, POIDataReturn } from '@/models/worldInterfaces';
import type { FactionDataReturn } from '@/models/factionInterfaces';
import type { ClassDataReturn } from '@/models/classInterfaces';
import type { RaceDataReturn } from '@/models/raceInterfaces';
import type { NpcWithDetailsReturn } from '@/models/npcInterfaces';
import type { ItemDataReturn } from '@/models/itemInterfaces';
import type { SpellDataReturn } from '@/models/spellInterfaces';

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

const EMPTY_COUNTS: CampaignCountsReturn = {
  areas: 0,
  pois: 0,
  factions: 0,
  classes: 0,
  races: 0,
  npcs: 0,
  items: 0,
  spells: 0,
};

type LoadedTabs = Partial<Record<CampaignTabType, boolean>>;

export default function useCampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<CampaignListReturn | null>(null);
  const [counts, setCounts] = useState<CampaignCountsReturn>(EMPTY_COUNTS);
  const [areas, setAreas] = useState<AreaWithDetailsReturn[]>([]);
  const [factions, setFactions] = useState<FactionDataReturn[]>([]);
  const [classes, setClasses] = useState<ClassDataReturn[]>([]);
  const [races, setRaces] = useState<RaceDataReturn[]>([]);
  const [npcs, setNpcs] = useState<NpcWithDetailsReturn[]>([]);
  const [items, setItems] = useState<ItemDataReturn[]>([]);
  const [spells, setSpells] = useState<SpellDataReturn[]>([]);
  const [loadedTabs, setLoadedTabs] = useState<LoadedTabs>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<CampaignTabType>(CampaignTabEnum.OVERVIEW);
  const [selectedNode, setSelectedNode] = useState<SelectedMapNode | null>(null);
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');

  // Tabs whose request is in flight, so a tab is never fetched twice at once
  const fetchingTabsRef = useRef<Set<CampaignTabType>>(new Set());

  const campaignId = Number(id);

  // Overview data only: the campaign itself and the count of every module
  const fetchCampaignOverview = useCallback(async (showPageLoading: boolean) => {
    if (!campaignId || isNaN(campaignId)) {
      navigate('/campaigns');
      return;
    }

    if (showPageLoading) setLoading(true);
    try {
      const [[campaignErr, campaignData], [countsErr, countsData]] = await Promise.all([
        campaignApi.getCampaignById(campaignId),
        campaignApi.getCampaignCounts(campaignId),
      ]);

      if (campaignErr || !campaignData) {
        navigate('/campaigns');
        return;
      }

      setCampaign(campaignData);
      setCounts(!countsErr && countsData ? countsData : EMPTY_COUNTS);
    } finally {
      setLoading(false);
    }
  }, [campaignId, navigate]);

  // Module data, fetched the first time its tab is opened
  const fetchTabData = useCallback(async (targetTab: CampaignTabType) => {
    if (fetchingTabsRef.current.has(targetTab)) return;
    fetchingTabsRef.current.add(targetTab);

    try {
      switch (targetTab) {
        case CampaignTabEnum.MAP: {
          const [err, data] = await worldApi.getAreas(campaignId);
          const loadedAreas = !err && data ? data : [];
          setAreas(loadedAreas);
          // Auto-select first area if available
          setSelectedNode((current) => current ?? (loadedAreas.length > 0 ? { type: 'area', data: loadedAreas[0] } : null));
          break;
        }
        case CampaignTabEnum.FACTIONS: {
          const [err, data] = await factionApi.getFactions(campaignId);
          setFactions(!err && data ? data : []);
          break;
        }
        case CampaignTabEnum.CLASSES: {
          const [err, data] = await classApi.getClasses(campaignId);
          setClasses(!err && data ? data : []);
          break;
        }
        case CampaignTabEnum.RACES: {
          const [err, data] = await raceApi.getRaces(campaignId);
          setRaces(!err && data ? data : []);
          break;
        }
        case CampaignTabEnum.NPCS: {
          const [err, data] = await npcApi.getNpcs(campaignId);
          setNpcs(!err && data ? data : []);
          break;
        }
        case CampaignTabEnum.ITEMS: {
          const [err, data] = await itemApi.getItems(campaignId);
          setItems(!err && data ? data : []);
          break;
        }
        case CampaignTabEnum.SPELLS: {
          const [err, data] = await spellApi.getSpells(campaignId);
          setSpells(!err && data ? data : []);
          break;
        }
        default:
          return;
      }

      setLoadedTabs((current) => ({ ...current, [targetTab]: true }));
    } finally {
      fetchingTabsRef.current.delete(targetTab);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaignOverview(true);
  }, [fetchCampaignOverview]);

  // Fetch the active tab's module once per campaign
  useEffect(() => {
    if (activeTab === CampaignTabEnum.OVERVIEW || loadedTabs[activeTab]) return;
    fetchTabData(activeTab);
  }, [activeTab, loadedTabs, fetchTabData]);

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

  const handleSelectArea = (area: AreaWithDetailsReturn) => {
    setSelectedNode({ type: 'area', data: area });
  };

  const handleSelectPOI = (poi: POIDataReturn, parentAreaName: string) => {
    setSelectedNode({ type: 'poi', data: poi, parentAreaName });
  };

  const handleBackToCampaigns = () => {
    navigate('/campaigns');
  };

  const handleChangeTab = (targetTab: string) => {
    setActiveTab(targetTab as CampaignTabType);
  };

  const isTabLoaded = (targetTab: string): boolean => {
    return targetTab === CampaignTabEnum.OVERVIEW || !!loadedTabs[targetTab as CampaignTabType];
  };

  // Generation was continued: counts and every already-opened tab are stale
  const refreshCampaignData = useCallback(() => {
    fetchCampaignOverview(false);
    setSelectedNode(null);
    setLoadedTabs({});
  }, [fetchCampaignOverview]);

  return {
    campaign,
    areas,
    factions,
    classes,
    races,
    npcs,
    items,
    spells,
    counts,
    areaTree,
    loading,
    activeTab,
    selectedNode,
    treeSearchQuery,
    setActiveTab,
    handleChangeTab,
    isTabLoaded,
    setSelectedNode,
    setTreeSearchQuery,
    handleSelectArea,
    handleSelectPOI,
    handleBackToCampaigns,
    refreshCampaignData,
  };
}
