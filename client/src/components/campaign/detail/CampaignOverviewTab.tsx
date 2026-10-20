import { Card, Typography, Row, Col, Button, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  TeamOutlined,
  ReadOutlined,
  EnvironmentOutlined,
  FireOutlined,
  CalendarOutlined,
  GlobalOutlined,
  RightOutlined,
  BookOutlined,
  UserOutlined,
  SmileOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import type { CampaignListReturn } from '@/models/campaignInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignOverviewTabProps {
  campaign: CampaignListReturn;
  areasCount: number;
  poisCount: number;
  factionsCount: number;
  classesCount?: number;
  racesCount?: number;
  npcsCount?: number;
  itemsCount?: number;
  onNavigateToMap: () => void;
  onNavigateToFactions: () => void;
  onNavigateToClasses?: () => void;
  onNavigateToRaces?: () => void;
  onNavigateToNpcs?: () => void;
  onNavigateToItems?: () => void;
}

export default function CampaignOverviewTab({
  campaign,
  areasCount,
  poisCount,
  factionsCount,
  classesCount = 0,
  racesCount = 0,
  npcsCount = 0,
  itemsCount = 0,
  onNavigateToMap,
  onNavigateToFactions,
  onNavigateToClasses,
  onNavigateToRaces,
  onNavigateToNpcs,
  onNavigateToItems,
}: CampaignOverviewTabProps) {
  const { t } = useTranslation();

  const formattedDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div style={styles.container}>
      {/* Metrics Row */}
      <Row gutter={[12, 12]} style={styles.metricsRow}>
        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(217, 92, 20, 0.15)' }}>
                <EnvironmentOutlined style={{ color: '#D95C14' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.areas')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {areasCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(194, 155, 56, 0.15)' }}>
                <CompassOutlined style={{ color: '#C29B38' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.pois')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {poisCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(155, 89, 182, 0.15)' }}>
                <TeamOutlined style={{ color: '#9B59B6' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.factions')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {factionsCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(22, 160, 133, 0.15)' }}>
                <BookOutlined style={{ color: '#16A085' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.classes')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {classesCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(230, 126, 34, 0.15)' }}>
                <UserOutlined style={{ color: '#E67E22' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.races')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {racesCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(52, 152, 219, 0.15)' }}>
                <SmileOutlined style={{ color: '#3498DB' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.npcs')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {npcsCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(231, 76, 60, 0.15)' }}>
                <GiftOutlined style={{ color: '#E74C3C' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.items')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {itemsCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(46, 204, 113, 0.15)' }}>
                <GlobalOutlined style={{ color: '#2ECC71' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.language')}</Text>
            </div>
            <div style={styles.statTagWrapper}>
              <Tag color="blue" style={styles.languageTag}>
                {campaign.language.toUpperCase()}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Columns */}
      <Row gutter={[20, 20]} style={styles.contentRow}>
        <Col xs={24} lg={15}>
          {/* World Codex & Geography Description */}
          <Card style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <ReadOutlined style={styles.sectionIcon} />
                <Title level={3} style={styles.sectionTitle}>
                  {t('campaignDetail.worldDescriptionTitle')}
                </Title>
              </div>
              <Button
                type="link"
                icon={<RightOutlined />}
                onClick={onNavigateToMap}
                style={styles.linkButton}
              >
                {t('campaignDetail.tabMap')}
              </Button>
            </div>

            <div style={styles.descriptionBox}>
              <Paragraph style={styles.narrativeText}>
                {campaign.worldDescription ||
                  'The cartographers and chronicles are actively mapping this world. Access the Map tab to view specific areas, POIs, and regional lore.'}
              </Paragraph>
            </div>
          </Card>

          {/* Theme & Vision Card */}
          <Card style={{ ...styles.sectionCard, marginTop: '20px' }}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionTitleRow}>
                <FireOutlined style={styles.sectionIcon} />
                <Title level={3} style={styles.sectionTitle}>
                  {t('campaignDetail.themePromptTitle')}
                </Title>
              </div>
            </div>

            <div style={styles.promptBox}>
              <Paragraph style={styles.promptText}>
                {campaign.themePrompt || 'A personalized bespoke world created for your adventure.'}
              </Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          {/* Quick Actions & Realm Info */}
          <Card style={styles.sideCard}>
            <Title level={4} style={styles.sideTitle}>
              {t('campaignDetail.actions.launchSession')}
            </Title>
            <Paragraph style={styles.sideSubtitle}>
              The AI Dungeon Master has generated the foundation of this world. Explore the roster of classes, lineages, inhabitants, and relics.
            </Paragraph>

            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <Button
                type="primary"
                size="large"
                icon={<CompassOutlined />}
                style={styles.exploreMapBtn}
                onClick={onNavigateToMap}
                block
              >
                {t('campaignDetail.tabMap')} ({areasCount} Areas)
              </Button>

              <Button
                size="large"
                icon={<TeamOutlined />}
                style={styles.navBtn}
                onClick={onNavigateToFactions}
                block
              >
                {t('campaignDetail.tabFactions')} ({factionsCount} Factions)
              </Button>

              {onNavigateToClasses && (
                <Button
                  size="large"
                  icon={<BookOutlined />}
                  style={styles.navBtn}
                  onClick={onNavigateToClasses}
                  block
                >
                  {t('campaignDetail.tabClasses')} ({classesCount} Classes)
                </Button>
              )}

              {onNavigateToRaces && (
                <Button
                  size="large"
                  icon={<UserOutlined />}
                  style={styles.navBtn}
                  onClick={onNavigateToRaces}
                  block
                >
                  {t('campaignDetail.tabRaces')} ({racesCount} Lineages)
                </Button>
              )}

              {onNavigateToNpcs && (
                <Button
                  size="large"
                  icon={<SmileOutlined />}
                  style={styles.navBtn}
                  onClick={onNavigateToNpcs}
                  block
                >
                  {t('campaignDetail.tabNpcs')} ({npcsCount} NPCs)
                </Button>
              )}

              {onNavigateToItems && (
                <Button
                  size="large"
                  icon={<GiftOutlined />}
                  style={styles.navBtn}
                  onClick={onNavigateToItems}
                  block
                >
                  {t('campaignDetail.tabItems')} ({itemsCount} Relics)
                </Button>
              )}
            </Space>

            <div style={styles.inscribedMeta}>
              <CalendarOutlined style={{ color: '#707C91', fontSize: '13px' }} />
              <Text style={styles.metaText}>
                {t('campaignDetail.stats.created')}: {formattedDate}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4px 0 24px',
  },
  metricsRow: {
    marginBottom: '20px',
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.95) 0%, rgba(14, 17, 23, 0.98) 100%)',
    border: '1px solid #232936',
    borderRadius: '12px',
    padding: '4px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  statIconWrapper: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  statLabel: {
    color: '#8D98AA',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statValue: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '22px',
    fontWeight: 700,
  },
  statTagWrapper: {
    marginTop: '4px',
  },
  languageTag: {
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    borderRadius: '4px',
    padding: '2px 8px',
  },
  contentRow: {
    marginTop: '8px',
  },
  sectionCard: {
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.95) 0%, rgba(14, 17, 23, 0.98) 100%)',
    border: '1px solid #232936',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid #1E2430',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: {
    fontSize: '18px',
    color: '#D95C14',
  },
  sectionTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
  linkButton: {
    color: '#D95C14',
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    padding: 0,
  },
  descriptionBox: {
    background: 'rgba(14, 17, 23, 0.6)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #232936',
  },
  narrativeText: {
    color: '#C7D0DE',
    fontSize: '13.5px',
    lineHeight: 1.7,
    margin: 0,
  },
  promptBox: {
    background: 'rgba(14, 17, 23, 0.6)',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #232936',
    borderLeft: '3px solid #D95C14',
  },
  promptText: {
    color: '#D5DCDE',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
    fontStyle: 'italic',
  },
  sideCard: {
    background: 'linear-gradient(135deg, rgba(24, 28, 38, 0.95) 0%, rgba(18, 22, 30, 0.98) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  sideTitle: {
    margin: '0 0 6px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
  },
  sideSubtitle: {
    color: '#8D98AA',
    fontSize: '12px',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  exploreMapBtn: {
    background: 'linear-gradient(135deg, #D95C14 0%, #C29B38 100%)',
    borderColor: '#D95C14',
    color: '#FFFFFF',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '0.5px',
    height: '42px',
  },
  navBtn: {
    background: 'rgba(14, 17, 23, 0.8)',
    borderColor: '#2B3342',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    height: '40px',
  },
  inscribedMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #232936',
  },
  metaText: {
    color: '#707C91',
    fontSize: '11.5px',
    fontFamily: "'Cinzel', serif",
  },
};
