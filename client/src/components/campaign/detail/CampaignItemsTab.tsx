import { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Empty, Modal, Space, Divider, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  GiftOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RightOutlined,
  FireOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ItemDataReturn, StatBonus } from '@/models/itemInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignItemsTabProps {
  items: ItemDataReturn[];
}

export const RARITY_COLOR_MAP: Record<string, string> = {
  common: '#8D98AA',
  uncommon: '#2ECC71',
  rare: '#3498DB',
  very_rare: '#9B59B6',
  legendary: '#F39C12',
  artifact: '#E74C3C',
};

export default function CampaignItemsTab({ items }: CampaignItemsTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ItemDataReturn | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q.trim() ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.appearance && item.appearance.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q));

      const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesRarity =
        rarityFilter === 'all' || (item.rarity && item.rarity.toLowerCase() === rarityFilter.toLowerCase());

      return matchesSearch && matchesType && matchesRarity;
    });
  }, [items, searchQuery, typeFilter, rarityFilter]);

  const getRarityColor = (rarity: string | null) => {
    if (!rarity) return '#8D98AA';
    return RARITY_COLOR_MAP[rarity.toLowerCase()] || '#8D98AA';
  };

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <GiftOutlined style={{ marginRight: 8, color: '#D95C14' }} />
            {t('campaignDetail.items.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.items.subtitle')}
          </Paragraph>
        </div>

        <div style={styles.filterGroup}>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={styles.filterSelect}
            options={[
              { value: 'all', label: t('campaignDetail.items.allTypes') },
              { value: 'weapon', label: 'Weapons' },
              { value: 'armor', label: 'Armor' },
              { value: 'gear', label: 'Gear & Relics' },
            ]}
          />
          <Select
            value={rarityFilter}
            onChange={setRarityFilter}
            style={styles.filterSelect}
            options={[
              { value: 'all', label: t('campaignDetail.items.allRarities') },
              { value: 'common', label: 'Common' },
              { value: 'uncommon', label: 'Uncommon' },
              { value: 'rare', label: 'Rare' },
              { value: 'very_rare', label: 'Very Rare' },
              { value: 'legendary', label: 'Legendary' },
              { value: 'artifact', label: 'Artifact' },
            ]}
          />
          <Input
            prefix={<SearchOutlined style={{ color: '#707C91' }} />}
            placeholder={t('campaignDetail.items.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Items Cards Grid */}
      {filteredItems.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredItems.map((item) => {
            const rColor = getRarityColor(item.rarity);
            return (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card
                  style={{
                    ...styles.itemCard,
                    borderTop: `3px solid ${rColor}`,
                  }}
                  hoverable
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Top Name & Rarity */}
                  <div style={styles.cardHeader}>
                    <div
                      style={{
                        ...styles.iconWrap,
                        borderColor: rColor,
                        boxShadow: `0 0 12px ${rColor}33`,
                      }}
                    >
                      <GiftOutlined style={{ fontSize: '20px', color: rColor }} />
                    </div>
                    <div style={styles.headerInfo}>
                      <Title level={4} style={styles.itemName} ellipsis={{ rows: 1 }}>
                        {item.name}
                      </Title>
                      <div style={styles.badgeRow}>
                        <Tag
                          style={{
                            ...styles.rarityTag,
                            borderColor: rColor,
                            color: rColor,
                          }}
                        >
                          {(item.rarity || 'common').toUpperCase()}
                        </Tag>
                        <Tag color="default" style={styles.typeTag}>
                          {item.type.toUpperCase()}
                        </Tag>
                        {item.category && (
                          <Tag style={styles.categoryTag}>
                            {item.category}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Weapon Mechanics */}
                  {item.weaponProperties && (
                    <div style={styles.propsRow}>
                      <FireOutlined style={{ color: '#D95C14', marginRight: 4 }} />
                      <Text style={styles.propValue}>{item.weaponProperties.damage}</Text>
                      {item.weaponProperties.properties?.map((p, idx) => (
                        <Tag key={idx} style={styles.microTag}>
                          {p}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* Armor Mechanics */}
                  {item.armorProperties && (
                    <div style={styles.propsRow}>
                      <SafetyOutlined style={{ color: '#3498DB', marginRight: 4 }} />
                      <Text style={styles.propValue}>{item.armorProperties.ac} AC</Text>
                      {item.armorProperties.strRequirements > 0 && (
                        <Tag style={styles.microTag}>
                          STR {item.armorProperties.strRequirements}
                        </Tag>
                      )}
                      {item.armorProperties.stealthDisadvantage && (
                        <Tag color="volcano" style={styles.microTag}>
                          Disadvantage
                        </Tag>
                      )}
                    </div>
                  )}

                  {/* Description snippet */}
                  <Paragraph style={styles.description} ellipsis={{ rows: 2 }}>
                    {item.description || item.appearance || 'No detailed lore inscribed.'}
                  </Paragraph>

                  {/* Cost & Weight */}
                  <div style={styles.costWeightRow}>
                    <Text style={styles.costText}>
                      <DollarOutlined style={{ marginRight: 3, color: '#C29B38' }} />
                      {item.cost} gp
                    </Text>
                    <Text style={styles.weightText}>
                      {item.weight} lbs
                    </Text>
                  </div>

                  {/* Card Footer */}
                  <div style={styles.cardFooter}>
                    <Text style={styles.inspectText}>{t('campaignDetail.items.inspectCodex')}</Text>
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
                <Text style={styles.emptyTitle}>
                  {t('campaignDetail.items.emptyTitle')}
                </Text>
                <Paragraph style={styles.emptySubtitle}>
                  {t('campaignDetail.items.emptySubtitle')}
                </Paragraph>
              </div>
            }
          />
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <Modal
          open={!!selectedItem}
          onCancel={() => setSelectedItem(null)}
          footer={null}
          centered
          width={680}
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
              <div
                style={{
                  ...styles.modalIconWrap,
                  borderColor: getRarityColor(selectedItem.rarity),
                }}
              >
                <GiftOutlined style={{ fontSize: '26px', color: getRarityColor(selectedItem.rarity) }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.modalBadgeRow}>
                  <Tag
                    style={{
                      ...styles.modalRarityTag,
                      borderColor: getRarityColor(selectedItem.rarity),
                      color: getRarityColor(selectedItem.rarity),
                    }}
                  >
                    {(selectedItem.rarity || 'common').toUpperCase()}
                  </Tag>
                  <Tag color="orange" style={styles.modalTag}>
                    {selectedItem.type.toUpperCase()}
                  </Tag>
                  {selectedItem.equipSlot && (
                    <Tag color="gold" style={styles.modalTag}>
                      {selectedItem.equipSlot}
                    </Tag>
                  )}
                </div>
                <Title level={2} style={styles.modalTitle}>
                  {selectedItem.name}
                </Title>
              </div>
            </div>

            <Divider style={styles.modalDivider} />

            {/* Mechanics Bar */}
            <div style={styles.mechanicsBar}>
              <div style={styles.mechItem}>
                <Text style={styles.mechLabel}>{t('campaignDetail.items.cost')}</Text>
                <Text style={styles.mechVal}>{selectedItem.cost} gp</Text>
              </div>
              <div style={styles.mechItem}>
                <Text style={styles.mechLabel}>{t('campaignDetail.items.weight')}</Text>
                <Text style={styles.mechVal}>{selectedItem.weight} lbs</Text>
              </div>
              {selectedItem.weaponProperties && (
                <div style={styles.mechItem}>
                  <Text style={styles.mechLabel}>{t('campaignDetail.items.modal.damage')}</Text>
                  <Text style={{ ...styles.mechVal, color: '#D95C14' }}>
                    {selectedItem.weaponProperties.damage}
                  </Text>
                </div>
              )}
              {selectedItem.armorProperties && (
                <div style={styles.mechItem}>
                  <Text style={styles.mechLabel}>{t('campaignDetail.items.modal.ac')}</Text>
                  <Text style={{ ...styles.mechVal, color: '#3498DB' }}>
                    +{selectedItem.armorProperties.ac}
                  </Text>
                </div>
              )}
            </div>

            {/* Weapon Properties */}
            {selectedItem.weaponProperties?.properties && selectedItem.weaponProperties.properties.length > 0 && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {t('campaignDetail.items.modal.properties')}
                </Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={[6, 6]} wrap>
                    {selectedItem.weaponProperties.properties.map((p, idx) => (
                      <Tag key={idx} color="orange" style={styles.modalPropTag}>
                        {p}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}

            {/* Description */}
            {selectedItem.description && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {t('campaignDetail.items.modal.descriptionTitle')}
                </Text>
                <Paragraph style={styles.modalText}>
                  {selectedItem.description}
                </Paragraph>
              </div>
            )}

            {/* Appearance */}
            {selectedItem.appearance && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  {t('campaignDetail.items.modal.appearanceTitle')}
                </Text>
                <Paragraph style={styles.modalText}>
                  {selectedItem.appearance}
                </Paragraph>
              </div>
            )}

            {/* Stat Bonuses */}
            {selectedItem.flatBonus && selectedItem.flatBonus.length > 0 && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  <ThunderboltOutlined style={{ marginRight: 6, color: '#C29B38' }} />
                  {t('campaignDetail.items.modal.statBonusesTitle')}
                </Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={[6, 6]} wrap>
                    {selectedItem.flatBonus.map((b: StatBonus, idx: number) => (
                      <Tag key={idx} color="green" style={styles.modalPropTag}>
                        +{b.value} {b.modifier}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}
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
  filterSelect: {
    width: '130px',
  },
  searchInput: {
    width: '240px',
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#262D3D',
    color: '#FFFFFF',
    height: '38px',
  },
  itemCard: {
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
    background: 'rgba(14, 17, 23, 0.9)',
    border: '1px solid #303747',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
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
  rarityTag: {
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    background: 'rgba(14, 17, 23, 0.8)',
    margin: 0,
  },
  typeTag: {
    borderRadius: '4px',
    fontSize: '10.5px',
    fontFamily: "'Cinzel', serif",
    margin: 0,
  },
  categoryTag: {
    background: 'rgba(14, 17, 23, 0.6)',
    border: '1px solid #283040',
    color: '#8D98AA',
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
    fontSize: '13px',
    color: '#EDE6D6',
    fontWeight: 700,
    fontFamily: "'Cinzel', serif",
  },
  microTag: {
    fontSize: '10px',
    padding: '0 4px',
    margin: 0,
    background: '#151922',
    border: '1px solid #2B3342',
    color: '#C29B38',
  },
  description: {
    color: '#9CA7BA',
    fontSize: '12.5px',
    lineHeight: 1.5,
    marginBottom: '10px',
  },
  costWeightRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    borderRadius: '6px',
    background: 'rgba(14, 17, 23, 0.6)',
    marginBottom: '10px',
  },
  costText: {
    fontSize: '12px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
  },
  weightText: {
    fontSize: '11px',
    color: '#8D98AA',
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
    background: 'rgba(14, 17, 23, 0.9)',
    border: '1px solid #303747',
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
  modalRarityTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    fontWeight: 700,
    background: 'rgba(14, 17, 23, 0.8)',
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
  mechanicsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(14, 17, 23, 0.85)',
    border: '1px solid #232936',
    borderRadius: '8px',
    padding: '12px',
  },
  mechItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mechLabel: {
    fontSize: '11px',
    color: '#8D98AA',
    fontFamily: "'Cinzel', serif",
    textTransform: 'uppercase',
  },
  mechVal: {
    fontSize: '16px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
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
  modalText: {
    color: '#C7D0DE',
    fontSize: '13px',
    lineHeight: 1.6,
    margin: 0,
  },
  modalPropTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    padding: '2px 8px',
  },
};
