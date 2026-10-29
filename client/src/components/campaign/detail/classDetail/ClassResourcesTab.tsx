import { Empty, Space, Tag, Typography } from 'antd';
import { ClockCircleOutlined, UnlockOutlined } from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import useClassResourcesTab from '@/hooks/campaign/detail/classDetail/useClassResourcesTab';

// components
import ClassProgressionTags from './ClassProgressionTags';

// interfaces
import type { ClassResourceDataReturn } from '@/models/classInterfaces';

const { Title, Text, Paragraph } = Typography;

interface ClassResourcesTabProps {
  resources: ClassResourceDataReturn[];
}

export default function ClassResourcesTab({ resources }: ClassResourcesTabProps): React.JSX.Element {

  const { getUnlockLevel } = useClassResourcesTab();

  const { t } = useTranslation();

  if (resources.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span style={{ color: '#6B5A48' }}>
            {t('campaignDetail.classes.modal.noResources')}
          </span>
        }
      />
    );
  }

  return (
    <Space direction="vertical" size={14} style={{ width: '100%' }}>
      {resources.map((resource) => {
        const unlockLevel = getUnlockLevel(resource);
        return (
        <div key={resource.id} style={styles.resourceCard}>
          <div style={styles.resourceHeader}>
            <Title level={5} style={styles.resourceName}>
              {resource.name}
            </Title>
            <div style={styles.recoveryTags}>
              {unlockLevel !== null && (
                <Tag color="green" style={styles.recoveryTag}>
                  <UnlockOutlined style={{ marginRight: 4 }} />
                  {t('campaignDetail.classes.modal.unlocksAtLevel', { level: unlockLevel })}
                </Tag>
              )}
              {resource.resourceRecovery && (
                <>
                  <Tag color="orange" style={styles.recoveryTag}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {t('campaignDetail.classes.modal.shortRest')}: {resource.resourceRecovery.short.value}
                    {resource.resourceRecovery.short.type === 'percentage' ? '%' : ''}
                  </Tag>
                  <Tag color="gold" style={styles.recoveryTag}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {t('campaignDetail.classes.modal.longRest')}: {resource.resourceRecovery.long.value}
                    {resource.resourceRecovery.long.type === 'percentage' ? '%' : ''}
                  </Tag>
                </>
              )}
            </div>
          </div>

          {resource.description && (
            <Paragraph style={styles.resourceDesc}>{resource.description}</Paragraph>
          )}

          {resource.maxPerLevel.length > 0 && (
            <div style={styles.maxPoolSection}>
              <Text style={styles.poolTitle}>{t('campaignDetail.classes.modal.maxProgression')}</Text>
              <ClassProgressionTags keyPrefix={`res-${resource.id}`} progression={resource.maxPerLevel} />
            </div>
          )}
        </div>
        );
      })}
    </Space>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  resourceCard: {
    background: 'rgba(250, 243, 224, 0.6)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '14px 16px',
  },
  resourceHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '8px',
  },
  resourceName: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
  },
  recoveryTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  recoveryTag: {
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
  },
  resourceDesc: {
    color: '#5E4E3C',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: '0 0 10px',
  },
  maxPoolSection: {
    marginTop: '6px',
  },
  poolTitle: {
    color: '#6B5A48',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  },
};
