import { Progress, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { palette } from '@/constants/theme';

const { Text, Paragraph } = Typography;

interface CampaignForgeProgressProps {
  percent: number;
  subPercent: number;
  step: string;
  subStep: string;
  stepCurrent: number;
  stepTotal: number;
}

export default function CampaignForgeProgress({
  percent,
  subPercent,
  step,
  subStep,
  stepCurrent,
  stepTotal,
}: CampaignForgeProgressProps) {
  const { t } = useTranslation();

  return (
    <div style={styles.card} role="status" aria-live="polite">
      <div style={styles.header}>
        <LoadingOutlined style={styles.spinner} spin />
        <div style={{ flex: 1 }}>
          <Text style={styles.title}>{t('campaigns.progressTitle')}</Text>
          <Paragraph style={styles.subtitle}>{t('campaigns.progressSubtitle')}</Paragraph>
        </div>
      </div>

      <div style={styles.block}>
        <div style={styles.row}>
          <Text style={styles.rowLabel}>{t('campaigns.progressOverall')}</Text>
          <Text style={styles.rowPercent}>{percent}%</Text>
        </div>
        <Progress
          percent={percent}
          strokeColor={{ '0%': palette.crimson, '100%': palette.bronze }}
          trailColor={palette.chip}
          size={['100%', 12]}
          status="active"
          showInfo={false}
        />
      </div>

      <div style={styles.taskCard}>
        <div style={styles.row}>
          <Text style={styles.taskEyebrow}>
            {stepTotal > 0 && stepCurrent > 0
              ? t('campaigns.progressStepOf', { current: stepCurrent, total: stepTotal })
              : t('campaigns.progressCurrentTask')}
          </Text>
          <Text style={styles.taskPercent}>{subPercent}%</Text>
        </div>
        <div style={styles.taskStep}>{step || t('campaigns.progressInitial')}</div>
        {subStep && <div style={styles.taskSubStep}>{subStep}</div>}
        <Progress
          percent={subPercent}
          strokeColor={palette.success}
          trailColor={palette.border}
          size={['100%', 8]}
          showInfo={false}
        />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    padding: '24px',
    borderRadius: '16px',
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  spinner: {
    fontSize: '22px',
    color: palette.crimson,
    marginTop: '4px',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '24px',
    fontWeight: 700,
    color: palette.ink,
  },
  subtitle: {
    margin: 0,
    color: palette.inkMuted,
    fontSize: '14px',
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '12px',
  },
  rowLabel: {
    color: palette.ink,
    fontWeight: 700,
    fontSize: '15px',
  },
  rowPercent: {
    color: palette.crimson,
    fontWeight: 700,
    fontSize: '20px',
    fontVariantNumeric: 'tabular-nums',
  },
  taskCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '16px 18px',
    borderRadius: '12px',
    background: palette.surfaceInset,
    border: `1px solid ${palette.border}`,
  },
  taskEyebrow: {
    color: palette.bronze,
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
  taskPercent: {
    color: palette.success,
    fontWeight: 700,
    fontSize: '15px',
    fontVariantNumeric: 'tabular-nums',
  },
  taskStep: {
    fontFamily: 'var(--font-heading)',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.2,
    color: palette.ink,
  },
  taskSubStep: {
    fontSize: '16px',
    fontWeight: 600,
    color: palette.inkMuted,
    marginBottom: '6px',
  },
};
