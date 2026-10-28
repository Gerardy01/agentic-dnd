import { Card, Typography, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  CalendarOutlined,
  ReadOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { CampaignListReturn } from '@/models/campaignInterfaces';

const { Title, Text, Paragraph } = Typography;

interface CampaignCardProps {
  campaign: CampaignListReturn;
  onSelect: (campaign: CampaignListReturn) => void;
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
      className="campaign-card"
      hoverable
      onClick={() => onSelect(campaign)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.iconWrapper}>
          <CompassOutlined style={styles.cardIcon} />
        </div>
        <div style={styles.titleArea}>
          <div style={styles.badgeRow}>
            <span className="pill pill-success">
              <span className="pill-dot" />
              {t('campaigns.statusActive')}
            </span>
            {campaign.language && (
              <span className="pill">
                <GlobalOutlined />
                {campaign.language.toUpperCase()}
              </span>
            )}
          </div>
          <Title level={3} style={styles.campaignTitle} ellipsis={{ rows: 2 }}>
            {campaign.name}
          </Title>
        </div>
      </div>

      <div style={styles.promptSection}>
        <div style={styles.promptHeader}>
          <ReadOutlined style={styles.promptIcon} />
          <Text style={styles.promptLabel}>
            {campaign.worldDescription ? t('campaigns.cardWorld') : t('campaigns.cardTheme')}
          </Text>
        </div>
        <Paragraph
          style={styles.promptText}
          ellipsis={{ rows: 3, expandable: false }}
        >
          {campaign.worldDescription || campaign.themePrompt || 'A custom crafted world awaiting discovery.'}
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
    background: '#FAF3E0',
    border: '1px solid #DDD0AE',
    borderRadius: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    boxShadow: '0 2px 10px rgba(70, 45, 20, 0.06)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '14px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: '#722B2B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: '22px',
    color: '#F4EBD3',
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '8px',
  },
  statusTag: {
    fontFamily: 'var(--font-body)',
    letterSpacing: '1px',
    fontSize: '10.5px',
    borderRadius: '999px',
    padding: '1px 10px',
    textTransform: 'uppercase',
  },
  campaignTitle: {
    margin: 0,
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontSize: '26px',
    fontWeight: 700,
    lineHeight: 1.15,
  },
  promptSection: {
    background: '#F3EAD2',
    border: '1px solid #DDD0AE',
    borderRadius: '12px',
    padding: '14px',
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
    color: '#8B5E2B',
    fontSize: '12px',
  },
  promptLabel: {
    color: '#8B5E2B',
    fontSize: '11.5px',
    fontFamily: 'var(--font-body)',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  promptText: {
    color: '#5E4E3C',
    fontSize: '14px',
    lineHeight: 1.65,
    margin: 0,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #DDD0AE',
  },
  dateWrapper: {
    color: '#8A7A66',
  },
  dateIcon: {
    fontSize: '12px',
    color: '#8A7A66',
  },
  dateText: {
    whiteSpace: 'nowrap',
    fontSize: '12.5px',
    color: '#8A7A66',
    fontFamily: 'var(--font-body)',
  },
  actionBtn: {
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
    fontSize: '14px',
    fontWeight: 600,
    height: '38px',
    padding: '0 16px',
  },
};
