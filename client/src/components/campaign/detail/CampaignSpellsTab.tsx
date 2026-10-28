import { Row, Col, Card, Typography, Tag, Input, Empty, Modal, Space, Divider, Select } from 'antd';
import {
  ThunderboltOutlined,
  SearchOutlined,
  SafetyOutlined,
  RightOutlined,
  FireOutlined,
  AimOutlined,
} from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import useCampaignSpellsTab from '@/hooks/campaign/detail/useCampaignSpellsTab';

// interfaces
import type { SpellDataReturn } from '@/models/spellInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignSpellsTabProps {
  spells: SpellDataReturn[];
}

const DEFAULT_SCHOOL_COLOR = '#6B5A48';

const SCHOOL_COLOR_MAP: Record<string, string> = {
  abjuration: '#3E6A8A',
  conjuration: '#B7791F',
  divination: '#2F8076',
  enchantment: '#A8336F',
  evocation: '#A33A2E',
  illusion: '#7A4B8F',
  necromancy: '#3F7D4A',
  transmutation: '#8B5E2B',
};

const getSchoolColor = (school: string | null): string =>
  (school && SCHOOL_COLOR_MAP[school]) || DEFAULT_SCHOOL_COLOR;

export default function CampaignSpellsTab({ spells }: CampaignSpellsTabProps): React.JSX.Element {

  const {
    searchQuery,
    levelFilter,
    schoolFilter,
    classFilter,
    levelOptions,
    schoolOptions,
    classOptions,
    filteredSpells,
    selectedSpell,
    setSearchQuery,
    setLevelFilter,
    setSchoolFilter,
    setClassFilter,
    getLevelLabel,
    handleSelectSpell,
    handleCloseSpell,
  } = useCampaignSpellsTab(spells);

  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <ThunderboltOutlined style={{ marginRight: 8, color: '#722B2B' }} />
            {t('campaignDetail.spells.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.spells.subtitle')}
          </Paragraph>
        </div>

        <div style={styles.filterGroup}>
          <Select value={levelFilter} onChange={setLevelFilter} style={styles.filterSelect} options={levelOptions} />
          <Select value={schoolFilter} onChange={setSchoolFilter} style={styles.filterSelect} options={schoolOptions} />
          <Select value={classFilter} onChange={setClassFilter} style={styles.filterSelect} options={classOptions} />
          <Input
            prefix={<SearchOutlined style={{ color: '#8A7A66' }} />}
            placeholder={t('campaignDetail.spells.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Spells Cards Grid */}
      {filteredSpells.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredSpells.map((spell) => {
            const schoolColor = getSchoolColor(spell.school);
            return (
              <Col xs={24} sm={12} lg={8} key={spell.id}>
                <Card
                  style={{ ...styles.spellCard, borderTop: `3px solid ${schoolColor}` }}
                  hoverable
                  onClick={() => handleSelectSpell(spell)}
                >
                  <div style={styles.cardHeader}>
                    <div
                      style={{
                        ...styles.iconWrap,
                        borderColor: schoolColor,
                        boxShadow: `0 0 12px ${schoolColor}33`,
                      }}
                    >
                      <ThunderboltOutlined style={{ fontSize: '20px', color: schoolColor }} />
                    </div>
                    <div style={styles.headerInfo}>
                      <Title level={4} style={styles.spellName} ellipsis={{ rows: 1 }}>
                        {spell.name}
                      </Title>
                      <div style={styles.badgeRow}>
                        <Tag style={{ ...styles.levelTag, borderColor: schoolColor, color: schoolColor }}>
                          {getLevelLabel(spell.level).toUpperCase()}
                        </Tag>
                        {spell.school && (
                          <Tag color="default" style={styles.schoolTag}>
                            {spell.school.toUpperCase()}
                          </Tag>
                        )}
                        {spell.range && <Tag style={styles.rangeTag}>{spell.range}</Tag>}
                      </div>
                    </div>
                  </div>

                  {/* Attack Mechanics */}
                  {spell.attackProperties && (
                    <div style={styles.propsRow}>
                      <FireOutlined style={{ color: '#722B2B', marginRight: 4 }} />
                      <Text style={styles.propValue}>
                        {spell.attackProperties.damages.join(' + ') || t('campaignDetail.spells.noDamage')}
                      </Text>
                      <Tag style={styles.microTag}>
                        {spell.attackProperties.requiresRangedAttackRoll
                          ? t('campaignDetail.spells.rangedAttack')
                          : t('campaignDetail.spells.meleeAttack')}
                      </Tag>
                    </div>
                  )}

                  {/* Saving Throw Mechanics */}
                  {spell.spellSaveProperties && (
                    <div style={styles.propsRow}>
                      <SafetyOutlined style={{ color: '#3E6A8A', marginRight: 4 }} />
                      <Text style={styles.propValue}>
                        {t('campaignDetail.spells.saveShort', {
                          stat: spell.spellSaveProperties.savingThrowStat.toUpperCase(),
                        })}
                      </Text>
                    </div>
                  )}

                  <Paragraph style={styles.description} ellipsis={{ rows: 2 }}>
                    {spell.description || t('campaignDetail.spells.noDescription')}
                  </Paragraph>

                  {/* Classes that learn this spell */}
                  <div style={styles.classRow}>
                    {spell.classes.length > 0 ? (
                      spell.classes.map((cls) => (
                        <Tag key={cls.id} color="cyan" style={styles.classTag}>
                          {cls.name}
                        </Tag>
                      ))
                    ) : (
                      <Text style={styles.noClassText}>{t('campaignDetail.spells.noClasses')}</Text>
                    )}
                  </div>

                  <div style={styles.cardFooter}>
                    <Text style={styles.inspectText}>{t('campaignDetail.spells.inspectCodex')}</Text>
                    <RightOutlined style={styles.inspectArrow} />
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div style={styles.emptyContainer}>
          <Empty
            description={
              <div>
                <Text style={styles.emptyTitle}>{t('campaignDetail.spells.emptyTitle')}</Text>
                <Paragraph style={styles.emptySubtitle}>
                  {t('campaignDetail.spells.emptySubtitle')}
                </Paragraph>
              </div>
            }
          />
        </div>
      )}

      {/* Spell Detail Modal */}
      {selectedSpell && (
        <Modal
          open={!!selectedSpell}
          onCancel={handleCloseSpell}
          footer={null}
          centered
          width={680}
          styles={{
            mask: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(43, 31, 23, 0.85)',
            },
            body: styles.modalBody,
          }}
        >
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={{ ...styles.modalIconWrap, borderColor: getSchoolColor(selectedSpell.school) }}>
                <ThunderboltOutlined style={{ fontSize: '26px', color: getSchoolColor(selectedSpell.school) }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.modalBadgeRow}>
                  <Tag
                    style={{
                      ...styles.modalLevelTag,
                      borderColor: getSchoolColor(selectedSpell.school),
                      color: getSchoolColor(selectedSpell.school),
                    }}
                  >
                    {getLevelLabel(selectedSpell.level).toUpperCase()}
                  </Tag>
                  {selectedSpell.school && (
                    <Tag color="orange" style={styles.modalTag}>
                      {selectedSpell.school.toUpperCase()}
                    </Tag>
                  )}
                </div>
                <Title level={2} style={styles.modalTitle}>
                  {selectedSpell.name}
                </Title>
              </div>
            </div>

            <Divider style={styles.modalDivider} />

            {/* Mechanics Bar */}
            <div style={styles.mechanicsBar}>
              <div style={styles.mechItem}>
                <Text style={styles.mechLabel}>{t('campaignDetail.spells.modal.level')}</Text>
                <Text style={styles.mechVal}>{getLevelLabel(selectedSpell.level)}</Text>
              </div>
              <div style={styles.mechItem}>
                <Text style={styles.mechLabel}>{t('campaignDetail.spells.modal.range')}</Text>
                <Text style={styles.mechVal}>{selectedSpell.range || '-'}</Text>
              </div>
              {selectedSpell.attackProperties && (
                <div style={styles.mechItem}>
                  <Text style={styles.mechLabel}>{t('campaignDetail.spells.modal.damage')}</Text>
                  <Text style={{ ...styles.mechVal, color: '#722B2B' }}>
                    {selectedSpell.attackProperties.damages.join(' + ') || '-'}
                  </Text>
                </div>
              )}
              {selectedSpell.spellSaveProperties && (
                <div style={styles.mechItem}>
                  <Text style={styles.mechLabel}>{t('campaignDetail.spells.modal.savingThrow')}</Text>
                  <Text style={{ ...styles.mechVal, color: '#3E6A8A' }}>
                    {selectedSpell.spellSaveProperties.savingThrowStat.toUpperCase()}
                  </Text>
                </div>
              )}
            </div>

            {selectedSpell.description && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>{t('campaignDetail.spells.modal.descriptionTitle')}</Text>
                <Paragraph style={styles.modalText}>{selectedSpell.description}</Paragraph>
              </div>
            )}

            {selectedSpell.attackProperties && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  <AimOutlined style={{ marginRight: 6, color: '#722B2B' }} />
                  {t('campaignDetail.spells.modal.attackTitle')}
                </Text>
                <Paragraph style={styles.modalText}>
                  {selectedSpell.attackProperties.requiresRangedAttackRoll
                    ? t('campaignDetail.spells.modal.rangedAttackDesc')
                    : t('campaignDetail.spells.modal.meleeAttackDesc')}
                </Paragraph>
                <Space size={[6, 6]} wrap>
                  {selectedSpell.attackProperties.damages.map((damage, index) => (
                    <Tag key={index} color="orange" style={styles.modalPropTag}>
                      {damage}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {selectedSpell.spellSaveProperties && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  <SafetyOutlined style={{ marginRight: 6, color: '#3E6A8A' }} />
                  {t('campaignDetail.spells.modal.saveTitle')}
                </Text>
                <Space size={[6, 6]} wrap>
                  <Tag color="blue" style={styles.modalPropTag}>
                    {t('campaignDetail.spells.modal.saveStat', {
                      stat: selectedSpell.spellSaveProperties.savingThrowStat.toUpperCase(),
                    })}
                  </Tag>
                  <Tag color="green" style={styles.modalPropTag}>
                    {t('campaignDetail.spells.modal.onSuccess', {
                      percentage: selectedSpell.spellSaveProperties.onSuccessDamagePercentage,
                    })}
                  </Tag>
                  <Tag color="red" style={styles.modalPropTag}>
                    {t('campaignDetail.spells.modal.onFail', {
                      percentage: selectedSpell.spellSaveProperties.onFailDamagePercentage,
                    })}
                  </Tag>
                </Space>
              </div>
            )}

            <div style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>{t('campaignDetail.spells.modal.classesTitle')}</Text>
              <Space size={[6, 6]} wrap>
                {selectedSpell.classes.length > 0 ? (
                  selectedSpell.classes.map((cls) => (
                    <Tag key={cls.id} color="cyan" style={styles.modalPropTag}>
                      {cls.name}
                    </Tag>
                  ))
                ) : (
                  <Text style={styles.noClassText}>{t('campaignDetail.spells.noClasses')}</Text>
                )}
              </Space>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4px 0 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
  },
  headerText: {
    flex: 1,
    minWidth: '280px',
  },
  title: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '28px',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#6B5A48',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  filterGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterSelect: {
    width: '130px',
  },
  searchInput: {
    width: '240px',
    borderRadius: '8px',
    background: '#F3EAD2',
    borderColor: '#DDD0AE',
    color: '#2B1F17',
    height: '38px',
  },
  spellCard: {
    background: 'linear-gradient(135deg, rgba(250, 243, 224, 0.95) 0%, rgba(250, 243, 224, 0.98) 100%)',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    padding: '4px',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(70, 45, 20, 0.11)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'rgba(250, 243, 224, 0.9)',
    border: '1px solid #CDBE96',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  spellName: {
    margin: '0 0 6px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
  },
  badgeRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  levelTag: {
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    background: 'rgba(250, 243, 224, 0.8)',
    margin: 0,
  },
  schoolTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: 'var(--font-body)',
    margin: 0,
  },
  rangeTag: {
    background: 'rgba(250, 243, 224, 0.6)',
    border: '1px solid #DDD0AE',
    color: '#6B5A48',
    borderRadius: '4px',
    fontSize: '10.5px',
    margin: 0,
  },
  propsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  propValue: {
    fontSize: '14px',
    color: '#2B1F17',
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
  },
  microTag: {
    fontSize: '11px',
    padding: '0 4px',
    margin: 0,
    background: '#FAF3E0',
    border: '1px solid #DDD0AE',
    color: '#8B5E2B',
  },
  description: {
    color: '#5E4E3C',
    fontSize: '12.5px',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  classRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  classTag: {
    fontSize: '10.5px',
    margin: 0,
    borderRadius: '4px',
  },
  noClassText: {
    color: '#8A7A66',
    fontSize: '13px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #DDD0AE',
    marginTop: 'auto',
  },
  inspectText: {
    fontSize: '13px',
    color: '#722B2B',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.3px',
    fontWeight: 600,
  },
  inspectArrow: {
    fontSize: '12px',
    color: '#722B2B',
  },
  emptyContainer: {
    padding: '60px 0',
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
    display: 'block',
    marginBottom: '6px',
  },
  emptySubtitle: {
    color: '#6B5A48',
    fontSize: '14px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  modalBody: {
    padding: '20px 8px 8px',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  modalIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'rgba(250, 243, 224, 0.9)',
    border: '1px solid #CDBE96',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBadgeRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  modalLevelTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 700,
    background: 'rgba(250, 243, 224, 0.8)',
  },
  modalTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
  },
  modalTitle: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '31px',
  },
  modalDivider: {
    borderColor: '#DDD0AE',
    margin: '4px 0',
  },
  mechanicsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(250, 243, 224, 0.85)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '12px',
  },
  mechItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mechLabel: {
    fontSize: '12px',
    color: '#6B5A48',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
  },
  mechVal: {
    fontSize: '16px',
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
  },
  modalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modalSectionTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: '#2B1F17',
    letterSpacing: '0.5px',
    fontWeight: 700,
  },
  modalText: {
    color: '#5E4E3C',
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0,
  },
  modalPropTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    padding: '2px 8px',
  },
};
