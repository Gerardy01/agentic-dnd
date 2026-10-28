import { useState, useMemo } from 'react';
import { Row, Col, Card, Input, Tree, Typography, Tag, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SearchOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  FolderOpenOutlined,
  AimOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import type { AreaWithDetailsReturn, POIDataReturn } from '@/models/worldInterfaces';
import type { SelectedMapNode, AreaTreeNode } from '@/hooks/campaign/useCampaignDetail';
import AreaDetailView from './AreaDetailView';
import POIDetailView from './POIDetailView';

const { Text, Title, Paragraph } = Typography;

interface CampaignMapTabProps {
  areas: AreaWithDetailsReturn[];
  areaTree: AreaTreeNode[];
  selectedNode: SelectedMapNode | null;
  onSelectArea: (area: AreaWithDetailsReturn) => void;
  onSelectPOI: (poi: POIDataReturn, parentAreaName: string) => void;
}

export default function CampaignMapTab({
  areas,
  areaTree,
  selectedNode,
  onSelectArea,
  onSelectPOI,
}: CampaignMapTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map to quickly find area by ID
  const areaById = useMemo(() => {
    const map = new Map<number, AreaWithDetailsReturn>();
    for (const a of areas) {
      map.set(a.id, a);
    }
    return map;
  }, [areas]);

  // Convert AreaTreeNode to Ant Design DataNode
  const treeData = useMemo(() => {
    const convertNode = (node: AreaTreeNode): DataNode => {
      const childrenNodes: DataNode[] = [];

      // Add sub-areas
      for (const child of node.children) {
        childrenNodes.push(convertNode(child));
      }

      // Add POIs under this leaf area
      for (const poi of node.pois) {
        const isPoiMatch = !searchQuery || poi.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (isPoiMatch || !searchQuery) {
          childrenNodes.push({
            key: `poi-${poi.id}-${node.areaId}`,
            title: (
              <div style={styles.treeNodeRow}>
                <CompassOutlined style={styles.poiIcon} />
                <Text style={styles.poiTitle} ellipsis>
                  {poi.name}
                </Text>
                <Tag color="orange" style={styles.poiTag}>
                  POI
                </Tag>
              </div>
            ),
            isLeaf: true,
          });
        }
      }

      return {
        key: `area-${node.areaId}`,
        title: (
          <div style={styles.treeNodeRow}>
            <EnvironmentOutlined style={styles.areaIcon} />
            <Text style={styles.areaTitle} ellipsis>
              {node.title}
            </Text>
            <Tag color="default" style={styles.levelTag}>
              {node.levelType}
            </Tag>
            {node.poiCount > 0 && (
              <Tag color="gold" style={styles.countTag}>
                {node.poiCount} POI
              </Tag>
            )}
          </div>
        ),
        children: childrenNodes.length > 0 ? childrenNodes : undefined,
      };
    };

    return areaTree.map((root) => convertNode(root));
  }, [areaTree, searchQuery]);

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) return;
    const key = String(selectedKeys[0]);

    if (key.startsWith('area-')) {
      const areaId = Number(key.replace('area-', ''));
      const area = areaById.get(areaId);
      if (area) {
        onSelectArea(area);
      }
    } else if (key.startsWith('poi-')) {
      const parts = key.split('-');
      const poiId = Number(parts[1]);
      const areaId = Number(parts[2]);
      const area = areaById.get(areaId);
      if (area && area.pois) {
        const poi = area.pois.find((p) => p.id === poiId);
        if (poi) {
          onSelectPOI(poi, area.name);
        }
      }
    }
  };

  const selectedKey = useMemo(() => {
    if (!selectedNode) return [];
    if (selectedNode.type === 'area') {
      return [`area-${selectedNode.data.id}`];
    }
    return [`poi-${selectedNode.data.id}-${selectedNode.data.areaId}`];
  }, [selectedNode]);

  return (
    <div style={styles.container}>
      <Row gutter={[20, 20]} style={{ minHeight: '620px' }}>
        {/* Left Explorer Pane */}
        <Col xs={24} md={9} lg={8}>
          <Card style={styles.explorerCard}>
            <div style={styles.explorerHeader}>
              <div style={styles.explorerTitleBlock}>
                <FolderOpenOutlined style={{ color: '#722B2B', fontSize: '16px' }} />
                <Title level={4} style={styles.explorerTitle}>
                  {t('campaignDetail.map.explorerTitle')}
                </Title>
              </div>
              <Paragraph style={styles.explorerSubtitle}>
                {t('campaignDetail.map.explorerSubtitle')}
              </Paragraph>
            </div>

            {/* Search Input */}
            <Input
              prefix={<SearchOutlined style={{ color: '#8A7A66' }} />}
              placeholder={t('campaignDetail.map.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={styles.searchInput}
            />

            {/* Hierarchy Tree */}
            <div style={styles.treeWrapper}>
              {treeData.length > 0 ? (
                <Tree
                  treeData={treeData}
                  selectedKeys={selectedKey}
                  onSelect={handleTreeSelect}
                  defaultExpandAll
                  style={styles.tree}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text style={{ color: '#8A7A66', fontSize: '14px' }}>
                      No matching locations
                    </Text>
                  }
                />
              )}
            </div>
          </Card>
        </Col>

        {/* Right Detail Pane */}
        <Col xs={24} md={15} lg={16}>
          {selectedNode ? (
            selectedNode.type === 'area' ? (
              <AreaDetailView
                area={selectedNode.data}
                onSelectPOI={(poi) => onSelectPOI(poi, selectedNode.data.name)}
              />
            ) : (
              <POIDetailView
                poi={selectedNode.data}
                parentAreaName={selectedNode.parentAreaName}
                onBackToArea={() => {
                  const parentArea = areaById.get(selectedNode.data.areaId);
                  if (parentArea) onSelectArea(parentArea);
                }}
              />
            )
          ) : (
            <Card style={styles.emptyCard}>
              <div style={styles.emptyContent}>
                <div style={styles.emptyIconWrap}>
                  <AimOutlined style={{ color: '#722B2B', fontSize: '32px' }} />
                </div>
                <Title level={3} style={styles.emptyTitle}>
                  {t('campaignDetail.map.emptySelectTitle')}
                </Title>
                <Paragraph style={styles.emptySubtitle}>
                  {t('campaignDetail.map.emptySelectSubtitle')}
                </Paragraph>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4px 0',
  },
  explorerCard: {
    background: 'linear-gradient(135deg, #FAF3E0 0%, #F3EAD2 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(70, 45, 20, 0.11)',
  },
  explorerHeader: {
    marginBottom: '12px',
  },
  explorerTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  explorerTitle: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
  },
  explorerSubtitle: {
    color: '#6B5A48',
    fontSize: '13px',
    margin: 0,
    lineHeight: 1.5,
  },
  searchInput: {
    marginBottom: '14px',
    background: 'rgba(250, 243, 224, 0.8)',
    borderColor: '#CDBE96',
    borderRadius: '6px',
    color: '#2B1F17',
  },
  treeWrapper: {
    background: 'rgba(250, 243, 224, 0.6)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '12px 8px',
    maxHeight: '520px',
    overflowY: 'auto',
  },
  tree: {
    background: 'transparent',
    color: '#2B1F17',
  },
  treeNodeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 0',
  },
  areaIcon: {
    color: '#722B2B',
    fontSize: '14px',
  },
  areaTitle: {
    color: '#2B1F17',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    maxWidth: '120px',
  },
  levelTag: {
    fontSize: '11px',
    borderRadius: '3px',
    padding: '0 5px',
    color: '#6B5A48',
    background: 'rgba(70, 45, 20, 0.04)',
    borderColor: '#CDBE96',
  },
  countTag: {
    fontSize: '11px',
    borderRadius: '3px',
    padding: '0 5px',
    fontFamily: 'var(--font-body)',
  },
  poiIcon: {
    color: '#8B5E2B',
    fontSize: '14px',
  },
  poiTitle: {
    color: '#4A3B2C',
    fontSize: '13px',
    maxWidth: '130px',
  },
  poiTag: {
    fontSize: '9px',
    borderRadius: '3px',
    padding: '0 4px',
    fontFamily: 'var(--font-body)',
  },
  emptyCard: {
    background: 'linear-gradient(135deg, #FAF3E0 0%, #F3EAD2 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '380px',
  },
  emptyContent: {
    maxWidth: '420px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  emptyIconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(114, 43, 43, 0.12)',
    border: '1px solid rgba(114, 43, 43, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  emptyTitle: {
    margin: '0 0 8px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '25px',
  },
  emptySubtitle: {
    color: '#6B5A48',
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0,
  },
};
