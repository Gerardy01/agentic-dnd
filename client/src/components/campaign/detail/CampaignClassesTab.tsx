import { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Empty, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  BookOutlined,
  SearchOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { ClassDataReturn } from '@/models/classInterfaces';
import ClassDetailModal from './ClassDetailModal';

const { Title, Text, Paragraph } = Typography;

interface CampaignClassesTabProps {
  classes: ClassDataReturn[];
}

export default function CampaignClassesTab({ classes }: CampaignClassesTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<ClassDataReturn | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes;
    const q = searchQuery.toLowerCase();
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        `d${c.hitDie}`.includes(q) ||
        c.features?.some((f) => f.name.toLowerCase().includes(q))
    );
  }, [classes, searchQuery]);

  const handleOpenClassModal = (cls: ClassDataReturn) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const handleCloseClassModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <BookOutlined style={{ marginRight: 8, color: '#722B2B' }} />
            {t('campaignDetail.classes.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.classes.subtitle')}
          </Paragraph>
        </div>

        <Input
          prefix={<SearchOutlined style={{ color: '#8A7A66' }} />}
          placeholder={t('campaignDetail.classes.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          style={styles.searchInput}
        />
      </div>

      {/* Class Cards Grid */}
      {filteredClasses.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredClasses.map((cls) => (
            <Col xs={24} sm={12} lg={8} key={cls.id}>
              <Card
                style={styles.classCard}
                hoverable
                onClick={() => handleOpenClassModal(cls)}
              >
                {/* Top Name & Badge */}
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrap}>
                    <BookOutlined style={styles.cardIcon} />
                  </div>
                  <div style={styles.headerInfo}>
                    <Title level={4} style={styles.className} ellipsis={{ rows: 1 }}>
                      {cls.name}
                    </Title>
                    <div style={styles.badgeRow}>
                      <Tag color="red" style={styles.hitDieTag}>
                        <HeartOutlined style={{ marginRight: 3 }} />
                        d{cls.hitDie}
                      </Tag>
                      {cls.spellcastingProperties && (
                        <Tag color="purple" style={styles.spellcasterTag}>
                          <ExperimentOutlined style={{ marginRight: 3 }} />
                          {cls.spellcastingProperties.spellcastingAbility.toUpperCase()}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={styles.descSection}>
                  <Paragraph
                    style={styles.descText}
                    ellipsis={{ rows: 3 }}
                  >
                    {cls.description || 'A unique discipline forged within the realm.'}
                  </Paragraph>
                </div>

                {/* Card Footer with counts and action */}
                <div style={styles.cardFooter}>
                  <div style={styles.summaryTags}>
                    <Tag color="default" style={styles.summaryTag}>
                      <ThunderboltOutlined style={{ marginRight: 4, color: '#722B2B' }} />
                      {cls.features?.length || 0} {t('campaignDetail.classes.featuresCount')}
                    </Tag>
                    {cls.resources && cls.resources.length > 0 && (
                      <Tag color="default" style={styles.summaryTag}>
                        <SafetyOutlined style={{ marginRight: 4, color: '#8B5E2B' }} />
                        {cls.resources.length} {t('campaignDetail.classes.resourcesCount')}
                      </Tag>
                    )}
                  </div>
                  <Button
                    type="link"
                    size="small"
                    style={styles.inspectBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenClassModal(cls);
                    }}
                  >
                    {t('campaignDetail.classes.inspectCodex')}
                    <RightOutlined style={{ fontSize: '11px', marginLeft: 4 }} />
                  </Button>
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
                  {t('campaignDetail.classes.emptyTitle')}
                </Title>
                <Text style={styles.emptySubtitle}>
                  {t('campaignDetail.classes.emptySubtitle')}
                </Text>
              </div>
            }
          />
        </Card>
      )}

      {/* Class Detail Modal */}
      <ClassDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseClassModal}
        classData={selectedClass}
      />
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
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '28px',
  },
  subtitle: {
    color: '#6B5A48',
    fontSize: '14px',
    margin: 0,
  },
  searchInput: {
    width: '280px',
    background: 'rgba(250, 243, 224, 0.8)',
    borderColor: '#CDBE96',
    borderRadius: '6px',
    color: '#2B1F17',
  },
  classCard: {
    background: 'linear-gradient(135deg, #FAF3E0 0%, #F3EAD2 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(70, 45, 20, 0.11)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'rgba(114, 43, 43, 0.12)',
    border: '1px solid rgba(114, 43, 43, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '20px',
    color: '#722B2B',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  className: {
    margin: '0 0 4px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  hitDieTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    padding: '0 6px',
  },
  spellcasterTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
    padding: '0 6px',
  },
  descSection: {
    flex: 1,
    marginBottom: '14px',
  },
  descText: {
    color: '#5E4E3C',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #DDD0AE',
    marginTop: 'auto',
  },
  summaryTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  summaryTag: {
    background: 'rgba(70, 45, 20, 0.03)',
    borderColor: '#CDBE96',
    color: '#6B5A48',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    borderRadius: '4px',
    margin: 0,
  },
  inspectBtn: {
    color: '#722B2B',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
  },
  emptyCard: {
    background: 'linear-gradient(135deg, #FAF3E0 0%, #F3EAD2 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
  },
  emptyWrap: {
    marginTop: '12px',
  },
  emptyTitle: {
    margin: '0 0 6px',
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
  },
  emptySubtitle: {
    color: '#6B5A48',
    fontSize: '14px',
  },
};
