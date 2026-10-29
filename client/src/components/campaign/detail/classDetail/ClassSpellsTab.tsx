import { Card, Col, Collapse, Divider, Row, Space, Tag, Typography } from 'antd';
import { FireOutlined, SafetyOutlined } from '@ant-design/icons';

// hooks
import { useTranslation } from 'react-i18next';
import useClassSpellsTab from '@/hooks/campaign/detail/classDetail/useClassSpellsTab';

// components
import ClassProgressionTags from './ClassProgressionTags';

// constants
import { getSchoolColor } from '@/constants/spells';

// interfaces
import type { SpellcastingProperties } from '@/models/classInterfaces';
import type { SpellDataReturn } from '@/models/spellInterfaces';

const { Text, Paragraph } = Typography;

interface ClassSpellsTabProps {
  spellcastingProperties: SpellcastingProperties | null;
  spells: SpellDataReturn[];
}

export default function ClassSpellsTab({
  spellcastingProperties,
  spells,
}: ClassSpellsTabProps): React.JSX.Element {

  const { groupedSpells, getLevelLabel } = useClassSpellsTab(spells);

  const { t } = useTranslation();

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {/* Spellcasting Properties */}
      {spellcastingProperties && (
        <div style={styles.infoCard}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Text style={styles.fieldLabel}>{t('campaignDetail.classes.modal.spellcastingAbility')}</Text>
              <div style={styles.fieldValue}>{spellcastingProperties.spellcastingAbility.toUpperCase()}</div>
            </Col>
            <Col xs={12} sm={6}>
              <Text style={styles.fieldLabel}>{t('campaignDetail.classes.modal.spellcastingType')}</Text>
              <div style={styles.fieldValue}>
                {spellcastingProperties.spellcastingType.replace('_', ' ').toUpperCase()}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <Text style={styles.fieldLabel}>{t('campaignDetail.classes.modal.preparationType')}</Text>
              <div style={styles.fieldValue}>{spellcastingProperties.preparationType.toUpperCase()}</div>
            </Col>
            <Col xs={12} sm={6}>
              <Text style={styles.fieldLabel}>{t('campaignDetail.classes.modal.preparedBonus')}</Text>
              <div style={styles.fieldValue}>
                {spellcastingProperties.preparedLevelBonus !== null
                  ? `${spellcastingProperties.preparedLevelBonus}%`
                  : 'N/A'}
              </div>
            </Col>
          </Row>

          {/* Cantrips & Spells Known Progression */}
          {(spellcastingProperties.maxCantripKnown.length > 0 ||
            (spellcastingProperties.maxSpellKnown?.length ?? 0) > 0) && (
            <div>
              <Divider style={styles.innerDivider} />
              {spellcastingProperties.maxCantripKnown.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <Text style={styles.progressionTitle}>
                    {t('campaignDetail.classes.modal.cantripsProgression')}
                  </Text>
                  <ClassProgressionTags keyPrefix="cantrip" progression={spellcastingProperties.maxCantripKnown} />
                </div>
              )}

              {spellcastingProperties.maxSpellKnown && spellcastingProperties.maxSpellKnown.length > 0 && (
                <div>
                  <Text style={styles.progressionTitle}>
                    {t('campaignDetail.classes.modal.spellsProgression')}
                  </Text>
                  <ClassProgressionTags keyPrefix="spell" progression={spellcastingProperties.maxSpellKnown} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Class Spell List */}
      <Collapse
        defaultActiveKey={groupedSpells.map((group) => `spell-level-${group.level}`)}
        style={styles.collapse}
        items={groupedSpells.map((group) => ({
          key: `spell-level-${group.level}`,
          label: (
            <div style={styles.collapseHeader}>
              <Tag color="orange" style={styles.levelBadge}>
                {getLevelLabel(group.level)}
              </Tag>
              <Text style={styles.levelSpellsCount}>
                {t('campaignDetail.classes.modal.spellCount', { count: group.spells.length })}
              </Text>
            </div>
          ),
          children: (
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              {group.spells.map((spell) => {
                const schoolColor = getSchoolColor(spell.school);
                return (
                  <Card
                    key={spell.id}
                    style={{ ...styles.spellCard, borderLeft: `4px solid ${schoolColor}` }}
                  >
                    <div style={styles.spellHeader}>
                      <Text strong style={styles.spellName}>
                        {spell.name}
                      </Text>
                      <div style={styles.spellTags}>
                        {spell.school && (
                          <Tag style={{ ...styles.spellTag, borderColor: schoolColor, color: schoolColor }}>
                            {spell.school.toUpperCase()}
                          </Tag>
                        )}
                        {spell.range && <Tag style={styles.rangeTag}>{spell.range}</Tag>}
                      </div>
                    </div>

                    {spell.attackProperties && (
                      <div style={styles.propsRow}>
                        <FireOutlined style={{ color: '#722B2B' }} />
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

                    {spell.spellSaveProperties && (
                      <div style={styles.propsRow}>
                        <SafetyOutlined style={{ color: '#3E6A8A' }} />
                        <Text style={styles.propValue}>
                          {t('campaignDetail.spells.saveShort', {
                            stat: spell.spellSaveProperties.savingThrowStat.toUpperCase(),
                          })}
                        </Text>
                      </div>
                    )}

                    <Paragraph style={styles.spellDesc}>
                      {spell.description || t('campaignDetail.spells.noDescription')}
                    </Paragraph>
                  </Card>
                );
              })}
            </Space>
          ),
        }))}
      />
    </Space>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  infoCard: {
    background: 'rgba(250, 243, 224, 0.6)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '16px',
  },
  fieldLabel: {
    color: '#6B5A48',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  fieldValue: {
    color: '#2B1F17',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
  },
  innerDivider: {
    borderColor: '#DDD0AE',
    margin: '12px 0',
  },
  progressionTitle: {
    color: '#8B5E2B',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    display: 'block',
    marginBottom: '6px',
    textTransform: 'uppercase',
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
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.5px',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  levelSpellsCount: {
    color: '#6B5A48',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
  },
  spellCard: {
    background: '#F3EAD2',
    border: '1px solid #DDD0AE',
    borderRadius: '6px',
    padding: '2px',
  },
  spellHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '6px',
  },
  spellName: {
    color: '#2B1F17',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
  },
  spellTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  spellTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: 'var(--font-body)',
    background: 'rgba(250, 243, 224, 0.8)',
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
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  propValue: {
    fontSize: '13px',
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
  spellDesc: {
    color: '#5E4E3C',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
};
