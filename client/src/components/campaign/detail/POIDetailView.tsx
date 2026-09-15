import { useState } from 'react';
import { Typography, Tag, Card, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  CopyOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { POIDataReturn } from '@/models/worldInterfaces';

const { Title, Text, Paragraph } = Typography;

interface POIDetailViewProps {
  poi: POIDataReturn;
  parentAreaName: string;
  onBackToArea: () => void;
}

export default function POIDetailView({
  poi,
  parentAreaName,
  onBackToArea,
}: POIDetailViewProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyMap = async () => {
    if (!poi.map) return;
    try {
      await navigator.clipboard.writeText(poi.map);
      setCopied(true);
      message.success(t('campaignDetail.map.copied'));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with Back Navigation */}
      <div style={styles.header}>
        <div style={styles.topNavRow}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBackToArea}
            style={styles.backBtn}
          >
            {parentAreaName}
          </Button>
          <Tag color="orange" style={styles.poiTag}>
            <CompassOutlined style={{ marginRight: 4 }} />
            Point of Interest
          </Tag>
        </div>

        <Title level={2} style={styles.title}>
          {poi.name}
        </Title>

        {poi.descriptiveLocation && (
          <Text style={styles.locationSubtitle}>
            <EnvironmentOutlined style={{ marginRight: 6, color: '#C29B38' }} />
            {poi.descriptiveLocation}
          </Text>
        )}
      </div>

      {/* Description & Overview */}
      {(poi.descriptiveOverview || poi.description) && (
        <Card style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <InfoCircleOutlined style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>{t('campaignDetail.map.overview')}</Text>
          </div>
          <Paragraph style={styles.bodyText}>
            {poi.descriptiveOverview || poi.description}
          </Paragraph>
        </Card>
      )}

      {/* ASCII Floorplan / Cartographic Map */}
      {poi.map && (
        <Card style={styles.mapCard}>
          <div style={styles.mapHeader}>
            <div style={styles.mapTitleBlock}>
              <CompassOutlined style={{ color: '#D95C14', fontSize: '16px' }} />
              <Text style={styles.mapTitle}>{t('campaignDetail.map.asciiTitle')}</Text>
            </div>
            <Button
              size="small"
              icon={copied ? <CheckOutlined style={{ color: '#4CAF50' }} /> : <CopyOutlined />}
              onClick={handleCopyMap}
              style={styles.copyBtn}
            >
              {copied ? t('campaignDetail.map.copied') : t('campaignDetail.map.copyAscii')}
            </Button>
          </div>

          <div style={styles.asciiContainer}>
            <pre style={styles.asciiContent}>
              {poi.map}
            </pre>
          </div>
        </Card>
      )}
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
  topNavRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  backBtn: {
    padding: 0,
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    letterSpacing: '0.3px',
  },
  poiTag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '1px 8px',
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
    marginBottom: '10px',
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
  mapCard: {
    background: 'linear-gradient(135deg, #10141C 0%, #0A0D12 100%)',
    border: '1px solid #283244',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
  },
  mapHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  mapTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mapTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  copyBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#374151',
    color: '#EDE6D6',
  },
  asciiContainer: {
    background: '#080B0F',
    border: '1px solid #1C2330',
    borderRadius: '8px',
    padding: '16px',
    overflowX: 'auto',
    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)',
  },
  asciiContent: {
    margin: 0,
    fontFamily: "'Courier New', Courier, Consolas, monospace",
    fontSize: '13px',
    lineHeight: 1.25,
    color: '#E8A854',
    textShadow: '0 0 4px rgba(232, 168, 84, 0.3)',
    whiteSpace: 'pre',
  },
};
