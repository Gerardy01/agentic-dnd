import { Button, Typography, Tabs, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CompassOutlined,
  ReadOutlined,
  TeamOutlined,
  FireOutlined,
  BookOutlined,
  UserOutlined,
  SmileOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import useCampaignDetail from '@/hooks/campaign/useCampaignDetail';
import useDeleteCampaign from '@/hooks/campaign/useDeleteCampaign';
import PageLoading from '@/components/global/PageLoading';
import CampaignStatusBanner from '@/components/campaign/detail/CampaignStatusBanner';
import DeleteCampaignModal from '@/components/campaign/DeleteCampaignModal';
import CampaignOverviewTab from '@/components/campaign/detail/CampaignOverviewTab';
import CampaignMapTab from '@/components/campaign/detail/CampaignMapTab';
import CampaignFactionsTab from '@/components/campaign/detail/CampaignFactionsTab';
import CampaignClassesTab from '@/components/campaign/detail/CampaignClassesTab';
import CampaignRacesTab from '@/components/campaign/detail/CampaignRacesTab';
import CampaignNpcsTab from '@/components/campaign/detail/CampaignNpcsTab';
import CampaignItemsTab from '@/components/campaign/detail/CampaignItemsTab';
import CampaignSpellsTab from '@/components/campaign/detail/CampaignSpellsTab';

const { Title, Text } = Typography;

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
    totalPOIs,
    areaTree,
    loading,
    activeTab,
    selectedNode,
    setActiveTab,
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

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span style={styles.tabLabel}>
          <ReadOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabOverview')}
        </span>
      ),
      children: (
        <CampaignOverviewTab
          campaign={campaign}
          areasCount={areas.length}
          poisCount={totalPOIs}
          factionsCount={factions.length}
          classesCount={classes.length}
          racesCount={races.length}
          npcsCount={npcs.length}
          itemsCount={items.length}
          spellsCount={spells.length}
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
      label: (
        <span style={styles.tabLabel}>
          <CompassOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabMap')}
          <Tag color="orange" style={styles.tabBadge}>
            {areas.length}
          </Tag>
        </span>
      ),
      children: (
        <CampaignMapTab
          areas={areas}
          areaTree={areaTree}
          selectedNode={selectedNode}
          onSelectArea={handleSelectArea}
          onSelectPOI={handleSelectPOI}
        />
      ),
    },
    {
      key: 'factions',
      label: (
        <span style={styles.tabLabel}>
          <TeamOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabFactions')}
          <Tag color="purple" style={styles.tabBadge}>
            {factions.length}
          </Tag>
        </span>
      ),
      children: <CampaignFactionsTab factions={factions} />,
    },
    {
      key: 'classes',
      label: (
        <span style={styles.tabLabel}>
          <BookOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabClasses')}
          <Tag color="cyan" style={styles.tabBadge}>
            {classes.length}
          </Tag>
        </span>
      ),
      children: <CampaignClassesTab classes={classes} />,
    },
    {
      key: 'races',
      label: (
        <span style={styles.tabLabel}>
          <UserOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabRaces')}
          <Tag color="volcano" style={styles.tabBadge}>
            {races.length}
          </Tag>
        </span>
      ),
      children: <CampaignRacesTab races={races} />,
    },
    {
      key: 'npcs',
      label: (
        <span style={styles.tabLabel}>
          <SmileOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabNpcs')}
          <Tag color="blue" style={styles.tabBadge}>
            {npcs.length}
          </Tag>
        </span>
      ),
      children: <CampaignNpcsTab npcs={npcs} />,
    },
    {
      key: 'items',
      label: (
        <span style={styles.tabLabel}>
          <GiftOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabItems')}
          <Tag color="magenta" style={styles.tabBadge}>
            {items.length}
          </Tag>
        </span>
      ),
      children: <CampaignItemsTab items={items} />,
    },
    {
      key: 'spells',
      label: (
        <span style={styles.tabLabel}>
          <ThunderboltOutlined style={styles.tabIcon} />
          {t('campaignDetail.tabSpells')}
          <Tag color="gold" style={styles.tabBadge}>
            {spells.length}
          </Tag>
        </span>
      ),
      children: <CampaignSpellsTab spells={spells} />,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Top Breadcrumb / Back Bar */}
      <div style={styles.topBar}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToCampaigns}
          style={styles.backBtn}
        >
          {t('campaignDetail.backToCampaigns')}
        </Button>
      </div>

      {/* Main Campaign Header Banner */}
      <div style={styles.headerBanner}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBadge}>
            <FireOutlined style={styles.logoIcon} />
          </div>
          <div style={styles.headerTextGroup}>
            <div style={styles.statusRow}>
              <Tag color="orange" style={styles.statusTag}>
                {t('campaigns.statusActive')}
              </Tag>
              <Text style={styles.langText}>
                {campaign.language.toUpperCase()}
              </Text>
            </div>
            <Title level={1} style={styles.campaignName}>
              {campaign.name}
            </Title>
          </div>
        </div>
        <div style={styles.headerRight}>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={openModal}
            style={styles.deleteBtn}
          >
            {t('campaignDetail.delete.button')}
          </Button>
        </div>
      </div>

      {/* Delete Campaign Modal */}
      <DeleteCampaignModal
        isOpen={isModalOpen}
        campaignName={campaign.name}
        confirmName={confirmName}
        isDeleting={isDeleting}
        onConfirmNameChange={setConfirmName}
        onDelete={onDeleteCampaign}
        onCancel={closeModal}
      />

      {/* Campaign Status Banner - shows if campaign generation is incomplete */}
      {campaign.successParameter && (
        <CampaignStatusBanner
          campaignId={campaign.id}
          successParameter={campaign.successParameter}
          onContinuationComplete={refreshCampaignData}
        />
      )}

      {/* Navigation Tabs */}
      <div style={styles.tabsWrapper}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={styles.tabs}
        />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px 32px',
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%',
  },
  topBar: {
    marginBottom: '16px',
  },
  backBtn: {
    color: '#8D98AA',
    padding: '0 8px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    transition: 'color 0.2s',
  },
  headerBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '24px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.95) 0%, rgba(14, 17, 23, 0.98) 100%)',
    border: '1px solid #232936',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  deleteBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    height: '36px',
    borderRadius: '8px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.25) 0%, rgba(194, 155, 56, 0.1) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.6)',
    boxShadow: '0 0 20px rgba(217, 92, 20, 0.3)',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: '28px',
    color: '#D95C14',
    filter: 'drop-shadow(0 0 6px rgba(217, 92, 20, 0.8))',
  },
  headerTextGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  statusTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    letterSpacing: '0.8px',
    borderRadius: '4px',
    padding: '1px 8px',
    textTransform: 'uppercase',
  },
  langText: {
    color: '#707C91',
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
  },
  campaignName: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '26px',
    letterSpacing: '1px',
    lineHeight: 1.2,
  },
  tabsWrapper: {
    background: 'transparent',
  },
  tabs: {
    color: '#8D98AA',
  },
  tabLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '0.5px',
  },
  tabIcon: {
    fontSize: '15px',
  },
  tabBadge: {
    borderRadius: '10px',
    fontSize: '11px',
    padding: '0 6px',
    lineHeight: '16px',
    fontWeight: 600,
  },
};
