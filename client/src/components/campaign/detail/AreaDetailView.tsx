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
            <CompassOutlined style={{ marginRight: 6, color: '#C29B38' }} />
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
                      <CompassOutlined style={{ color: '#D95C14', fontSize: '16px' }} />
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
              <Text style={{ color: '#707C91', fontSize: '13px' }}>
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
    background: 'linear-gradient(135deg, #171C26 0%, #12151D 100%)',
    border: '1px solid #2B3342',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  levelTag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '2px 8px',
  },
  depthTag: {
    fontSize: '11px',
    borderRadius: '4px',
    color: '#8D98AA',
    background: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#374151',
  },
  title: {
    margin: '0 0 6px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '24px',
    letterSpacing: '0.5px',
  },
  locationSubtitle: {
    color: '#A0AEC0',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  sectionCard: {
    background: 'linear-gradient(135deg, #151922 0%, #11141B 100%)',
    border: '1px solid #28303F',
    borderRadius: '12px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionIcon: {
    color: '#D95C14',
    fontSize: '15px',
  },
  sectionTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  bodyText: {
    color: '#B0BAC9',
    fontSize: '14px',
    lineHeight: 1.7,
    margin: 0,
  },
  loreCard: {
    background: 'linear-gradient(135deg, #1C1914 0%, #14120F 100%)',
    border: '1px solid #4A3E25',
    borderLeft: '4px solid #C29B38',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  loreHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  loreIcon: {
    color: '#C29B38',
    fontSize: '22px',
    marginTop: '2px',
  },
  loreTitleBlock: {
    flex: 1,
  },
  loreBadge: {
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    marginBottom: '4px',
  },
  loreTitle: {
    margin: 0,
    color: '#F4E8C1',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '17px',
  },
  loreContent: {
    color: '#D4C8A9',
    fontSize: '13px',
    lineHeight: 1.8,
    margin: 0,
    fontStyle: 'italic',
  },
  factionTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    letterSpacing: '0.3px',
    borderRadius: '4px',
    padding: '3px 8px',
  },
  poiItem: {
    background: 'rgba(10, 13, 18, 0.7)',
    border: '1px solid #242B38',
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
    background: 'rgba(217, 92, 20, 0.12)',
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
    color: '#EDE6D6',
    fontWeight: 600,
    fontSize: '13px',
    fontFamily: "'Cinzel', serif",
  },
  poiDescription: {
    color: '#8D98AA',
    fontSize: '11px',
  },
  poiArrow: {
    color: '#707C91',
    fontSize: '12px',
    marginLeft: '8px',
  },
};
