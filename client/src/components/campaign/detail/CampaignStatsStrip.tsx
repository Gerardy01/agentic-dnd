import { palette } from '@/constants/theme';

export interface CampaignStat {
  key: string;
  label: string;
  value: number;
}

interface CampaignStatsStripProps {
  stats: CampaignStat[];
}

export default function CampaignStatsStrip({ stats }: CampaignStatsStripProps) {
  return (
    <div style={styles.strip}>
      {stats.map((stat) => (
        <div key={stat.key} style={styles.stat}>
          <span style={styles.value}>{stat.value}</span>
          <span style={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  strip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))',
    gap: '20px 16px',
    padding: '26px 28px',
    borderRadius: '24px',
    background: palette.surfaceInset,
    border: `1px solid ${palette.border}`,
    marginBottom: '28px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  value: {
    fontFamily: 'var(--font-heading)',
    fontSize: '40px',
    fontWeight: 700,
    lineHeight: 1.1,
    fontVariantNumeric: 'lining-nums',
    color: palette.ink,
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '1px',
    lineHeight: 1.4,
    textTransform: 'uppercase',
    color: palette.inkMuted,
  },
};
