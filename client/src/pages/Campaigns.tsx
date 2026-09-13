import { Typography, Button, Tag, Row, Col, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  FireOutlined,
  BookOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import useCampaigns from '@/hooks/campaign/useCampaigns';
import CampaignCard from '@/components/campaign/CampaignCard';
import GenerateCampaignModal from '@/components/campaign/GenerateCampaignModal';

const { Title, Paragraph } = Typography;

export default function Campaigns() {
  const {
    campaigns,
    isGenerateModalOpen,
    handleOpenGenerateModal,
    handleCloseGenerateModal,
    handleCampaignCreated,
    handleSelectCampaign,
  } = useCampaigns();

  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      {/* Top Header Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <div style={styles.bannerLeft}>
            <div style={styles.tagWrapper}>
              <Tag color="orange" style={styles.tag}>
                <FireOutlined style={{ marginRight: 4 }} />
                {t('campaigns.badge')}
              </Tag>
            </div>
            <Title level={1} style={styles.bannerTitle}>
              {t('campaigns.pageTitle')}
            </Title>
            <Paragraph style={styles.bannerSubtitle}>
              {t('campaigns.pageSubtitle')}
            </Paragraph>
          </div>

          <div style={styles.bannerActions}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleOpenGenerateModal}
              style={styles.generateBtn}
            >
              {t('campaigns.generateBtn')}
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns Listing or Atmospheric Empty State */}
      {campaigns.length > 0 ? (
        <Row gutter={[20, 20]} style={styles.grid}>
          {campaigns.map((campaign) => (
            <Col xs={24} sm={12} lg={8} key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                onSelect={handleSelectCampaign}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={styles.emptyCard}>
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIconWrapper}>
              <BookOutlined style={styles.emptyIcon} />
            </div>
            <Title level={3} style={styles.emptyTitle}>
              {t('campaigns.emptyTitle')}
            </Title>
            <Paragraph style={styles.emptySubtitle}>
              {t('campaigns.emptySubtitle')}
            </Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<FireOutlined />}
              onClick={handleOpenGenerateModal}
              style={styles.emptyActionBtn}
            >
              {t('campaigns.emptyAction')}
            </Button>
          </div>
        </Card>
      )}

      {/* Generate Campaign Modal */}
      <GenerateCampaignModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        onSuccess={handleCampaignCreated}
      />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '8px 0',
  },
  banner: {
    padding: '28px 32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #181D26 0%, #101319 100%)',
    border: '1px solid #2B3342',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    marginBottom: '28px',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    position: 'relative',
    zIndex: 1,
  },
  bannerLeft: {
    flex: 1,
    minWidth: '280px',
  },
  bannerActions: {
    display: 'flex',
    alignItems: 'center',
  },
  tagWrapper: {
    marginBottom: '6px',
  },
  tag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  bannerTitle: {
    margin: '4px 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '26px',
  },
  bannerSubtitle: {
    color: '#8D98AA',
    fontSize: '14px',
    maxWidth: '620px',
    margin: 0,
  },
  generateBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    height: '46px',
    padding: '0 24px',
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
  grid: {
    marginTop: '4px',
  },
  emptyCard: {
    background: 'linear-gradient(135deg, #151922 0%, #101319 100%)',
    border: '1px solid #28303F',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  emptyContainer: {
    maxWidth: '520px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'rgba(217, 92, 20, 0.12)',
    border: '1px solid rgba(217, 92, 20, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 0 24px rgba(217, 92, 20, 0.2)',
  },
  emptyIcon: {
    fontSize: '32px',
    color: '#D95C14',
  },
  emptyTitle: {
    margin: '0 0 10px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '0.5px',
    fontSize: '20px',
  },
  emptySubtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  emptyActionBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    height: '44px',
    padding: '0 24px',
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
};
