import { Alert, Button, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  GlobalOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PushpinOutlined,
  BookOutlined,
  UserOutlined,
  SmileOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ForwardOutlined,
} from '@ant-design/icons';
import useCampaignContinuation, { 
  CAMPAIGN_MODULE_KEYS, 
  type CampaignModuleKey 
} from '@/hooks/campaign/useCampaignContinuation';
import CampaignForgeProgressModal from '@/components/campaign/create/CampaignForgeProgressModal';
import type { CampaignSuccessParameter } from '@/models/campaignInterfaces';

const { Text } = Typography;

interface CampaignStatusBannerProps {
  campaignId: number;
  successParameter: CampaignSuccessParameter;
  onContinuationComplete?: () => void;
}

const MODULE_ICON_MAP: Record<CampaignModuleKey, React.ReactNode> = {
  world: <GlobalOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  factions: <TeamOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  areas: <EnvironmentOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  pois: <PushpinOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  classes: <BookOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  races: <UserOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  npcs: <SmileOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  items: <GiftOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
  spells: <ThunderboltOutlined style={{ color: '#8B5E2B', fontSize: '15px' }} />,
};

export default function CampaignStatusBanner({
  campaignId,
  successParameter,
  onContinuationComplete,
}: CampaignStatusBannerProps) {
  const { t } = useTranslation();
  
  const {
    loading,
    errorMsg,
    progressStep,
    progressSubStep,
    progressPercent,
    progressSubPercent,
    progressCurrent,
    progressTotal,
    isAllSuccess,
    firstFailedModule,
    successParameter: currentSuccessParameter,
    continueCampaign,
  } = useCampaignContinuation(
    campaignId,
    successParameter,
    onContinuationComplete
  );

  // If all modules are complete, don't show the banner
  if (isAllSuccess && !loading) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Status Alert */}
      <Alert
        type="warning"
        showIcon
        message={t('campaigns.generationIncompleteAlertDetail')}
        description={t('campaigns.generationIncompleteDescDetail')}
        style={styles.warningAlert}
      />

      {/* Error Message */}
      {errorMsg && (
        <Alert
          message={errorMsg}
          type="error"
          showIcon
          style={styles.errorAlert}
        />
      )}

      <CampaignForgeProgressModal
        open={loading}
        percent={progressPercent}
        subPercent={progressSubPercent}
        step={progressStep}
        subStep={progressSubStep}
        stepCurrent={progressCurrent}
        stepTotal={progressTotal}
      />

      {/* Module Checklist */}
      <div style={styles.moduleList}>
        {CAMPAIGN_MODULE_KEYS.map((moduleKey) => {
          const isGenerated = !!currentSuccessParameter[moduleKey];
          const isResumePoint = moduleKey === firstFailedModule;

          return (
            <div
              key={moduleKey}
              style={{
                ...styles.moduleItem,
                ...(isResumePoint ? styles.moduleItemHighlight : {}),
              }}
            >
              <div style={styles.moduleLeft}>
                {/* Checkmark or Cross Icon */}
                <div style={styles.statusIconWrap}>
                  {isGenerated ? (
                    <CheckCircleFilled style={styles.checkIcon} />
                  ) : (
                    <CloseCircleFilled style={styles.crossIcon} />
                  )}
                </div>

                {/* Domain Icon & Title */}
                <div style={styles.moduleMeta}>
                  <div style={styles.moduleTitleRow}>
                    <span style={styles.moduleDomainIcon}>
                      {MODULE_ICON_MAP[moduleKey]}
                    </span>
                    <Text style={styles.moduleTitle}>
                      {t(`campaigns.modules.${moduleKey}`)}
                    </Text>
                  </div>
                </div>
              </div>

              <div style={styles.moduleRight}>
                {/* Status Tag */}
                <Tag
                  color={isGenerated ? 'success' : 'error'}
                  style={styles.manifestTag}
                >
                  {isGenerated ? t('campaigns.statusCompleted') : t('campaigns.statusFailed')}
                </Tag>

                {/* Continuation Button beside the module where it left off */}
                {isResumePoint && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<ForwardOutlined />}
                    loading={loading}
                    onClick={continueCampaign}
                    style={styles.inlineContinueBtn}
                  >
                    {t('campaigns.continueBtn')}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {!loading && (
        <div style={styles.buttonGroup}>
          <Button
            type="primary"
            icon={<ForwardOutlined />}
            onClick={continueCampaign}
            style={styles.continueButton}
            size="large"
          >
            {t('campaigns.continueBtn')}
          </Button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(250, 243, 224, 0.95) 0%, rgba(250, 243, 224, 0.98) 100%)',
    border: '1px solid rgba(114, 43, 43, 0.5)',
    boxShadow: '0 4px 16px rgba(114, 43, 43, 0.15)',
  },
  warningAlert: {
    marginBottom: '16px',
    borderRadius: '8px',
    background: 'rgba(114, 43, 43, 0.15)',
    border: '1px solid rgba(114, 43, 43, 0.5)',
  },
  errorAlert: {
    marginBottom: '16px',
    borderRadius: '8px',
    background: 'rgba(163, 58, 46, 0.15)',
    border: '1px solid #A33A2E',
  },
  moduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  moduleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(250, 243, 224, 0.85)',
    border: '1px solid #DDD0AE',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  moduleItemHighlight: {
    border: '1px solid rgba(114, 43, 43, 0.6)',
    background: 'linear-gradient(90deg, rgba(114, 43, 43, 0.12) 0%, rgba(250, 243, 224, 0.95) 100%)',
    boxShadow: '0 0 12px rgba(114, 43, 43, 0.2)',
  },
  moduleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#3F7D4A',
    fontSize: '16px',
    filter: 'drop-shadow(0 0 4px rgba(63, 125, 74, 0.5))',
  },
  crossIcon: {
    color: '#A33A2E',
    fontSize: '16px',
    filter: 'drop-shadow(0 0 4px rgba(163, 58, 46, 0.5))',
  },
  moduleMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  moduleTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  moduleDomainIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    color: '#2B1F17',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  moduleRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  manifestTag: {
    margin: 0,
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  inlineContinueBtn: {
    background: 'linear-gradient(135deg, #722B2B 0%, #8B5E2B 100%)',
    borderColor: '#722B2B',
    color: '#FFFFFF',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(114, 43, 43, 0.4)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '8px',
  },
  continueButton: {
    height: '42px',
    padding: '0 24px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    fontFamily: 'var(--font-body)',
    boxShadow: '0 4px 16px rgba(114, 43, 43, 0.4)',
  },
};
