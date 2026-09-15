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
} from '@ant-design/icons';
import type { CampaignListReturn } from '@/models/campaignInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignOverviewTabProps {
  campaign: CampaignListReturn;
  areasCount: number;
  poisCount: number;
  factionsCount: number;
  onNavigateToMap: () => void;
  onNavigateToFactions: () => void;
}

export default function CampaignOverviewTab({
  campaign,
  areasCount,
  poisCount,
  factionsCount,
  onNavigateToMap,
  onNavigateToFactions,
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
      <Row gutter={[16, 16]} style={styles.metricsRow}>
        <Col xs={12} sm={6}>
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

        <Col xs={12} sm={6}>
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

        <Col xs={12} sm={6}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(56, 142, 60, 0.15)' }}>
                <TeamOutlined style={{ color: '#4CAF50' }} />
              </div>
              <Text style={styles.statLabel}>{t('campaignDetail.stats.factions')}</Text>
            </div>
            <Title level={2} style={styles.statValue}>
              {factionsCount}
            </Title>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIconWrapper, background: 'rgba(33, 150, 243, 0.15)' }}>
                <GlobalOutlined style={{ color: '#42A5F5' }} />
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
              The AI Dungeon Master has generated the foundation of this world. Step in to begin gameplay, interact with inhabitants, and shape the storyline.
            </Paragraph>

            <Space direction="vertical" style={{ width: '100%' }} size={12}>
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
                style={styles.factionsBtn}
                onClick={onNavigateToFactions}
                block
              >
                {t('campaignDetail.tabFactions')} ({factionsCount} Factions)
              </Button>
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
    padding: '4px 0',
  },
  metricsRow: {
    marginBottom: '20px',
  },
  statCard: {
    background: 'linear-gradient(135deg, #161A22 0%, #12151C 100%)',
    border: '1px solid #28303F',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  statIconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  statLabel: {
    color: '#8D98AA',
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  statValue: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '28px',
    fontWeight: 700,
  },
  statTagWrapper: {
    marginTop: '6px',
  },
  languageTag: {
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    letterSpacing: '1px',
    borderRadius: '4px',
  },
  contentRow: {
    marginTop: '4px',
  },
  sectionCard: {
    background: 'linear-gradient(135deg, #151922 0%, #11141B 100%)',
    border: '1px solid #28303F',
    borderRadius: '14px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
    padding: '4px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: {
    color: '#D95C14',
    fontSize: '18px',
  },
  sectionTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '18px',
    letterSpacing: '0.5px',
  },
  linkButton: {
    color: '#D95C14',
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    padding: 0,
  },
  descriptionBox: {
    background: 'rgba(10, 13, 18, 0.7)',
    border: '1px solid #242B38',
    borderLeft: '4px solid #D95C14',
    borderRadius: '8px',
    padding: '16px 20px',
  },
  narrativeText: {
    color: '#B0BAC9',
    fontSize: '14px',
    lineHeight: 1.8,
    margin: 0,
  },
  promptBox: {
    background: 'rgba(10, 13, 18, 0.7)',
    border: '1px solid #242B38',
    borderLeft: '4px solid #C29B38',
    borderRadius: '8px',
    padding: '16px 20px',
  },
  promptText: {
    color: '#9CA7BA',
    fontSize: '13px',
    lineHeight: 1.7,
    margin: 0,
    fontStyle: 'italic',
  },
  sideCard: {
    background: 'linear-gradient(135deg, #171C25 0%, #12151D 100%)',
    border: '1px solid #2C3545',
    borderRadius: '14px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
  },
  sideTitle: {
    margin: '0 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '17px',
  },
  sideSubtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '20px',
  },
  exploreMapBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    height: '46px',
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.35)',
  },
  factionsBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    height: '46px',
    background: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#374151',
    color: '#EDE6D6',
  },
  inscribedMeta: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #28303F',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metaText: {
    color: '#707C91',
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
  },
};
