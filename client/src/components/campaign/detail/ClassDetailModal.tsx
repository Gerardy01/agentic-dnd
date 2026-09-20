import { useMemo } from 'react';
import {
  Modal,
  Typography,
  Tag,
  Row,
  Col,
  Card,
  Divider,
  Space,
  Empty,
  Collapse,
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SafetyOutlined,
  ThunderboltOutlined,
  FireOutlined,
  BookOutlined,
  HeartOutlined,
  ExperimentOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type {
  ClassDataReturn,
  ClassFeature,
  ClassResourceDataReturn,
} from '@/models/classInterfaces';

const { Title, Text, Paragraph } = Typography;

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassDataReturn | null;
}

export default function ClassDetailModal({
  isOpen,
  onClose,
  classData,
}: ClassDetailModalProps) {
  const { t } = useTranslation();

  // Group features by level ascending (1 to 20)
  const groupedFeatures = useMemo(() => {
    if (!classData?.features) return [];
    const map = new Map<number, ClassFeature[]>();

    for (const feat of classData.features) {
      const list = map.get(feat.level) || [];
      list.push(feat);
      map.set(feat.level, list);
    }

    const sortedLevels = Array.from(map.keys()).sort((a, b) => a - b);
    return sortedLevels.map((lvl) => ({
      level: lvl,
      features: map.get(lvl)!,
    }));
  }, [classData]);

  if (!classData) return null;

  const { spellcastingProperties } = classData;

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
          backgroundColor: 'rgba(7, 9, 13, 0.85)',
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
              <Tag color="red" style={styles.hitDieTag}>
                <HeartOutlined style={{ marginRight: 4 }} />
                {t('campaignDetail.classes.hitDie')}: d{classData.hitDie}
              </Tag>
              {spellcastingProperties && (
                <Tag color="purple" style={styles.spellcasterTag}>
                  <ExperimentOutlined style={{ marginRight: 4 }} />
                  {spellcastingProperties.spellcastingType.toUpperCase()} CASTER (
                  {spellcastingProperties.spellcastingAbility.toUpperCase()})
                </Tag>
              )}
              <Tag color="gold" style={styles.countTag}>
                <ThunderboltOutlined style={{ marginRight: 4 }} />
                {classData.features?.length || 0}{' '}
                {t('campaignDetail.classes.featuresCount')}
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

        {/* Spellcasting Section */}
        {spellcastingProperties && (
          <div style={styles.section}>
            <Title level={4} style={styles.sectionTitle}>
              <ExperimentOutlined style={styles.sectionIcon} />
              {t('campaignDetail.classes.modal.spellcastingTitle')}
            </Title>
            <div style={styles.infoCard}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Text style={styles.fieldLabel}>
                    {t('campaignDetail.classes.modal.spellcastingAbility')}
                  </Text>
                  <div style={styles.fieldValue}>
                    {spellcastingProperties.spellcastingAbility.toUpperCase()}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text style={styles.fieldLabel}>
                    {t('campaignDetail.classes.modal.spellcastingType')}
                  </Text>
                  <div style={styles.fieldValue}>
                    {spellcastingProperties.spellcastingType.replace('_', ' ').toUpperCase()}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text style={styles.fieldLabel}>
                    {t('campaignDetail.classes.modal.preparationType')}
                  </Text>
                  <div style={styles.fieldValue}>
                    {spellcastingProperties.preparationType.toUpperCase()}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <Text style={styles.fieldLabel}>
                    {t('campaignDetail.classes.modal.preparedBonus')}
                  </Text>
                  <div style={styles.fieldValue}>
                    {spellcastingProperties.preparedLevelBonus !== null &&
                    spellcastingProperties.preparedLevelBonus !== undefined
                      ? `${spellcastingProperties.preparedLevelBonus}%`
                      : 'N/A'}
                  </div>
                </Col>
              </Row>

              {/* Cantrips & Spells Known Progression */}
              {(spellcastingProperties.maxCantripKnown?.length > 0 ||
                (spellcastingProperties.maxSpellKnown &&
                  spellcastingProperties.maxSpellKnown.length > 0)) && (
                <div style={styles.progressionRow}>
                  <Divider style={styles.innerDivider} />
                  {spellcastingProperties.maxCantripKnown?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <Text style={styles.progressionTitle}>
                        {t('campaignDetail.classes.modal.cantripsProgression')}
                      </Text>
                      <div style={styles.badgeScroll}>
                        {spellcastingProperties.maxCantripKnown.map((item) => (
                          <Tag key={`cantrip-lvl-${item.level}`} style={styles.progressionBadge}>
                            <span style={styles.progLvl}>Lv {item.level}:</span>{' '}
                            <span style={styles.progVal}>{item.value}</span>
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  {spellcastingProperties.maxSpellKnown &&
                    spellcastingProperties.maxSpellKnown.length > 0 && (
                      <div>
                        <Text style={styles.progressionTitle}>
                          {t('campaignDetail.classes.modal.spellsProgression')}
                        </Text>
                        <div style={styles.badgeScroll}>
                          {spellcastingProperties.maxSpellKnown.map((item) => (
                            <Tag key={`spell-lvl-${item.level}`} style={styles.progressionBadge}>
                              <span style={styles.progLvl}>Lv {item.level}:</span>{' '}
                              <span style={styles.progVal}>{item.value}</span>
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Class Resources Section */}
        {classData.resources && classData.resources.length > 0 && (
          <div style={styles.section}>
            <Title level={4} style={styles.sectionTitle}>
              <SafetyOutlined style={styles.sectionIcon} />
              {t('campaignDetail.classes.modal.resourcesTitle')}
            </Title>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              {classData.resources.map((res: ClassResourceDataReturn) => (
                <div key={res.id} style={styles.resourceCard}>
                  <div style={styles.resourceHeader}>
                    <Title level={5} style={styles.resourceName}>
                      {res.name}
                    </Title>
                    {res.resourceRecovery && (
                      <div style={styles.recoveryTags}>
                        <Tag color="orange" style={styles.recoveryTag}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {t('campaignDetail.classes.modal.shortRest')}:{' '}
                          {res.resourceRecovery.short.value}
                          {res.resourceRecovery.short.type === 'percentage' ? '%' : ''}
                        </Tag>
                        <Tag color="gold" style={styles.recoveryTag}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {t('campaignDetail.classes.modal.longRest')}:{' '}
                          {res.resourceRecovery.long.value}
                          {res.resourceRecovery.long.type === 'percentage' ? '%' : ''}
                        </Tag>
                      </div>
                    )}
                  </div>

                  {res.description && (
                    <Paragraph style={styles.resourceDesc}>{res.description}</Paragraph>
                  )}

                  {res.maxPerLevel && res.maxPerLevel.length > 0 && (
                    <div style={styles.maxPoolSection}>
                      <Text style={styles.poolTitle}>
                        {t('campaignDetail.classes.modal.maxProgression')}
                      </Text>
                      <div style={styles.badgeScroll}>
                        {res.maxPerLevel.map((p) => (
                          <Tag key={`res-${res.id}-lvl-${p.level}`} style={styles.progressionBadge}>
                            <span style={styles.progLvl}>Lv {p.level}:</span>{' '}
                            <span style={styles.progVal}>{p.value}</span>
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Space>
          </div>
        )}

        {/* Features Grouped by Level Section */}
        <div style={styles.section}>
          <Title level={4} style={styles.sectionTitle}>
            <StarOutlined style={styles.sectionIcon} />
            {t('campaignDetail.classes.modal.featuresTitle')} ({classData.features?.length || 0})
          </Title>

          {groupedFeatures.length > 0 ? (
            <Collapse
              defaultActiveKey={groupedFeatures.map((g) => `level-${g.level}`)}
              style={styles.collapse}
              items={groupedFeatures.map((group) => ({
                key: `level-${group.level}`,
                label: (
                  <div style={styles.collapseHeader}>
                    <Tag color="orange" style={styles.levelBadge}>
                      {t('campaignDetail.classes.modal.levelPrefix')} {group.level}
                    </Tag>
                    <Text style={styles.levelFeaturesCount}>
                      {group.features.length}{' '}
                      {group.features.length === 1 ? 'Feature' : 'Features'}
                    </Text>
                  </div>
                ),
                children: (
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    {group.features.map((feature, idx) => (
                      <Card key={`feat-${group.level}-${idx}`} style={styles.featureCard}>
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
                        <Paragraph style={styles.featureDesc}>
                          {feature.description}
                        </Paragraph>
                      </Card>
                    ))}
                  </Space>
                ),
              }))}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span style={{ color: '#8D98AA' }}>
                  {t('campaignDetail.classes.modal.noFeatures')}
                </span>
              }
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    maxWidth: '92vw',
  },
  modalContent: {
    background: 'linear-gradient(135deg, #161A22 0%, #101319 100%)',
    border: '1px solid #283244',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
    padding: '28px 32px',
    color: '#EDE6D6',
  },
  modalHeader: {
    background: 'transparent',
    borderBottom: '1px solid #242B38',
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
    background: 'rgba(217, 92, 20, 0.15)',
    border: '1px solid rgba(217, 92, 20, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleIcon: {
    fontSize: '24px',
    color: '#D95C14',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '6px',
  },
  hitDieTag: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
    padding: '1px 8px',
  },
  spellcasterTag: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
    padding: '1px 8px',
  },
  countTag: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
    padding: '1px 8px',
  },
  classTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '24px',
  },
  scrollContainer: {
    maxHeight: '70vh',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '16px',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionIcon: {
    color: '#D95C14',
    fontSize: '16px',
  },
  descriptionBox: {
    background: 'rgba(10, 13, 18, 0.6)',
    border: '1px solid #222834',
    borderLeft: '4px solid #D95C14',
    borderRadius: '8px',
    padding: '14px 18px',
  },
  descText: {
    color: '#B0BAC9',
    fontSize: '13px',
    lineHeight: 1.7,
    margin: 0,
  },
  infoCard: {
    background: 'rgba(10, 13, 18, 0.6)',
    border: '1px solid #222834',
    borderRadius: '8px',
    padding: '16px',
  },
  fieldLabel: {
    color: '#8D98AA',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fieldValue: {
    color: '#EDE6D6',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'Cinzel', serif",
  },
  progressionRow: {
    marginTop: '12px',
  },
  innerDivider: {
    borderColor: '#242B38',
    margin: '12px 0',
  },
  progressionTitle: {
    color: '#C29B38',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    display: 'block',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  badgeScroll: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  progressionBadge: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid #2B3545',
    color: '#EDE6D6',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
  },
  progLvl: {
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
  },
  progVal: {
    color: '#EDE6D6',
    fontWeight: 700,
  },
  resourceCard: {
    background: 'rgba(10, 13, 18, 0.6)',
    border: '1px solid #222834',
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
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '15px',
  },
  recoveryTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  recoveryTag: {
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
  },
  resourceDesc: {
    color: '#A0AEC0',
    fontSize: '12px',
    lineHeight: 1.6,
    margin: '0 0 10px',
  },
  maxPoolSection: {
    marginTop: '6px',
  },
  poolTitle: {
    color: '#8D98AA',
    fontSize: '10px',
    fontFamily: "'Cinzel', serif",
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  },
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
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.5px',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  levelFeaturesCount: {
    color: '#8D98AA',
    fontSize: '12px',
    fontFamily: "'Cinzel', serif",
  },
  featureCard: {
    background: 'rgba(15, 19, 26, 0.7)',
    border: '1px solid #252D3D',
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
    color: '#EDE6D6',
    fontSize: '14px',
    fontFamily: "'Cinzel', serif",
  },
  featureTypeTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    letterSpacing: '0.5px',
    borderRadius: '4px',
  },
  featureDesc: {
    color: '#B0BAC9',
    fontSize: '12px',
    lineHeight: 1.6,
    margin: 0,
  },
};
