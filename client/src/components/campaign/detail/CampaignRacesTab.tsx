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
            <UserOutlined style={{ marginRight: 8, color: '#D95C14' }} />
            {t('campaignDetail.races.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaignDetail.races.subtitle')}
          </Paragraph>
        </div>

        <Input
          prefix={<SearchOutlined style={{ color: '#707C91' }} />}
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
                    <GlobalOutlined style={{ color: '#8D98AA', marginRight: 6, fontSize: '12px' }} />
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
              backgroundColor: 'rgba(7, 9, 13, 0.85)',
            },
            body: styles.modalBody,
          }}
        >
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div style={styles.modalIconWrap}>
                <UserOutlined style={{ fontSize: '26px', color: '#D95C14' }} />
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
                  <GlobalOutlined style={{ marginRight: 6, color: '#C29B38' }} />
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
                <ThunderboltOutlined style={{ marginRight: 6, color: '#D95C14' }} />
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
  searchInput: {
    width: '300px',
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#262D3D',
    color: '#FFFFFF',
    height: '38px',
  },
  raceCard: {
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
    marginBottom: '12px',
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
  raceName: {
    margin: '0 0 6px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '16px',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  speedTag: {
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    margin: 0,
  },
  traitsCountTag: {
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    margin: 0,
  },
  description: {
    color: '#9CA7BA',
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
    background: 'rgba(14, 17, 23, 0.7)',
    border: '1px solid #2B3342',
    color: '#C29B38',
    borderRadius: '4px',
    fontSize: '10.5px',
    padding: '0 6px',
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
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.3) 0%, rgba(194, 155, 56, 0.15) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(217, 92, 20, 0.3)',
  },
  modalBadgeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px',
  },
  modalBadgeTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  modalSpeedTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    fontWeight: 700,
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
  modalDescription: {
    color: '#C7D0DE',
    fontSize: '13.5px',
    lineHeight: 1.7,
    margin: 0,
  },
  modalLangTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    padding: '2px 8px',
  },
  traitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '6px',
  },
  traitCard: {
    background: 'rgba(14, 17, 23, 0.85)',
    border: '1px solid #232936',
    borderRadius: '8px',
    padding: '12px 14px',
    borderLeft: '3px solid #D95C14',
  },
  traitHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  traitName: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
  traitTypeTag: {
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    padding: '0 6px',
    margin: 0,
  },
  traitDescription: {
    color: '#9CA7BA',
    fontSize: '12.5px',
    lineHeight: 1.6,
    margin: 0,
  },
  noTraitsText: {
    color: '#8D98AA',
    fontSize: '12px',
    fontStyle: 'italic',
  },
};
