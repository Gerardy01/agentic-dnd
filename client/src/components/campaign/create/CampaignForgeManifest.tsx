import { Button, Tag, Typography } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ForwardOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CAMPAIGN_MODULE_KEYS, type CampaignModuleKey } from '@/hooks/campaign/useCampaignContinuation';
import type { CampaignDataReturn } from '@/models/campaignInterfaces';
import { palette } from '@/constants/theme';

const { Text } = Typography;

interface CampaignForgeManifestProps {
  creationResult: CampaignDataReturn;
  firstFailedModule: CampaignModuleKey | undefined;
  loading: boolean;
  onContinue: () => void;
}

export default function CampaignForgeManifest({
  creationResult,
  firstFailedModule,
  loading,
  onContinue,
}: CampaignForgeManifestProps) {
  const { t } = useTranslation();

  return (
    <div style={styles.list}>
      {CAMPAIGN_MODULE_KEYS.map((moduleKey) => {
        const isGenerated = !!creationResult.successParameter?.[moduleKey];
        const isResumePoint = moduleKey === firstFailedModule;

        return (
          <div
            key={moduleKey}
            style={{ ...styles.item, ...(isResumePoint ? styles.itemHighlight : {}) }}
          >
            <div style={styles.itemLeft}>
              {isGenerated ? (
                <CheckCircleFilled style={styles.checkIcon} />
              ) : (
                <CloseCircleFilled style={styles.crossIcon} />
              )}
              <Text style={styles.itemTitle}>{t(`campaigns.modules.${moduleKey}`)}</Text>
            </div>

            <div style={styles.itemRight}>
              <Tag color={isGenerated ? 'success' : 'error'} style={styles.tag}>
                {isGenerated ? t('campaigns.statusCompleted') : t('campaigns.statusFailed')}
              </Tag>
              {isResumePoint && (
                <Button
                  type="primary"
                  size="small"
                  icon={<ForwardOutlined />}
                  loading={loading}
                  onClick={onContinue}
                >
                  {t('campaigns.continueBtn')}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px 20px',
    borderBottom: `1px solid ${palette.border}`,
  },
  itemHighlight: {
    background: 'rgba(114, 43, 43, 0.06)',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  itemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemTitle: {
    color: palette.ink,
    fontWeight: 600,
    fontSize: '15px',
  },
  tag: {
    margin: 0,
    borderRadius: '999px',
  },
  checkIcon: {
    color: palette.success,
    fontSize: '18px',
  },
  crossIcon: {
    color: palette.error,
    fontSize: '18px',
  },
};
