import { Typography, Button, Row, Col, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  FireOutlined,
  BookOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import useCampaigns from '@/hooks/campaign/useCampaigns';
import CampaignCard from '@/components/campaign/CampaignCard';
import { palette } from '@/constants/theme';

const { Paragraph } = Typography;

export default function Campaigns() {
  const {
    campaigns,
    loading,
    handleCreateCampaign,
    handleSelectCampaign,
  } = useCampaigns();

  const { t } = useTranslation();

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.headerText}>
          <div style={styles.eyebrow}>
            <FireOutlined />
            <span>{t('campaigns.badge')}</span>
          </div>
          <h1 style={styles.title}>{t('campaigns.pageTitle')}</h1>
          <p style={styles.subtitle}>{t('campaigns.pageSubtitle')}</p>
        </div>

        {campaigns.length > 0 && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateCampaign}
          >
            {t('campaigns.generateBtn')}
          </Button>
        )}
      </header>

      {loading ? (
        <div style={styles.loadingContainer}>
          <Spin size="large" />
          <Paragraph style={styles.loadingText}>
            {t('campaigns.loadingCampaigns')}
          </Paragraph>
        </div>
      ) : campaigns.length > 0 ? (
        <Row gutter={[24, 24]}>
          {campaigns.map((campaign) => (
            <Col xs={24} md={12} xl={8} key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                onSelect={handleSelectCampaign}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIconWrapper}>
            <BookOutlined style={styles.emptyIcon} />
          </div>
          <h2 style={styles.emptyTitle}>{t('campaigns.emptyTitle')}</h2>
          <Paragraph style={styles.emptySubtitle}>
            {t('campaigns.emptySubtitle')}
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<FireOutlined />}
            onClick={handleCreateCampaign}
          >
            {t('campaigns.emptyAction')}
          </Button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '36px',
  },
  headerText: {
    flex: 1,
    minWidth: '280px',
  },
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: palette.bronze,
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 5vw, 52px)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: palette.ink,
    margin: '0 0 12px',
  },
  subtitle: {
    color: palette.inkMuted,
    fontSize: '17px',
    maxWidth: '680px',
    margin: 0,
  },
  emptyCard: {
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: '24px',
    padding: '64px 24px',
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyIconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: palette.crimson,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  emptyIcon: {
    fontSize: '32px',
    color: '#F4EBD3',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '32px',
    color: palette.ink,
    margin: '0 0 12px',
  },
  emptySubtitle: {
    color: palette.inkMuted,
    fontSize: '16px',
    marginBottom: '28px',
  },
  loadingContainer: {
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  loadingText: {
    color: palette.inkMuted,
    margin: 0,
  },
};
