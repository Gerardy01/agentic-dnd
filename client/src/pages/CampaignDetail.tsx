import { Button, Typography, Tabs, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftOutlined,
  CompassOutlined,
  ReadOutlined,
  TeamOutlined,
  FireOutlined,
  BookOutlined,
} from '@ant-design/icons';
import useCampaignDetail from '@/hooks/campaign/useCampaignDetail';
import PageLoading from '@/components/global/PageLoading';
import CampaignOverviewTab from '@/components/campaign/detail/CampaignOverviewTab';
import CampaignMapTab from '@/components/campaign/detail/CampaignMapTab';
import CampaignFactionsTab from '@/components/campaign/detail/CampaignFactionsTab';
import CampaignClassesTab from '@/components/campaign/detail/CampaignClassesTab';

const { Title, Paragraph } = Typography;

export default function CampaignDetail() {
  const {
    campaign,
    areas,
    factions,
    classes,
    totalPOIs,
    areaTree,
    loading,
    activeTab,
    selectedNode,
    setActiveTab,
    handleSelectArea,
    handleSelectPOI,
    handleBackToCampaigns,
  } = useCampaignDetail();

  const { t } = useTranslation();

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
          onNavigateToMap={() => setActiveTab('map')}
          onNavigateToFactions={() => setActiveTab('factions')}
          onNavigateToClasses={() => setActiveTab('classes')}
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

      {/* Campaign Detail Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <div style={styles.badgeRow}>
            <Tag color="orange" style={styles.statusTag}>
              <FireOutlined style={{ marginRight: 4 }} />
              {t('campaigns.statusActive')}
            </Tag>
            <Tag color="gold" style={styles.langTag}>
              {campaign.language.toUpperCase()}
            </Tag>
          </div>

          <Title level={1} style={styles.title}>
            {campaign.name}
          </Title>

          {campaign.themePrompt && (
            <Paragraph style={styles.subtitle} ellipsis={{ rows: 2 }}>
              {campaign.themePrompt}
            </Paragraph>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
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
    padding: '4px 0 32px',
  },
  topBar: {
    marginBottom: '14px',
  },
  backBtn: {
    padding: 0,
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  banner: {
    padding: '24px 28px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #171D27 0%, #101319 100%)',
    border: '1px solid #283244',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    marginBottom: '20px',
  },
  bannerContent: {
    maxWidth: '900px',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  statusTag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '2px 8px',
  },
  langTag: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    borderRadius: '4px',
    padding: '2px 8px',
  },
  title: {
    margin: '0 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '28px',
    letterSpacing: '1px',
  },
  subtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
  tabsWrapper: {
    marginTop: '8px',
  },
  tabs: {
    color: '#EDE6D6',
  },
  tabLabel: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  tabIcon: {
    fontSize: '15px',
  },
  tabBadge: {
    marginLeft: '4px',
    fontSize: '10px',
    padding: '0 5px',
    borderRadius: '10px',
  },
};
