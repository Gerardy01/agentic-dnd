import { Typography, Tag, Card, Row, Col, Space, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  EnvironmentOutlined,
  CompassOutlined,
  TeamOutlined,
  BookOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { AreaWithDetailsReturn, POIDataReturn } from '@/models/worldInterfaces';

const { Title, Text, Paragraph } = Typography;

interface AreaDetailViewProps {
  area: AreaWithDetailsReturn;
  onSelectPOI: (poi: POIDataReturn) => void;
}

export default function AreaDetailView({ area, onSelectPOI }: AreaDetailViewProps) {
  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      {/* Area Header */}
      <div style={styles.header}>
        <div style={styles.badgeRow}>
          <Tag color="orange" style={styles.levelTag}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {area.levelType.toUpperCase()}
          </Tag>
          <Tag color="default" style={styles.depthTag}>
            Depth {area.depth}
          </Tag>
        </div>
        <Title level={2} style={styles.title}>
          {area.name}
        </Title>
        {area.descriptiveLocation && (
          <Text style={styles.locationSubtitle}>
            <CompassOutlined style={{ marginRight: 6, color: '#8B5E2B' }} />
            {area.descriptiveLocation}
          </Text>
        )}
      </div>

      {/* Descriptive Overview / Description */}
      {(area.descriptiveOverview || area.description) && (
        <Card style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <InfoCircleOutlined style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>{t('campaignDetail.map.overview')}</Text>
          </div>
          <Paragraph style={styles.bodyText}>
            {area.descriptiveOverview || area.description}
          </Paragraph>
        </Card>
      )}

      {/* Lore Section (if generated for this area) */}
      {area.lore && (
        <Card style={styles.loreCard}>
          <div style={styles.loreHeader}>
            <BookOutlined style={styles.loreIcon} />
            <div style={styles.loreTitleBlock}>
              <Tag color="gold" style={styles.loreBadge}>
                {t('campaignDetail.map.loreBadge')}
              </Tag>
              <Title level={4} style={styles.loreTitle}>
                {area.lore.title}
              </Title>
            </div>
          </div>
          <Paragraph style={styles.loreContent}>
            {area.lore.content}
          </Paragraph>
        </Card>
      )}

      {/* Present Factions in this area */}
      {area.factions && area.factions.length > 0 && (
        <Card style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <TeamOutlined style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>{t('campaignDetail.map.factionsPresent')}</Text>
          </div>
          <Space wrap size={[8, 8]}>
            {area.factions.map((f, idx) => (
              <Tag key={idx} color="purple" style={styles.factionTag}>
                <TeamOutlined style={{ marginRight: 4 }} />
                {f.name}
                {f.reputation && ` • ${f.reputation}`}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* POIs in this Area */}
      <Card style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <CompassOutlined style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>
            {t('campaignDetail.map.containedPOIs')} ({area.pois ? area.pois.length : 0})
          </Text>
        </div>

        {area.pois && area.pois.length > 0 ? (
          <Row gutter={[12, 12]}>
            {area.pois.map((poi) => (
              <Col xs={24} sm={12} key={poi.id}>
                <div
                  style={styles.poiItem}
                  onClick={() => onSelectPOI(poi)}
                >
                  <div style={styles.poiContent}>
                    <div style={styles.poiIconWrap}>
                      <CompassOutlined style={{ color: '#722B2B', fontSize: '16px' }} />
                    </div>
                    <div style={styles.poiMeta}>
                      <Text style={styles.poiName} ellipsis>
                        {poi.name}
                      </Text>
                      <Text style={styles.poiDescription} ellipsis>
                        {poi.description || 'Notable landmark'}
                      </Text>
                    </div>
                  </div>
                  <RightOutlined style={styles.poiArrow} />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text style={{ color: '#8A7A66', fontSize: '14px' }}>
                {t('campaignDetail.map.noPOIs')}
              </Text>
            }
          />
        )}
      </Card>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #FAF3E0 0%, #FAF3E0 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(70, 45, 20, 0.11)',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  levelTag: {
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '2px 8px',
  },
  depthTag: {
    fontSize: '12px',
    borderRadius: '4px',
    color: '#6B5A48',
    background: 'rgba(70, 45, 20, 0.04)',
    borderColor: '#CDBE96',
  },
  title: {
    margin: '0 0 6px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '34px',
  },
  locationSubtitle: {
    color: '#5E4E3C',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  sectionCard: {
    background: 'linear-gradient(135deg, #FAF3E0 0%, #F3EAD2 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionIcon: {
    color: '#722B2B',
    fontSize: '15px',
  },
  sectionTitle: {
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
    fontSize: '14px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  bodyText: {
    color: '#5E4E3C',
    fontSize: '14px',
    lineHeight: 1.7,
    margin: 0,
  },
  loreCard: {
    background: 'linear-gradient(135deg, #F3EAD2 0%, #EDE3C6 100%)',
    border: '1px solid #D9C79A',
    borderLeft: '4px solid #8B5E2B',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(70, 45, 20, 0.14)',
  },
  loreHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  loreIcon: {
    color: '#8B5E2B',
    fontSize: '22px',
    marginTop: '2px',
  },
  loreTitleBlock: {
    flex: 1,
  },
  loreBadge: {
    fontFamily: 'var(--font-heading)',
    fontSize: '11px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    marginBottom: '4px',
  },
  loreTitle: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '24px',
  },
  loreContent: {
    color: '#4A3B2C',
    fontSize: '14px',
    lineHeight: 1.8,
    margin: 0,
    fontStyle: 'italic',
  },
  factionTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    letterSpacing: '0.3px',
    borderRadius: '4px',
    padding: '3px 8px',
  },
  poiItem: {
    background: 'rgba(250, 243, 224, 0.7)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  poiContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
    flex: 1,
  },
  poiIconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    background: 'rgba(114, 43, 43, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  poiMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  poiName: {
    color: '#2B1F17',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
  },
  poiDescription: {
    color: '#6B5A48',
    fontSize: '12px',
  },
  poiArrow: {
    color: '#8A7A66',
    fontSize: '13px',
    marginLeft: '8px',
  },
};
