import { Button, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CompassOutlined,
  ReadOutlined,
  SafetyOutlined,
  ToolOutlined,
  CrownOutlined,
  UserOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  FireOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import useCampaignDetail from '@/hooks/campaign/useCampaignDetail';
import useDeleteCampaign from '@/hooks/campaign/useDeleteCampaign';
import PageLoading from '@/components/global/PageLoading';
import CampaignStatusBanner from '@/components/campaign/detail/CampaignStatusBanner';
import CampaignTabSkeleton from '@/components/campaign/detail/CampaignTabSkeleton';
import CampaignStatsStrip from '@/components/campaign/detail/CampaignStatsStrip';
import DeleteCampaignModal from '@/components/campaign/DeleteCampaignModal';
import CampaignOverviewTab from '@/components/campaign/detail/CampaignOverviewTab';
import CampaignMapTab from '@/components/campaign/detail/CampaignMapTab';
import CampaignFactionsTab from '@/components/campaign/detail/CampaignFactionsTab';
import CampaignClassesTab from '@/components/campaign/detail/CampaignClassesTab';
import CampaignRacesTab from '@/components/campaign/detail/CampaignRacesTab';
import CampaignNpcsTab from '@/components/campaign/detail/CampaignNpcsTab';
import CampaignItemsTab from '@/components/campaign/detail/CampaignItemsTab';
import CampaignSpellsTab from '@/components/campaign/detail/CampaignSpellsTab';
import { CAMPAIGN_LANGUAGE_NAMES } from '@/constants/selections';
import { palette } from '@/constants/theme';

export default function CampaignDetail() {
  const navigate = useNavigate();
  const {
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
    setActiveTab,
    handleChangeTab,
    isTabLoaded,
    handleSelectArea,
    handleSelectPOI,
    handleBackToCampaigns,
    refreshCampaignData,
  } = useCampaignDetail();

  const {
    isModalOpen,
    confirmName,
    isDeleting,
    setConfirmName,
    openModal,
    closeModal,
    handleDelete,
  } = useDeleteCampaign();

  const { t } = useTranslation();

  const onDeleteCampaign = async () => {
    if (!campaign) return;
    
    const success = await handleDelete(campaign.id, campaign.name, () => {
      navigate('/campaigns');
    });

    if (!success) {
      // Error is already shown by the hook
    }
  };

  if (loading || !campaign) {
    return <PageLoading />;
  }

  const languageName = CAMPAIGN_LANGUAGE_NAMES[campaign.language] ?? campaign.language.toUpperCase();

  const stats = [
    { key: 'areas', label: t('campaignDetail.stats.areas'), value: counts.areas },
    { key: 'pois', label: t('campaignDetail.stats.pois'), value: counts.pois },
    { key: 'factions', label: t('campaignDetail.stats.factions'), value: counts.factions },
    { key: 'classes', label: t('campaignDetail.stats.classes'), value: counts.classes },
    { key: 'races', label: t('campaignDetail.stats.races'), value: counts.races },
    { key: 'npcs', label: t('campaignDetail.stats.npcs'), value: counts.npcs },
    { key: 'items', label: t('campaignDetail.stats.items'), value: counts.items },
    { key: 'spells', label: t('campaignDetail.stats.spells'), value: counts.spells },
  ];

  const tabLabel = (icon: React.ReactNode, label: string, count?: number) => (
    <span style={styles.tabLabel}>
      <span className="tab-icon">{icon}</span>
      {label}
      {count !== undefined && <span className="tab-count">{count}</span>}
    </span>
  );

  const withTabLoading = (
    tabKey: string,
    skeletonVariant: 'cards' | 'map',
    content: React.ReactNode
  ): React.ReactNode =>
    isTabLoaded(tabKey) ? content : <CampaignTabSkeleton variant={skeletonVariant} />;

  const tabItems = [
    {
      key: 'overview',
      label: tabLabel(<ReadOutlined />, t('campaignDetail.tabOverview')),
      children: (
        <CampaignOverviewTab
          campaign={campaign}
          areasCount={counts.areas}
          poisCount={counts.pois}
          factionsCount={counts.factions}
          classesCount={counts.classes}
          racesCount={counts.races}
          npcsCount={counts.npcs}
          itemsCount={counts.items}
          spellsCount={counts.spells}
          onNavigateToMap={() => setActiveTab('map')}
          onNavigateToFactions={() => setActiveTab('factions')}
          onNavigateToClasses={() => setActiveTab('classes')}
          onNavigateToRaces={() => setActiveTab('races')}
          onNavigateToNpcs={() => setActiveTab('npcs')}
          onNavigateToItems={() => setActiveTab('items')}
          onNavigateToSpells={() => setActiveTab('spells')}
        />
      ),
    },
    {
      key: 'map',
      label: tabLabel(<CompassOutlined />, t('campaignDetail.tabMap'), counts.areas),
      children: withTabLoading('map', 'map', (
        <CampaignMapTab
          areas={areas}
          areaTree={areaTree}
          selectedNode={selectedNode}
          onSelectArea={handleSelectArea}
          onSelectPOI={handleSelectPOI}
        />
      )),
    },
    {
      key: 'factions',
      label: tabLabel(<SafetyOutlined />, t('campaignDetail.tabFactions'), counts.factions),
      children: withTabLoading('factions', 'cards', <CampaignFactionsTab factions={factions} />),
    },
    {
      key: 'classes',
      label: tabLabel(<ToolOutlined />, t('campaignDetail.tabClasses'), counts.classes),
      children: withTabLoading('classes', 'cards', <CampaignClassesTab classes={classes} />),
    },
    {
      key: 'races',
      label: tabLabel(<CrownOutlined />, t('campaignDetail.tabRaces'), counts.races),
      children: withTabLoading('races', 'cards', <CampaignRacesTab races={races} />),
    },
    {
      key: 'npcs',
      label: tabLabel(<UserOutlined />, t('campaignDetail.tabNpcs'), counts.npcs),
      children: withTabLoading('npcs', 'cards', <CampaignNpcsTab npcs={npcs} />),
    },
    {
      key: 'items',
      label: tabLabel(<GiftOutlined />, t('campaignDetail.tabItems'), counts.items),
      children: withTabLoading('items', 'cards', <CampaignItemsTab items={items} />),
    },
    {
      key: 'spells',
      label: tabLabel(<ThunderboltOutlined />, t('campaignDetail.tabSpells'), counts.spells),
      children: withTabLoading('spells', 'cards', <CampaignSpellsTab spells={spells} />),
    },
  ];

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBackToCampaigns}
        style={styles.backBtn}
      >
        {t('campaignDetail.backToCampaigns')}
      </Button>

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBadge}>
            <FireOutlined style={styles.logoIcon} />
          </div>
          <div style={styles.headerText}>
            <div style={styles.badgeRow}>
              <span className="pill pill-success">
                <span className="pill-dot" />
                {t('campaigns.statusActive')}
              </span>
              <span className="pill">
                {t('campaignDetail.narratedIn', { language: languageName })}
              </span>
            </div>
            <h1 style={styles.campaignName}>{campaign.name}</h1>
            {campaign.worldDescription && (
              <p style={styles.campaignBlurb}>{campaign.worldDescription}</p>
            )}
          </div>
        </div>

        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={openModal}
          style={styles.deleteBtn}
        >
          {t('campaignDetail.delete.button')}
        </Button>
      </header>

      <DeleteCampaignModal
        isOpen={isModalOpen}
        campaignName={campaign.name}
        confirmName={confirmName}
        isDeleting={isDeleting}
        onConfirmNameChange={setConfirmName}
        onDelete={onDeleteCampaign}
        onCancel={closeModal}
      />

      {/* Shown if campaign generation is incomplete */}
      {campaign.successParameter && (
        <CampaignStatusBanner
          campaignId={campaign.id}
          successParameter={campaign.successParameter}
          onContinuationComplete={refreshCampaignData}
        />
      )}

      <CampaignStatsStrip stats={stats} />

      <div style={styles.tabsCard}>
        <Tabs
          activeKey={activeTab}
          onChange={handleChangeTab}
          items={tabItems}
          className="campaign-tabs"
        />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backBtn: {
    color: palette.inkMuted,
    padding: '0 8px',
    marginLeft: '-8px',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '32px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    flex: 1,
    minWidth: '300px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '22px',
    background: palette.crimson,
    boxShadow: '0 8px 20px rgba(114, 43, 43, 0.3)',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: '36px',
    color: '#F4EBD3',
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    maxWidth: '820px',
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '8px',
  },
  campaignName: {
    margin: 0,
    color: palette.ink,
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 5vw, 56px)',
    fontWeight: 700,
    lineHeight: 1.05,
  },
  campaignBlurb: {
    marginTop: '12px',
    color: palette.inkMuted,
    fontSize: '17px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  deleteBtn: {
    fontWeight: 600,
  },
  tabsCard: {
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: '24px',
    padding: '0 8px 8px',
    overflow: 'hidden',
  },
  tabLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
  },
};
