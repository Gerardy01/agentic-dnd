import { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Progress, Input, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  TeamOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { FactionDataReturn } from '@/models/factionInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignFactionsTabProps {
  factions: FactionDataReturn[];
}

export default function CampaignFactionsTab({ factions }: CampaignFactionsTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFactions = useMemo(() => {
    if (!searchQuery.trim()) return factions;
    const q = searchQuery.toLowerCase();
    return factions.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        f.reputation.toLowerCase().includes(q)
    );
  }, [factions, searchQuery]);

  const getReputationColor = (reputation: string) => {
    const rep = reputation.toLowerCase();
    if (rep.includes('hostile') || rep.includes('enemy')) return 'red';
    if (rep.includes('friendly') || rep.includes('allied')) return 'green';
    if (rep.includes('revered') || rep.includes('honored')) return 'gold';
    return 'blue';
  };

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <TeamOutlined style={{ marginRight: 8, color: '#D95C14' }} />
            {t('campaignDetail.factions.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.factions.subtitle')}
          </Paragraph>
        </div>

        <Input
          prefix={<SearchOutlined style={{ color: '#707C91' }} />}
          placeholder={t('campaignDetail.factions.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          style={styles.searchInput}
        />
      </div>

      {/* Faction Cards Grid */}
      {filteredFactions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredFactions.map((faction) => (
            <Col xs={24} sm={12} lg={8} key={faction.id}>
              <Card style={styles.factionCard} hoverable>
                {/* Top Name & Badge */}
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrap}>
                    <SafetyCertificateOutlined style={styles.cardIcon} />
                  </div>
                  <div style={styles.headerInfo}>
                    <Title level={4} style={styles.factionName} ellipsis={{ rows: 1 }}>
                      {faction.name}
                    </Title>
                    <Tag
                      color={getReputationColor(faction.reputation)}
                      style={styles.reputationTag}
                    >
                      {faction.reputation.toUpperCase()}
                    </Tag>
                  </div>
                </div>

                {/* Influence Meter */}
                <div style={styles.influenceSection}>
                  <div style={styles.influenceLabelRow}>
                    <Text style={styles.influenceLabel}>
                      <ThunderboltOutlined style={{ marginRight: 4, color: '#C29B38' }} />
                      {t('campaignDetail.factions.influenceLabel')}
                    </Text>
                    <Text style={styles.influenceValue}>{faction.influence}%</Text>
                  </div>
                  <Progress
                    percent={faction.influence}
                    showInfo={false}
                    strokeColor={{
                      '0%': '#C29B38',
                      '100%': '#D95C14',
                    }}
                    trailColor="#222834"
                    size="small"
                  />
                </div>

                {/* Description */}
                <div style={styles.descSection}>
                  <Paragraph
                    style={styles.descText}
                    ellipsis={{ rows: 4, expandable: true, symbol: 'more' }}
                  >
                    {faction.description || 'A mysterious faction whose true motives remain veiled.'}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={styles.emptyCard}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div style={styles.emptyWrap}>
                <Title level={4} style={styles.emptyTitle}>
                  {t('campaignDetail.factions.emptyTitle')}
                </Title>
                <Text style={styles.emptySubtitle}>
                  {t('campaignDetail.factions.emptySubtitle')}
                </Text>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  headerText: {
    flex: 1,
    minWidth: '260px',
  },
  title: {
    margin: '0 0 4px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '20px',
    letterSpacing: '0.5px',
  },
  subtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    margin: 0,
  },
  searchInput: {
    width: '260px',
    background: 'rgba(10, 13, 18, 0.8)',
    borderColor: '#2D3748',
    borderRadius: '6px',
    color: '#EDE6D6',
  },
  factionCard: {
    background: 'linear-gradient(135deg, #161A23 0%, #11141B 100%)',
    border: '1px solid #28303F',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px',
  },
  iconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(217, 92, 20, 0.12)',
    border: '1px solid rgba(217, 92, 20, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '20px',
    color: '#D95C14',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  factionName: {
    margin: '0 0 4px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '16px',
  },
  reputationTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    padding: '1px 6px',
  },
  influenceSection: {
    background: 'rgba(10, 13, 18, 0.6)',
    border: '1px solid #222834',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '14px',
  },
  influenceLabelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  influenceLabel: {
    color: '#8D98AA',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    textTransform: 'uppercase',
  },
  influenceValue: {
    color: '#EDE6D6',
    fontWeight: 700,
    fontSize: '12px',
  },
  descSection: {
    flex: 1,
  },
  descText: {
    color: '#B0BAC9',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
  emptyCard: {
    background: 'linear-gradient(135deg, #151922 0%, #11141B 100%)',
    border: '1px solid #28303F',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
  },
  emptyWrap: {
    marginTop: '12px',
  },
  emptyTitle: {
    margin: '0 0 6px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
  },
  emptySubtitle: {
    color: '#8D98AA',
    fontSize: '13px',
  },
};
