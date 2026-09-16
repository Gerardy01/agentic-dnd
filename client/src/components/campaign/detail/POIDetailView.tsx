import { useState, useMemo } from 'react';
import { Typography, Tag, Card, Button, message, Tooltip, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  CopyOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type { POIDataReturn, POIAsciiMapData } from '@/models/worldInterfaces';

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
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Attempt to parse structured JSON ASCII map
  const parsedMapData = useMemo<POIAsciiMapData | null>(() => {
    if (!poi.map) return null;
    try {
      const parsed = JSON.parse(poi.map);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        Array.isArray(parsed.map) &&
        Array.isArray(parsed.legend)
      ) {
        return parsed as POIAsciiMapData;
      }
      return null;
    } catch {
      return null;
    }
  }, [poi.map]);

  // Derive dimensions from the array itself
  const mapHeight = parsedMapData ? parsedMapData.map.length : 0;
  const mapWidth = parsedMapData && parsedMapData.map.length > 0 ? parsedMapData.map[0].length : 0;

  // Symbol lookup table (symbol -> name)
  const symbolMap = useMemo(() => {
    const map = new Map<string, string>();
    if (parsedMapData) {
      for (const item of parsedMapData.legend) {
        map.set(item.symbol, item.name);
      }
    }
    return map;
  }, [parsedMapData]);

  // Count occurrences of each symbol in the map grid
  const symbolCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (parsedMapData) {
      for (const row of parsedMapData.map) {
        for (const char of row) {
          counts.set(char, (counts.get(char) || 0) + 1);
        }
      }
    }
    return counts;
  }, [parsedMapData]);

  // Pure text ASCII representation for copying or raw fallback
  const plainAsciiText = useMemo(() => {
    if (parsedMapData) {
      return parsedMapData.map.map((row) => row.join('')).join('\n');
    }
    return poi.map || '';
  }, [parsedMapData, poi.map]);

  const handleCopyAscii = async () => {
    if (!plainAsciiText) return;
    try {
      await navigator.clipboard.writeText(plainAsciiText);
      setCopiedAscii(true);
      message.success(t('campaignDetail.map.copied'));
      setTimeout(() => setCopiedAscii(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyJson = async () => {
    if (!poi.map) return;
    try {
      await navigator.clipboard.writeText(poi.map);
      setCopiedJson(true);
      message.success(t('campaignDetail.map.copiedJson'));
      setTimeout(() => setCopiedJson(false), 2500);
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

              {parsedMapData && (
                <div style={styles.tagGroup}>
                  <Tag color="gold" style={styles.dimensionTag}>
                    {mapWidth} × {mapHeight} {t('campaignDetail.map.tiles')}
                  </Tag>
                  <Tag color="default" style={styles.metaBadge}>
                    {parsedMapData.legend.length} {t('campaignDetail.map.symbolsCount')}
                  </Tag>
                </div>
              )}
            </div>

            <div style={styles.actionButtons}>
              <Button
                size="small"
                icon={copiedAscii ? <CheckOutlined style={{ color: '#4CAF50' }} /> : <CopyOutlined />}
                onClick={handleCopyAscii}
                style={styles.actionBtn}
              >
                {copiedAscii ? t('campaignDetail.map.copied') : t('campaignDetail.map.copyAsciiGrid')}
              </Button>

              {parsedMapData && (
                <Button
                  size="small"
                  icon={copiedJson ? <CheckOutlined style={{ color: '#4CAF50' }} /> : <CodeOutlined />}
                  onClick={handleCopyJson}
                  style={styles.actionBtn}
                >
                  {copiedJson ? t('campaignDetail.map.copied') : t('campaignDetail.map.copyJson')}
                </Button>
              )}
            </div>
          </div>

          {/* Map Grid Container */}
          <div style={styles.asciiContainer}>
            {parsedMapData ? (
              <div style={styles.gridWrapper}>
                {parsedMapData.map.map((row, rowIdx) => (
                  <div key={rowIdx} style={styles.gridRow}>
                    {row.map((char, colIdx) => {
                      const isHovered = hoveredSymbol !== null && char === hoveredSymbol;
                      const isDimmed = hoveredSymbol !== null && char !== hoveredSymbol;
                      const charName = symbolMap.get(char) || char;

                      return (
                        <Tooltip
                          key={`${rowIdx}-${colIdx}`}
                          title={`${char} — ${charName}`}
                          placement="top"
                          mouseEnterDelay={0.3}
                        >
                          <span
                            onMouseEnter={() => setHoveredSymbol(char)}
                            onMouseLeave={() => setHoveredSymbol(null)}
                            style={{
                              ...styles.gridCell,
                              ...(isHovered ? styles.gridCellHovered : {}),
                              ...(isDimmed ? styles.gridCellDimmed : {}),
                            }}
                          >
                            {char}
                          </span>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <pre style={styles.asciiContent}>{poi.map}</pre>
            )}
          </div>

          {/* Cartographic Legend Section */}
          {parsedMapData && parsedMapData.legend.length > 0 && (
            <div style={styles.legendContainer}>
              <div style={styles.legendHeader}>
                <div style={styles.legendTitleRow}>
                  <AppstoreOutlined style={{ color: '#D95C14', fontSize: '14px' }} />
                  <Text style={styles.legendTitle}>{t('campaignDetail.map.legendTitle')}</Text>
                </div>
                <Text style={styles.legendHint}>{t('campaignDetail.map.hoverHint')}</Text>
              </div>

              <Row gutter={[10, 10]}>
                {parsedMapData.legend.map((entry, idx) => {
                  const count = symbolCounts.get(entry.symbol) ?? 0;
                  const isHovered = hoveredSymbol === entry.symbol;

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                      <div
                        style={{
                          ...styles.legendItem,
                          ...(isHovered ? styles.legendItemHovered : {}),
                        }}
                        onMouseEnter={() => setHoveredSymbol(entry.symbol)}
                        onMouseLeave={() => setHoveredSymbol(null)}
                      >
                        <div style={styles.symbolBadge}>
                          {entry.symbol}
                        </div>
                        <div style={styles.legendMeta}>
                          <Text style={styles.legendName} ellipsis>
                            {entry.name}
                          </Text>
                          <Text style={styles.legendCount}>
                            {count} {count === 1 ? 'tile' : 'tiles'}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}
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
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '14px',
  },
  mapTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  mapTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  tagGroup: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  dimensionTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '0 6px',
    letterSpacing: '0.5px',
  },
  metaBadge: {
    fontSize: '11px',
    borderRadius: '4px',
    padding: '0 6px',
    color: '#8D98AA',
    background: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#374151',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: '#374151',
    color: '#EDE6D6',
  },
  asciiContainer: {
    background: '#070A0E',
    border: '1px solid #1C2330',
    borderRadius: '8px',
    padding: '16px',
    overflowX: 'auto',
    boxShadow: 'inset 0 3px 12px rgba(0, 0, 0, 0.7)',
  },
  gridWrapper: {
    display: 'inline-block',
    userSelect: 'none',
  },
  gridRow: {
    display: 'flex',
    lineHeight: 1,
  },
  gridCell: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '14px',
    height: '16px',
    fontFamily: "'Courier New', Courier, Consolas, monospace",
    fontSize: '13px',
    fontWeight: 500,
    color: '#E8A854',
    textShadow: '0 0 3px rgba(232, 168, 84, 0.25)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  gridCellHovered: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(217, 92, 20, 0.45)',
    boxShadow: '0 0 8px rgba(217, 92, 20, 0.6)',
    borderRadius: '2px',
    fontWeight: 700,
    transform: 'scale(1.15)',
    zIndex: 2,
  },
  gridCellDimmed: {
    opacity: 0.3,
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
  legendContainer: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #1D2433',
  },
  legendHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  legendTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  legendHint: {
    color: '#707C91',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  legendItem: {
    background: 'rgba(12, 16, 23, 0.7)',
    border: '1px solid #222B3A',
    borderRadius: '6px',
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  legendItemHovered: {
    background: 'rgba(217, 92, 20, 0.15)',
    borderColor: '#D95C14',
    boxShadow: '0 2px 10px rgba(217, 92, 20, 0.25)',
    transform: 'translateY(-1px)',
  },
  symbolBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    background: '#151A24',
    border: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#E8A854',
    flexShrink: 0,
    boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.4)',
  },
  legendMeta: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flex: 1,
  },
  legendName: {
    color: '#EDE6D6',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  legendCount: {
    color: '#8D98AA',
    fontSize: '10px',
    fontFamily: "'Cinzel', serif",
  },
};

