import { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Empty, Modal, Divider, Select, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SmileOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CommentOutlined,
  EyeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { NpcWithDetailsReturn, NpcAction } from '@/models/npcInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignNpcsTabProps {
  npcs: NpcWithDetailsReturn[];
}

export default function CampaignNpcsTab({ npcs }: CampaignNpcsTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alignmentFilter, setAlignmentFilter] = useState<string>('all');
  const [selectedNpc, setSelectedNpc] = useState<NpcWithDetailsReturn | null>(null);

  const getAlignmentColor = (alignment: string | null) => {
    if (!alignment) return 'default';
    const a = alignment.toLowerCase();
    if (a.includes('good')) return 'cyan';
    if (a.includes('evil')) return 'red';
    if (a.includes('lawful')) return 'blue';
    if (a.includes('chaotic')) return 'volcano';
    return 'gold';
  };

  const filteredNpcs = useMemo(() => {
    return npcs.filter((npc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q.trim() ||
        npc.name.toLowerCase().includes(q) ||
        (npc.race?.name && npc.race.name.toLowerCase().includes(q)) ||
        (npc.alignment && npc.alignment.toLowerCase().includes(q)) ||
        (npc.location?.poiName && npc.location.poiName.toLowerCase().includes(q)) ||
        (npc.personality && npc.personality.toLowerCase().includes(q)) ||
        (npc.mannerism && npc.mannerism.toLowerCase().includes(q));

      const matchesAlignment =
        alignmentFilter === 'all' ||
        (npc.alignment && npc.alignment.toLowerCase().includes(alignmentFilter.toLowerCase()));

      return matchesSearch && matchesAlignment;
    });
  }, [npcs, searchQuery, alignmentFilter]);

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <SmileOutlined style={{ marginRight: 8, color: '#D95C14' }} />
            {t('campaignDetail.npcs.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.npcs.subtitle')}
          </Paragraph>
        </div>

        <div style={styles.filterGroup}>
          <Select
            value={alignmentFilter}
            onChange={setAlignmentFilter}
            style={styles.alignmentSelect}
            options={[
              { value: 'all', label: 'All Alignments' },
              { value: 'good', label: 'Good' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'evil', label: 'Evil' },
            ]}
          />
          <Input
            prefix={<SearchOutlined style={{ color: '#707C91' }} />}
            placeholder={t('campaignDetail.npcs.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* NPC Cards Grid */}
      {filteredNpcs.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredNpcs.map((npc) => (
            <Col xs={24} sm={12} lg={8} key={npc.id}>
              <Card
                style={styles.npcCard}
                hoverable
                onClick={() => setSelectedNpc(npc)}
              >
                {/* Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrap}>
                    <SmileOutlined style={styles.cardIcon} />
                  </div>
                  <div style={styles.headerInfo}>
                    <Title level={4} style={styles.npcName} ellipsis={{ rows: 1 }}>
                      {npc.name}
                    </Title>
                    <div style={styles.badgeRow}>
                      {npc.race && (
                        <Tag color="orange" style={styles.raceTag}>
                          <UserOutlined style={{ marginRight: 3 }} />
                          {npc.race.name}
                        </Tag>
                      )}
                      {npc.alignment && (
                        <Tag color={getAlignmentColor(npc.alignment)} style={styles.alignmentTag}>
                          {npc.alignment}
                        </Tag>
                      )}
                      {npc.combatProfile && (
                        <Tag color="red" style={styles.combatTag}>
                          <SafetyOutlined style={{ marginRight: 3 }} />
                          CR {npc.combatProfile.crEquivalent ?? '—'}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {npc.location && (
                  <div style={styles.locationRow}>
                    <EnvironmentOutlined style={{ color: '#C29B38', marginRight: 6 }} />
                    <Text style={styles.locationText} ellipsis>
                      {npc.location.poiName}
                    </Text>
                  </div>
                )}

                {/* Personality snippet */}
                <Paragraph style={styles.personalitySnippet} ellipsis={{ rows: 2 }}>
                  {npc.personality || 'No personality notes chronicled.'}
                </Paragraph>

                {/* DM Mannerism Callout Box */}
                {npc.mannerism && (
                  <div style={styles.mannerismBox}>
                    <div style={styles.mannerismHeader}>
                      <CommentOutlined style={{ color: '#C29B38', marginRight: 4, fontSize: '11px' }} />
                      <Text style={styles.mannerismTitle}>Roleplay Mannerism</Text>
                    </div>
                    <Paragraph style={styles.mannerismText} ellipsis={{ rows: 2 }}>
                      {npc.mannerism}
                    </Paragraph>
                  </div>
                )}

                {/* Card Footer */}
                <div style={styles.cardFooter}>
                  <Text style={styles.inspectText}>{t('campaignDetail.npcs.inspectCodex')}</Text>
                  <RightOutlined style={styles.inspectArrow} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={styles.emptyContainer}>
          <Empty
            description={
              <div>
                <Text style={styles.emptyTitle}>
                  {t('campaignDetail.npcs.emptyTitle')}
                </Text>
                <Paragraph style={styles.emptySubtitle}>
                  {t('campaignDetail.npcs.emptySubtitle')}
                </Paragraph>
              </div>
            }
          />
        </div>
      )}

      {/* NPC Detail Modal */}
      {selectedNpc && (
        <Modal
          open={!!selectedNpc}
          onCancel={() => setSelectedNpc(null)}
          footer={null}
          centered
          width={740}
          styles={{
            mask: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(7, 9, 13, 0.85)',
            },
            body: styles.modalBody,
          }}
        >
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalIconWrap}>
                <SmileOutlined style={{ fontSize: '28px', color: '#D95C14' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.modalBadgeRow}>
                  {selectedNpc.race && (
                    <Tag color="orange" style={styles.modalTag}>
                      <UserOutlined style={{ marginRight: 3 }} />
                      {selectedNpc.race.name}
                    </Tag>
                  )}
                  {selectedNpc.alignment && (
                    <Tag color={getAlignmentColor(selectedNpc.alignment)} style={styles.modalTag}>
                      {selectedNpc.alignment}
                    </Tag>
                  )}
                  {selectedNpc.location && (
                    <Tag color="gold" style={styles.modalTag}>
                      <EnvironmentOutlined style={{ marginRight: 3 }} />
                      {selectedNpc.location.poiName}
                    </Tag>
                  )}
                </div>
                <Title level={2} style={styles.modalTitle}>
                  {selectedNpc.name}
                </Title>
              </div>
            </div>

            <Divider style={styles.modalDivider} />

            {/* DM Mannerisms Highlight Card */}
            {selectedNpc.mannerism && (
              <div style={styles.modalMannerismCard}>
                <div style={styles.modalMannerismHeader}>
                  <CommentOutlined style={{ color: '#D95C14', fontSize: '14px' }} />
                  <Text style={styles.modalMannerismTitle}>
                    {t('campaignDetail.npcs.modal.mannerismTitle')}
                  </Text>
                </div>
                <Paragraph style={styles.modalMannerismText}>
                  {selectedNpc.mannerism}
                </Paragraph>
              </div>
            )}

            {/* Dossier Tabs */}
            <Tabs
              defaultActiveKey="lore"
              items={[
                {
                  key: 'lore',
                  label: (
                    <span style={styles.dossierTabLabel}>
                      <EyeOutlined style={{ marginRight: 6 }} />
                      Personality & Lore
                    </span>
                  ),
                  children: (
                    <div style={styles.dossierTabContent}>
                      {selectedNpc.personality && (
                        <div style={styles.modalSection}>
                          <Text style={styles.modalSectionTitle}>
                            {t('campaignDetail.npcs.modal.personalityTitle')}
                          </Text>
                          <Paragraph style={styles.modalSectionText}>
                            {selectedNpc.personality}
                          </Paragraph>
                        </div>
                      )}

                      {selectedNpc.appearance && (
                        <div style={styles.modalSection}>
                          <Text style={styles.modalSectionTitle}>
                            {t('campaignDetail.npcs.modal.appearanceTitle')}
                          </Text>
                          <Paragraph style={styles.modalSectionText}>
                            {selectedNpc.appearance}
                          </Paragraph>
                        </div>
                      )}

                      {selectedNpc.backstory && (
                        <div style={styles.modalSection}>
                          <Text style={styles.modalSectionTitle}>
                            {t('campaignDetail.npcs.modal.backstoryTitle')}
                          </Text>
                          <Paragraph style={styles.modalSectionText}>
                            {selectedNpc.backstory}
                          </Paragraph>
                        </div>
                      )}
                    </div>
                  ),
                },
                ...(selectedNpc.combatProfile
                  ? [
                      {
                        key: 'combat',
                        label: (
                          <span style={styles.dossierTabLabel}>
                            <SafetyOutlined style={{ marginRight: 6 }} />
                            Combat Profile
                          </span>
                        ),
                        children: (
                          <div style={styles.combatContent}>
                            {/* Key Stats Bar */}
                            <div style={styles.combatStatBar}>
                              <div style={styles.combatStatItem}>
                                <Text style={styles.combatStatLabel}>{t('campaignDetail.npcs.modal.ac')}</Text>
                                <Text style={styles.combatStatValue}>{selectedNpc.combatProfile.ac}</Text>
                              </div>
                              <div style={styles.combatStatItem}>
                                <Text style={styles.combatStatLabel}>{t('campaignDetail.npcs.modal.hp')}</Text>
                                <Text style={styles.combatStatValue}>{selectedNpc.combatProfile.maxHp}</Text>
                              </div>
                              <div style={styles.combatStatItem}>
                                <Text style={styles.combatStatLabel}>{t('campaignDetail.npcs.modal.speed')}</Text>
                                <Text style={styles.combatStatValue}>{selectedNpc.combatProfile.speed} ft</Text>
                              </div>
                              <div style={styles.combatStatItem}>
                                <Text style={styles.combatStatLabel}>{t('campaignDetail.npcs.modal.cr')}</Text>
                                <Text style={styles.combatStatValue}>
                                  {selectedNpc.combatProfile.crEquivalent !== null
                                    ? selectedNpc.combatProfile.crEquivalent
                                    : '—'}
                                </Text>
                              </div>
                            </div>

                            {/* Ability Scores */}
                            {selectedNpc.combatProfile.stat && (
                              <div style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>
                                  {t('campaignDetail.npcs.modal.statsTitle')}
                                </Text>
                                <div style={styles.abilityGrid}>
                                  {Object.entries(selectedNpc.combatProfile.stat).map(([k, v]) => (
                                    <div key={k} style={styles.abilityBox}>
                                      <Text style={styles.abilityKey}>{k.toUpperCase()}</Text>
                                      <Text style={styles.abilityVal}>{String(v)}</Text>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            {selectedNpc.combatProfile.actions && selectedNpc.combatProfile.actions.length > 0 && (
                              <div style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>
                                  <ThunderboltOutlined style={{ marginRight: 6, color: '#D95C14' }} />
                                  {t('campaignDetail.npcs.modal.actionsTitle')}
                                </Text>
                                <div style={styles.actionsList}>
                                  {selectedNpc.combatProfile.actions.map((act: NpcAction, idx: number) => (
                                    <div key={idx} style={styles.actionCard}>
                                      <Text style={styles.actionName}>{act.name}</Text>
                                      <Paragraph style={styles.actionDesc}>{act.description}</Paragraph>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
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
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '0.8px',
    fontSize: '20px',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  filterGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  alignmentSelect: {
    width: '140px',
  },
  searchInput: {
    width: '260px',
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#262D3D',
    color: '#FFFFFF',
    height: '38px',
  },
  npcCard: {
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.95) 0%, rgba(14, 17, 23, 0.98) 100%)',
    border: '1px solid #232936',
    borderRadius: '12px',
    padding: '4px',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
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
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.25) 0%, rgba(194, 155, 56, 0.1) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '20px',
    color: '#D95C14',
    filter: 'drop-shadow(0 0 6px rgba(217, 92, 20, 0.6))',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  npcName: {
    margin: '0 0 6px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '16px',
  },
  badgeRow: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  raceTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: "'Cinzel', serif",
    margin: 0,
  },
  alignmentTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: "'Cinzel', serif",
    margin: 0,
  },
  combatTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    margin: 0,
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
  },
  locationText: {
    fontSize: '12px',
    color: '#C29B38',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
  },
  personalitySnippet: {
    color: '#9CA7BA',
    fontSize: '12.5px',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  mannerismBox: {
    background: 'rgba(217, 92, 20, 0.08)',
    borderLeft: '3px solid #D95C14',
    borderRadius: '4px',
    padding: '8px 10px',
    marginBottom: '12px',
  },
  mannerismHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '3px',
  },
  mannerismTitle: {
    fontSize: '10.5px',
    color: '#D95C14',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  mannerismText: {
    color: '#EDE6D6',
    fontSize: '12px',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #1E2430',
    marginTop: 'auto',
  },
  inspectText: {
    fontSize: '12px',
    color: '#D95C14',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.3px',
    fontWeight: 600,
  },
  inspectArrow: {
    fontSize: '11px',
    color: '#D95C14',
  },
  emptyContainer: {
    padding: '60px 0',
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    display: 'block',
    marginBottom: '6px',
  },
  emptySubtitle: {
    color: '#8D98AA',
    fontSize: '13px',
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
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.3) 0%, rgba(194, 155, 56, 0.15) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(217, 92, 20, 0.3)',
  },
  modalBadgeRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  modalTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
  },
  modalTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '0.8px',
    fontSize: '22px',
  },
  modalDivider: {
    borderColor: '#262D3D',
    margin: '4px 0',
  },
  modalMannerismCard: {
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.15) 0%, rgba(194, 155, 56, 0.08) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.5)',
    borderRadius: '10px',
    padding: '12px 16px',
    boxShadow: '0 0 16px rgba(217, 92, 20, 0.15)',
  },
  modalMannerismHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  modalMannerismTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    color: '#D95C14',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  modalMannerismText: {
    color: '#EDE6D6',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
    fontStyle: 'italic',
  },
  dossierTabLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
  },
  dossierTabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '8px 0',
  },
  modalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modalSectionTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    color: '#EDE6D6',
    letterSpacing: '0.5px',
    fontWeight: 700,
  },
  modalSectionText: {
    color: '#C7D0DE',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
  combatContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '8px 0',
  },
  combatStatBar: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(14, 17, 23, 0.85)',
    border: '1px solid #232936',
    borderRadius: '8px',
    padding: '12px',
  },
  combatStatItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  combatStatLabel: {
    fontSize: '11px',
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
    textTransform: 'uppercase',
  },
  combatStatValue: {
    fontSize: '18px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
  },
  abilityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    marginTop: '6px',
  },
  abilityBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(14, 17, 23, 0.7)',
    border: '1px solid #262D3D',
    borderRadius: '6px',
    padding: '6px',
  },
  abilityKey: {
    fontSize: '10px',
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
  },
  abilityVal: {
    fontSize: '14px',
    color: '#C29B38',
    fontWeight: 700,
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  actionCard: {
    background: 'rgba(14, 17, 23, 0.75)',
    border: '1px solid #232936',
    borderRadius: '6px',
    padding: '8px 12px',
  },
  actionName: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    fontWeight: 700,
    display: 'block',
    marginBottom: '2px',
  },
  actionDesc: {
    color: '#9CA7BA',
    fontSize: '12px',
    lineHeight: 1.5,
    margin: 0,
  },
};
