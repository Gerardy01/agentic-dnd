import { Card, Collapse, Empty, Space, Tag, Typography } from 'antd';
import { SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import useClassFeaturesTab from '@/hooks/campaign/detail/classDetail/useClassFeaturesTab';

// interfaces
import type { ClassFeature } from '@/models/classInterfaces';

const { Text, Paragraph } = Typography;

interface ClassFeaturesTabProps {
  features: ClassFeature[];
}

export default function ClassFeaturesTab({ features }: ClassFeaturesTabProps): React.JSX.Element {

  const { groupedFeatures } = useClassFeaturesTab(features);

  const { t } = useTranslation();

  if (groupedFeatures.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span style={{ color: '#6B5A48' }}>
            {t('campaignDetail.classes.modal.noFeatures')}
          </span>
        }
      />
    );
  }

  return (
    <Collapse
      defaultActiveKey={groupedFeatures.map((group) => `level-${group.level}`)}
      style={styles.collapse}
      items={groupedFeatures.map((group) => ({
        key: `level-${group.level}`,
        label: (
          <div style={styles.collapseHeader}>
            <Tag color="orange" style={styles.levelBadge}>
              {t('campaignDetail.classes.modal.levelPrefix')} {group.level}
            </Tag>
            <Text style={styles.levelFeaturesCount}>
              {group.features.length} {group.features.length === 1 ? 'Feature' : 'Features'}
            </Text>
          </div>
        ),
        children: (
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {group.features.map((feature, index) => (
              <Card key={`feat-${group.level}-${index}`} style={styles.featureCard}>
                <div style={styles.featureHeader}>
                  <Text strong style={styles.featureName}>
                    {feature.name}
                  </Text>
                  <Tag
                    color={feature.type === 'active' ? 'cyan' : 'purple'}
                    style={styles.featureTypeTag}
                  >
                    {feature.type === 'active' ? (
                      <ThunderboltOutlined style={{ marginRight: 4 }} />
                    ) : (
                      <SafetyOutlined style={{ marginRight: 4 }} />
                    )}
                    {feature.type === 'active'
                      ? t('campaignDetail.classes.modal.active')
                      : t('campaignDetail.classes.modal.passive')}
                  </Tag>
                </div>
                <Paragraph style={styles.featureDesc}>{feature.description}</Paragraph>
              </Card>
            ))}
          </Space>
        ),
      }))}
    />
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  collapse: {
    background: 'transparent',
    border: 'none',
  },
  collapseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  levelBadge: {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.5px',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  levelFeaturesCount: {
    color: '#6B5A48',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
  },
  featureCard: {
    background: '#F3EAD2',
    border: '1px solid #DDD0AE',
    borderRadius: '6px',
    padding: '2px',
  },
  featureHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  featureName: {
    color: '#2B1F17',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
  },
  featureTypeTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
  },
  featureDesc: {
    color: '#5E4E3C',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
};
