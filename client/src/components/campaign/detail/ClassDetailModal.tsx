import { Modal, Typography, Tag, Tabs } from 'antd';
import {
  ThunderboltOutlined,
  FireOutlined,
  BookOutlined,
  HeartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';

// components
import ClassFeaturesTab from './classDetail/ClassFeaturesTab';
import ClassResourcesTab from './classDetail/ClassResourcesTab';
import ClassSpellsTab from './classDetail/ClassSpellsTab';

// interfaces
import type { ClassDataReturn } from '@/models/classInterfaces';

const { Title, Paragraph } = Typography;

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassDataReturn | null;
}

export default function ClassDetailModal({
  isOpen,
  onClose,
  classData,
}: ClassDetailModalProps): React.JSX.Element | null {

  const { t } = useTranslation();

  if (!classData) return null;

  const { spellcastingProperties } = classData;

  const tabItems = [
    {
      key: 'features',
      label: `${t('campaignDetail.classes.modal.tabFeatures')} (${classData.features.length})`,
      children: <ClassFeaturesTab features={classData.features} />,
    },
    {
      key: 'resources',
      label: `${t('campaignDetail.classes.modal.tabResources')} (${classData.resources.length})`,
      children: <ClassResourcesTab resources={classData.resources} />,
    },
    // Classes without any spell have no spell tab
    ...(classData.spells.length > 0
      ? [
          {
            key: 'spells',
            label: `${t('campaignDetail.classes.modal.tabSpells')} (${classData.spells.length})`,
            children: (
              <ClassSpellsTab
                spellcastingProperties={spellcastingProperties}
                spells={classData.spells}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      style={styles.modal}
      styles={{
        mask: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(43, 31, 23, 0.85)',
        },
        body: styles.modalBody,
        header: styles.modalHeader,
      }}
      title={
        <div style={styles.titleWrap}>
          <div style={styles.iconWrap}>
            <BookOutlined style={styles.titleIcon} />
          </div>
          <div>
            <div style={styles.badgeRow}>
              <Tag color="red" style={styles.headerTag}>
                <HeartOutlined style={{ marginRight: 4 }} />
                {t('campaignDetail.classes.hitDie')}: d{classData.hitDie}
              </Tag>
              {spellcastingProperties && (
                <Tag color="purple" style={styles.headerTag}>
                  <ExperimentOutlined style={{ marginRight: 4 }} />
                  {spellcastingProperties.spellcastingType.toUpperCase()} CASTER (
                  {spellcastingProperties.spellcastingAbility.toUpperCase()})
                </Tag>
              )}
              <Tag color="gold" style={styles.headerTag}>
                <ThunderboltOutlined style={{ marginRight: 4 }} />
                {classData.features.length} {t('campaignDetail.classes.featuresCount')}
              </Tag>
            </div>
            <Title level={2} style={styles.classTitle}>
              {classData.name}
            </Title>
          </div>
        </div>
      }
    >
      <div style={styles.scrollContainer}>
        {/* Lore & Description */}
        <div style={styles.section}>
          <Title level={4} style={styles.sectionTitle}>
            <FireOutlined style={styles.sectionIcon} />
            {t('campaignDetail.classes.modal.descriptionTitle')}
          </Title>
          <div style={styles.descriptionBox}>
            <Paragraph style={styles.descText}>
              {classData.description || 'No description recorded for this class.'}
            </Paragraph>
          </div>
        </div>

        <Tabs items={tabItems} />
      </div>
    </Modal>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    maxWidth: '92vw',
  },
  modalHeader: {
    background: 'transparent',
    borderBottom: '1px solid #DDD0AE',
    paddingBottom: '16px',
    marginBottom: '20px',
  },
  modalBody: {
    padding: 0,
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(114, 43, 43, 0.15)',
    border: '1px solid rgba(114, 43, 43, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleIcon: {
    fontSize: '24px',
    color: '#722B2B',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '6px',
  },
  headerTag: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '12px',
    borderRadius: '4px',
    padding: '1px 8px',
  },
  classTitle: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '34px',
  },
  scrollContainer: {
    maxHeight: '70vh',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  section: {
    marginBottom: '8px',
  },
  sectionTitle: {
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionIcon: {
    color: '#722B2B',
    fontSize: '16px',
  },
  descriptionBox: {
    background: 'rgba(250, 243, 224, 0.6)',
    border: '1px solid #DDD0AE',
    borderLeft: '4px solid #722B2B',
    borderRadius: '8px',
    padding: '14px 18px',
  },
  descText: {
    color: '#5E4E3C',
    fontSize: '14px',
    lineHeight: 1.7,
    margin: 0,
  },
};
