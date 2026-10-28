import { Typography } from 'antd';
import {
  CheckOutlined,
  CompassOutlined,
  SafetyOutlined,
  ToolOutlined,
  CrownOutlined,
  UserOutlined,
  GiftOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { palette } from '@/constants/theme';

const { Text, Paragraph } = Typography;

const FORGE_ITEMS = [
  { key: 'world', icon: <CompassOutlined /> },
  { key: 'factions', icon: <SafetyOutlined /> },
  { key: 'classes', icon: <ToolOutlined /> },
  { key: 'races', icon: <CrownOutlined /> },
  { key: 'npcs', icon: <UserOutlined /> },
  { key: 'items', icon: <GiftOutlined /> },
  { key: 'spells', icon: <ThunderboltOutlined /> },
] as const;

export default function CampaignForgeSummary() {
  const { t } = useTranslation();

  return (
    <aside style={styles.card}>
      <h2 style={styles.title}>{t('campaigns.forgeTitle')}</h2>
      <Paragraph style={styles.subtitle}>{t('campaigns.forgeSubtitle')}</Paragraph>

      <ul style={styles.list}>
        {FORGE_ITEMS.map(({ key, icon }) => (
          <li key={key} style={styles.item}>
            <span style={styles.iconBox}>{icon}</span>
            <div style={styles.itemText}>
              <Text style={styles.itemTitle}>{t(`campaigns.forgeItems.${key}.title`)}</Text>
              <Text style={styles.itemDesc}>{t(`campaigns.forgeItems.${key}.desc`)}</Text>
            </div>
          </li>
        ))}
      </ul>

      <div style={styles.note}>
        <CheckOutlined style={styles.noteIcon} />
        <Text style={styles.noteText}>{t('campaigns.forgeResumeNote')}</Text>
      </div>
    </aside>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    padding: '28px',
    borderRadius: '20px',
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    alignSelf: 'start',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 6px',
    color: palette.ink,
  },
  subtitle: {
    color: palette.inkMuted,
    fontSize: '14px',
    marginBottom: '18px',
  },
  list: {
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 0',
    borderTop: `1px solid ${palette.border}`,
  },
  iconBox: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    borderRadius: '12px',
    background: palette.chip,
    color: palette.bronze,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  itemText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.4,
  },
  itemTitle: {
    fontWeight: 700,
    color: palette.ink,
    fontSize: '15px',
  },
  itemDesc: {
    color: palette.inkMuted,
    fontSize: '13px',
  },
  note: {
    display: 'flex',
    gap: '10px',
    paddingTop: '16px',
    borderTop: `1px solid ${palette.border}`,
  },
  noteIcon: {
    color: palette.success,
    marginTop: '4px',
  },
  noteText: {
    color: palette.inkMuted,
    fontSize: '13px',
  },
};
