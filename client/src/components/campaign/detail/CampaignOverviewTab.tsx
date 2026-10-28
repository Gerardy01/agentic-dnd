import { Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  SafetyOutlined,
  ToolOutlined,
  CrownOutlined,
  UserOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  CalendarOutlined,
  RightOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import type { CampaignListReturn } from '@/models/campaignInterfaces';
import { palette } from '@/constants/theme';

const { Paragraph, Text } = Typography;

interface CampaignOverviewTabProps {
  campaign: CampaignListReturn;
  areasCount: number;
  poisCount: number;
  factionsCount: number;
  classesCount?: number;
  racesCount?: number;
  npcsCount?: number;
  itemsCount?: number;
  spellsCount?: number;
  onNavigateToMap: () => void;
  onNavigateToFactions: () => void;
  onNavigateToClasses?: () => void;
  onNavigateToRaces?: () => void;
  onNavigateToNpcs?: () => void;
  onNavigateToItems?: () => void;
  onNavigateToSpells?: () => void;
}

export default function CampaignOverviewTab({
  campaign,
  areasCount,
  factionsCount,
  classesCount = 0,
  racesCount = 0,
  npcsCount = 0,
  itemsCount = 0,
  spellsCount = 0,
  onNavigateToMap,
  onNavigateToFactions,
  onNavigateToClasses,
  onNavigateToRaces,
  onNavigateToNpcs,
  onNavigateToItems,
  onNavigateToSpells,
}: CampaignOverviewTabProps) {
  const { t } = useTranslation();

  const formattedDate = campaign.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const quickLinks = [
    { key: 'map', icon: <CompassOutlined />, label: t('campaignDetail.tabMap'), badge: t('campaignDetail.areasCount', { count: areasCount }), onClick: onNavigateToMap },
    { key: 'factions', icon: <SafetyOutlined />, label: t('campaignDetail.tabFactions'), badge: String(factionsCount), onClick: onNavigateToFactions },
    { key: 'classes', icon: <ToolOutlined />, label: t('campaignDetail.tabClasses'), badge: String(classesCount), onClick: onNavigateToClasses },
    { key: 'races', icon: <CrownOutlined />, label: t('campaignDetail.tabRaces'), badge: String(racesCount), onClick: onNavigateToRaces },
    { key: 'npcs', icon: <UserOutlined />, label: t('campaignDetail.tabNpcs'), badge: String(npcsCount), onClick: onNavigateToNpcs },
    { key: 'items', icon: <GiftOutlined />, label: t('campaignDetail.tabItems'), badge: String(itemsCount), onClick: onNavigateToItems },
    { key: 'spells', icon: <ThunderboltOutlined />, label: t('campaignDetail.tabSpells'), badge: String(spellsCount), onClick: onNavigateToSpells },
  ];

  return (
    <div className="overview-layout">
      <section style={styles.lore}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitleRow}>
            <ReadOutlined style={styles.sectionIcon} />
            <h2 style={styles.sectionTitle}>{t('campaignDetail.worldDescriptionTitle')}</h2>
          </div>
          <Button type="link" onClick={onNavigateToMap} style={styles.linkButton}>
            {t('campaignDetail.viewWorldMap')} <ArrowRightOutlined />
          </Button>
        </div>

        <Paragraph style={styles.narrativeText}>
          {campaign.worldDescription ||
            'The cartographers and chronicles are actively mapping this world. Open the World Map to view specific areas, points of interest, and regional lore.'}
        </Paragraph>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>
            <CalendarOutlined />
            {t('campaignDetail.inscribed', { date: formattedDate })}
          </span>
        </div>

        <div style={styles.visionBlock}>
          <div style={styles.visionLabel}>{t('campaignDetail.themePromptTitle')}</div>
          <Paragraph style={styles.visionText}>
            {campaign.themePrompt || 'A personalized bespoke world created for your adventure.'}
          </Paragraph>
        </div>
      </section>

      <aside style={styles.side}>
        <h2 style={styles.sideTitle}>{t('campaignDetail.actions.launchSession')}</h2>
        <Paragraph style={styles.sideSubtitle}>{t('campaignDetail.enterAdventureDesc')}</Paragraph>

        <Button
          type="primary"
          size="large"
          block
          onClick={onNavigateToMap}
          style={styles.primaryBtn}
        >
          {t('campaignDetail.exploreMapBtn')} <ArrowRightOutlined />
        </Button>

        <ul style={styles.linkList}>
          {quickLinks.filter((link) => link.onClick).map((link) => (
            <li key={link.key}>
              <button type="button" className="overview-link" onClick={link.onClick}>
                <span style={styles.linkIcon}>{link.icon}</span>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <span className="tab-count">{link.badge}</span>
                <RightOutlined style={styles.linkChevron} />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  lore: {
    padding: '32px 36px',
    minWidth: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionIcon: {
    color: palette.bronze,
    fontSize: '20px',
  },
  sectionTitle: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: '26px',
    fontWeight: 700,
    color: palette.ink,
  },
  linkButton: {
    color: palette.crimson,
    fontWeight: 700,
    padding: 0,
    textDecoration: 'underline',
  },
  narrativeText: {
    color: palette.ink,
    fontSize: '17px',
    lineHeight: 1.9,
    marginBottom: '24px',
    whiteSpace: 'pre-line',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    paddingTop: '20px',
    borderTop: `1px solid ${palette.border}`,
    marginBottom: '24px',
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: palette.inkMuted,
    fontSize: '14px',
    fontWeight: 500,
  },
  visionBlock: {
    padding: '18px 20px',
    borderRadius: '14px',
    background: palette.surfaceInset,
    border: `1px solid ${palette.border}`,
  },
  visionLabel: {
    color: palette.bronze,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  visionText: {
    margin: 0,
    color: palette.inkMuted,
    fontSize: '15px',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  side: {
    padding: '32px 36px',
    minWidth: 0,
  },
  sideTitle: {
    margin: '0 0 8px',
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: palette.ink,
  },
  sideSubtitle: {
    color: palette.inkMuted,
    fontSize: '15px',
    marginBottom: '20px',
  },
  primaryBtn: {
    height: '52px',
    borderRadius: '12px',
    fontSize: '16px',
    marginBottom: '20px',
  },
  linkList: {
    listStyle: 'none',
  },
  linkIcon: {
    color: palette.bronze,
    fontSize: '18px',
    width: '24px',
  },
  linkLabel: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '16px',
    color: palette.ink,
  },
  linkChevron: {
    color: palette.inkSubtle,
    fontSize: '12px',
  },
};
