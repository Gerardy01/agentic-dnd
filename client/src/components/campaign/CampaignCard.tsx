import { Card, Typography, Tag, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  FireOutlined,
  CalendarOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import type { CampaignDataReturn } from '@/models/campaignInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignCardProps {
  campaign: CampaignDataReturn;
  onSelect: (campaign: CampaignDataReturn) => void;
}

export default function CampaignCard({ campaign, onSelect }: CampaignCardProps) {
  const { t } = useTranslation();

  const formattedDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <Card
      style={styles.card}
      hoverable
      onClick={() => onSelect(campaign)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.iconWrapper}>
          <CompassOutlined style={styles.cardIcon} />
        </div>
        <div style={styles.titleArea}>
          <div style={styles.badgeRow}>
            <Tag color="orange" style={styles.statusTag}>
              <FireOutlined style={{ marginRight: 4 }} />
              {t('campaigns.statusActive')}
            </Tag>
          </div>
          <Title level={3} style={styles.campaignTitle} ellipsis={{ rows: 1 }}>
            {campaign.name}
          </Title>
        </div>
      </div>

      <div style={styles.promptSection}>
        <div style={styles.promptHeader}>
          <ReadOutlined style={styles.promptIcon} />
          <Text style={styles.promptLabel}>{t('campaigns.cardTheme')}</Text>
        </div>
        <Paragraph
          style={styles.promptText}
          ellipsis={{ rows: 3, expandable: false }}
        >
          {campaign.themePrompt || 'A custom crafted world awaiting discovery.'}
        </Paragraph>
      </div>

      <div style={styles.cardFooter}>
        <Space size={6} style={styles.dateWrapper}>
          <CalendarOutlined style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {t('campaigns.cardCreated')} {formattedDate}
          </Text>
        </Space>
        <Button
          type="primary"
          icon={<CompassOutlined />}
          style={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(campaign);
          }}
        >
          {t('campaigns.cardEnter')}
        </Button>
      </div>
    </Card>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    background: 'linear-gradient(135deg, #151922 0%, #12151C 100%)',
    border: '1px solid #28303F',
    borderRadius: '14px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '14px',
  },
  iconWrapper: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'rgba(217, 92, 20, 0.15)',
    border: '1px solid rgba(217, 92, 20, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '22px',
    color: '#D95C14',
    filter: 'drop-shadow(0 0 6px rgba(217, 92, 20, 0.6))',
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    marginBottom: '4px',
  },
  statusTag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '10px',
    borderRadius: '4px',
    padding: '1px 8px',
    textTransform: 'uppercase',
  },
  campaignTitle: {
    margin: 0,
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '18px',
    letterSpacing: '0.5px',
  },
  promptSection: {
    background: 'rgba(10, 13, 18, 0.7)',
    border: '1px solid #222834',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    flex: 1,
  },
  promptHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  promptIcon: {
    color: '#C29B38',
    fontSize: '12px',
  },
  promptLabel: {
    color: '#C29B38',
    fontSize: '11px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  promptText: {
    color: '#9CA7BA',
    fontSize: '12px',
    lineHeight: 1.6,
    margin: 0,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid #222834',
  },
  dateWrapper: {
    color: '#707C91',
  },
  dateIcon: {
    fontSize: '12px',
    color: '#707C91',
  },
  dateText: {
    fontSize: '11px',
    color: '#707C91',
    fontFamily: "'Cinzel', serif",
  },
  actionBtn: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.5px',
    fontSize: '12px',
    fontWeight: 600,
    height: '34px',
    padding: '0 14px',
  },
};
