import { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Empty, Modal, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  RightOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import type { RaceDataReturn, RaceTrait } from '@/models/raceInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignRacesTabProps {
  races: RaceDataReturn[];
}

export default function CampaignRacesTab({ races }: CampaignRacesTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<RaceDataReturn | null>(null);

  const filteredRaces = useMemo(() => {
    if (!searchQuery.trim()) return races;
    const q = searchQuery.toLowerCase();
    return races.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        r.languages?.some((l) => l.toLowerCase().includes(q)) ||
        r.traits?.some((trait) => trait.name.toLowerCase().includes(q) || trait.description.toLowerCase().includes(q))
    );
  }, [races, searchQuery]);

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <Title level={3} style={styles.title}>
            <UserOutlined style={{ marginRight: 8, color: '#722B2B' }} />
            {t('campaignDetail.races.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.races.subtitle')}
          </Paragraph>
        </div>

        <Input
          prefix={<SearchOutlined style={{ color: '#8A7A66' }} />}
          placeholder={t('campaignDetail.races.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          style={styles.searchInput}
        />
      </div>

      {/* Race Cards Grid */}
      {filteredRaces.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredRaces.map((race) => (
            <Col xs={24} sm={12} lg={8} key={race.id}>
              <Card
                style={styles.raceCard}
                hoverable
                onClick={() => setSelectedRace(race)}
              >
                {/* Top Name & Speed */}
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrap}>
                    <UserOutlined style={styles.cardIcon} />
                  </div>
                  <div style={styles.headerInfo}>
                    <Title level={4} style={styles.raceName} ellipsis={{ rows: 1 }}>
                      {race.name}
                    </Title>
                    <div style={styles.badgeRow}>
                      <Tag color="gold" style={styles.speedTag}>
                        <DashboardOutlined style={{ marginRight: 4 }} />
                        {race.speed} ft
                      </Tag>
                      <Tag color="blue" style={styles.traitsCountTag}>
                        <ThunderboltOutlined style={{ marginRight: 3 }} />
                        {race.traits?.length || 0} {t('campaignDetail.races.traitsCount')}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <Paragraph style={styles.description} ellipsis={{ rows: 3 }}>
                  {race.description || 'No lore description inscribed.'}
                </Paragraph>

                {/* Languages preview */}
                {race.languages && race.languages.length > 0 && (
                  <div style={styles.languagesPreview}>
                    <GlobalOutlined style={{ color: '#6B5A48', marginRight: 6, fontSize: '13px' }} />
                    <Space size={[4, 4]} wrap>
                      {race.languages.map((lang, idx) => (
                        <Tag key={idx} style={styles.langTag}>
                          {lang}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {/* Footer hint */}
                <div style={styles.cardFooter}>
                  <Text style={styles.inspectText}>{t('campaignDetail.races.inspectCodex')}</Text>
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
                  {t('campaignDetail.races.emptyTitle')}
                </Text>
                <Paragraph style={styles.emptySubtitle}>
                  {t('campaignDetail.races.emptySubtitle')}
                </Paragraph>
              </div>
            }
          />
        </div>
      )}

      {/* Race Detail Modal */}
      {selectedRace && (
        <Modal
          open={!!selectedRace}
          onCancel={() => setSelectedRace(null)}
          footer={null}
          centered
          width={700}
          styles={{
            mask: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(43, 31, 23, 0.85)',
            },
            body: styles.modalBody,
          }}
        >
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalIconWrap}>
                <UserOutlined style={{ fontSize: '26px', color: '#722B2B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.modalBadgeRow}>
                  <Tag color="orange" style={styles.modalBadgeTag}>
                    {t('campaignDetail.races.modal.title')}
                  </Tag>
                  <Tag color="gold" style={styles.modalSpeedTag}>
                    <DashboardOutlined style={{ marginRight: 4 }} />
                    {selectedRace.speed} ft Speed
                  </Tag>
                </div>
                <Title level={2} style={styles.modalTitle}>
                  {selectedRace.name}
                </Title>
              </div>
            </div>

            <Divider style={styles.modalDivider} />

            {/* Description */}
            <div style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                {t('campaignDetail.races.modal.descriptionTitle')}
              </Text>
              <Paragraph style={styles.modalDescription}>
                {selectedRace.description || 'No heritage description inscribed.'}
              </Paragraph>
            </div>

            {/* Native Languages */}
            {selectedRace.languages && selectedRace.languages.length > 0 && (
              <div style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  <GlobalOutlined style={{ marginRight: 6, color: '#8B5E2B' }} />
                  {t('campaignDetail.races.modal.languagesTitle')}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Space size={[6, 6]} wrap>
                    {selectedRace.languages.map((lang, idx) => (
                      <Tag key={idx} color="blue" style={styles.modalLangTag}>
                        {lang}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            )}

            {/* Racial Traits */}
            <div style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                <ThunderboltOutlined style={{ marginRight: 6, color: '#722B2B' }} />
                {t('campaignDetail.races.modal.traitsTitle')}
              </Text>

              {selectedRace.traits && selectedRace.traits.length > 0 ? (
                <div style={styles.traitsList}>
                  {selectedRace.traits.map((trait: RaceTrait, index: number) => (
                    <div key={index} style={styles.traitCard}>
                      <div style={styles.traitHeader}>
                        <Text style={styles.traitName}>{trait.name}</Text>
                        <Tag
                          color={trait.type === 'active' ? 'volcano' : 'cyan'}
                          style={styles.traitTypeTag}
                        >
                          {trait.type.toUpperCase()}
                        </Tag>
                      </div>
                      <Paragraph style={styles.traitDescription}>
                        {trait.description}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              ) : (
                <Text style={styles.noTraitsText}>
                  {t('campaignDetail.races.modal.noTraits')}
                </Text>
              )}
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
  searchInput: {
    width: '300px',
    borderRadius: '8px',
    background: '#F3EAD2',
    borderColor: '#DDD0AE',
    color: '#2B1F17',
    height: '38px',
  },
  raceCard: {
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
    marginBottom: '12px',
  },
  iconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(114, 43, 43, 0.25) 0%, rgba(139, 94, 43, 0.1) 100%)',
    border: '1px solid rgba(114, 43, 43, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '20px',
    color: '#722B2B',
    filter: 'drop-shadow(0 0 6px rgba(114, 43, 43, 0.6))',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  raceName: {
    margin: '0 0 6px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  speedTag: {
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    margin: 0,
  },
  traitsCountTag: {
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    margin: 0,
  },
  description: {
    color: '#5E4E3C',
    fontSize: '12.5px',
    lineHeight: 1.6,
    marginBottom: '12px',
    minHeight: '60px',
  },
  languagesPreview: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '14px',
  },
  langTag: {
    background: 'rgba(250, 243, 224, 0.7)',
    border: '1px solid #DDD0AE',
    color: '#8B5E2B',
    borderRadius: '4px',
    fontSize: '10.5px',
    padding: '0 6px',
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
    gap: '16px',
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
    background: 'linear-gradient(135deg, rgba(114, 43, 43, 0.3) 0%, rgba(139, 94, 43, 0.15) 100%)',
    border: '1px solid rgba(114, 43, 43, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(114, 43, 43, 0.3)',
  },
  modalBadgeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px',
  },
  modalBadgeTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  modalSpeedTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    fontWeight: 700,
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
  modalDescription: {
    color: '#5E4E3C',
    fontSize: '13.5px',
    lineHeight: 1.7,
    margin: 0,
  },
  modalLangTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    padding: '2px 8px',
  },
  traitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '6px',
  },
  traitCard: {
    background: 'rgba(250, 243, 224, 0.85)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    padding: '12px 14px',
    borderLeft: '3px solid #722B2B',
  },
  traitHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  traitName: {
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
  traitTypeTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    padding: '0 6px',
    margin: 0,
  },
  traitDescription: {
    color: '#5E4E3C',
    fontSize: '12.5px',
    lineHeight: 1.6,
    margin: 0,
  },
  noTraitsText: {
    color: '#6B5A48',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};
