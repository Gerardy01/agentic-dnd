import { Card, Row, Col, Typography, Button, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  ToolOutlined,
  UserOutlined,
  FireOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import useDashboard from '@/hooks/dashboard/useDashboard';

const { Title, Text, Paragraph } = Typography;

export default function Dashboard() {
  const {
    username,
    email,
    accountId,
    handleGoToCampaigns,
    handleGoToWorkshop,
  } = useDashboard();

  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerContent}>
          <Space orientation="vertical" size={4}>
            <div style={styles.tagWrapper}>
              <Tag color="gold" style={styles.tag}>
                <CrownOutlined /> {t('global.appName')}
              </Tag>
              <Tag color="orange" style={styles.tag}>
                <SafetyCertificateOutlined /> Inscribed Adventurer
              </Tag>
            </div>
            <Title level={1} style={styles.bannerTitle}>
              {t('dashboard.welcome')}, {username}
            </Title>
            <Paragraph style={styles.bannerSubtitle}>
              {t('dashboard.subtitle')}
            </Paragraph>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]} style={styles.row}>
        {/* Campaign Card */}
        <Col xs={24} md={12}>
          <Card style={styles.actionCard} hoverable onClick={handleGoToCampaigns}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconWrapper}>
                <CompassOutlined style={styles.cardIcon} />
              </div>
              <div>
                <Title level={3} style={styles.cardTitle}>
                  {t('dashboard.activeCampaigns')}
                </Title>
                <Text style={styles.cardCategory}>AI Dungeon Master Experience</Text>
              </div>
            </div>
            <Paragraph style={styles.cardDesc}>
              {t('dashboard.activeCampaignsDesc')}
            </Paragraph>
            <Button
              type="primary"
              icon={<FireOutlined />}
              style={styles.cardBtn}
              onClick={handleGoToCampaigns}
            >
              {t('dashboard.newCampaign')}
            </Button>
          </Card>
        </Col>

        {/* Workshop Card */}
        <Col xs={24} md={12}>
          <Card style={styles.actionCard} hoverable onClick={handleGoToWorkshop}>
            <div style={styles.cardHeader}>
              <div style={styles.workshopIconWrapper}>
                <ToolOutlined style={styles.workshopIcon} />
              </div>
              <div>
                <Title level={3} style={styles.cardTitle}>
                  {t('dashboard.workshop')}
                </Title>
                <Text style={styles.cardCategory}>Creator Forge</Text>
              </div>
            </div>
            <Paragraph style={styles.cardDesc}>
              {t('dashboard.workshopDesc')}
            </Paragraph>
            <Button
              style={styles.secondaryBtn}
              icon={<ToolOutlined />}
              onClick={handleGoToWorkshop}
            >
              {t('dashboard.enterWorkshop')}
            </Button>
          </Card>
        </Col>

        {/* Adventurer Codex Card */}
        <Col xs={24}>
          <Card style={styles.profileCard}>
            <Title level={4} style={styles.profileTitle}>
              <UserOutlined style={{ color: '#D95C14', marginRight: '8px' }} />
              {t('dashboard.accountDetails')}
            </Title>
            <div style={styles.profileGrid}>
              <div style={styles.profileItem}>
                <Text style={styles.profileLabel}>{t('dashboard.email')}</Text>
                <Text style={styles.profileValue}>{email || 'N/A'}</Text>
              </div>
              <div style={styles.profileItem}>
                <Text style={styles.profileLabel}>{t('auth.usernameLabel')}</Text>
                <Text style={styles.profileValue}>{username || 'N/A'}</Text>
              </div>
              <div style={styles.profileItem}>
                <Text style={styles.profileLabel}>{t('dashboard.adventurerId')}</Text>
                <Text style={styles.profileValueMono}>{accountId || 'N/A'}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '8px 0',
  },
  banner: {
    padding: '32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #181D26 0%, #101319 100%)',
    border: '1px solid #2B3342',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    marginBottom: '28px',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerContent: {
    position: 'relative',
    zIndex: 1,
  },
  tagWrapper: {
    marginBottom: '8px',
  },
  tag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  bannerTitle: {
    margin: '8px 0',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '28px',
  },
  bannerSubtitle: {
    color: '#8D98AA',
    fontSize: '14px',
    maxWidth: '650px',
    margin: 0,
  },
  row: {
    marginTop: '4px',
  },
  actionCard: {
    background: '#151922',
    border: '1px solid #28303F',
    borderRadius: '14px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '12px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  cardIconWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'rgba(217, 92, 20, 0.15)',
    border: '1px solid rgba(217, 92, 20, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: '24px',
    color: '#D95C14',
  },
  workshopIconWrapper: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'rgba(194, 155, 56, 0.15)',
    border: '1px solid rgba(194, 155, 56, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workshopIcon: {
    fontSize: '24px',
    color: '#C29B38',
  },
  cardTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '18px',
  },
  cardCategory: {
    color: '#788497',
    fontSize: '12px',
  },
  cardDesc: {
    color: '#9CA7BA',
    fontSize: '13px',
    lineHeight: 1.6,
    minHeight: '44px',
    marginBottom: '20px',
  },
  cardBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    height: '40px',
    fontWeight: 600,
  },
  secondaryBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    height: '40px',
    fontWeight: 600,
    background: '#1D2330',
    borderColor: '#374154',
    color: '#EDE6D6',
  },
  profileCard: {
    background: '#151922',
    border: '1px solid #28303F',
    borderRadius: '14px',
    padding: '12px',
  },
  profileTitle: {
    margin: '0 0 20px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '16px',
    letterSpacing: '0.5px',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    background: '#0F1218',
    padding: '14px 18px',
    borderRadius: '10px',
    border: '1px solid #242A38',
  },
  profileLabel: {
    fontSize: '11px',
    color: '#707C91',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontFamily: "'Cinzel', serif",
  },
  profileValue: {
    color: '#EDE6D6',
    fontSize: '14px',
    fontWeight: 500,
  },
  profileValueMono: {
    color: '#C29B38',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
};
