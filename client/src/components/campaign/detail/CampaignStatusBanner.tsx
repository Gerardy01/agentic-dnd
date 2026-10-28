import { Alert, Button, Tag, Typography, Progress } from 'antd';
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
  LoadingOutlined,
} from '@ant-design/icons';
import useCampaignContinuation, { 
  CAMPAIGN_MODULE_KEYS, 
  type CampaignModuleKey 
} from '@/hooks/campaign/useCampaignContinuation';
import type { CampaignSuccessParameter } from '@/models/campaignInterfaces';

const { Text, Paragraph } = Typography;

interface CampaignStatusBannerProps {
  campaignId: number;
  successParameter: CampaignSuccessParameter;
  onContinuationComplete?: () => void;
}

const MODULE_ICON_MAP: Record<CampaignModuleKey, React.ReactNode> = {
  world: <GlobalOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  factions: <TeamOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  areas: <EnvironmentOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  pois: <PushpinOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  classes: <BookOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  races: <UserOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  npcs: <SmileOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  items: <GiftOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
  spells: <ThunderboltOutlined style={{ color: '#C29B38', fontSize: '15px' }} />,
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
    progressPercent,
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

      {/* Live Progress Card if actively generating */}
      {loading && (
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <div style={styles.progressSpinnerWrapper}>
              <LoadingOutlined style={styles.progressSpinner} spin />
            </div>
            <div style={{ flex: 1 }}>
              <Text style={styles.progressTitle}>
                {t('campaigns.progressTitle')}
              </Text>
              <Paragraph style={styles.progressSubtitle}>
                {t('campaigns.progressSubtitle')}
              </Paragraph>
            </div>
          </div>

          <div style={styles.progressBarWrapper}>
            <Progress
              percent={progressPercent}
              strokeColor={{
                '0%': '#D95C14',
                '70%': '#C29B38',
                '100%': '#2ECC71',
              }}
              trailColor="#1A1F2B"
              size={['100%', 8]}
              status="active"
              showInfo={false}
            />
          </div>

          <div style={styles.stepBadge}>
            <Text style={styles.stepText}>
              {progressStep || t('campaigns.progressInitial')}
            </Text>
            <Text style={styles.stepPercentText}>
              {progressPercent}%
            </Text>
          </div>
        </div>
      )}

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
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.95) 0%, rgba(14, 17, 23, 0.98) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.5)',
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.15)',
  },
  warningAlert: {
    marginBottom: '16px',
    borderRadius: '8px',
    background: 'rgba(217, 92, 20, 0.15)',
    border: '1px solid rgba(217, 92, 20, 0.5)',
  },
  errorAlert: {
    marginBottom: '16px',
    borderRadius: '8px',
    background: 'rgba(192, 57, 43, 0.15)',
    border: '1px solid #C0392B',
  },
  progressCard: {
    background: 'linear-gradient(135deg, rgba(30, 22, 16, 0.85) 0%, rgba(15, 18, 24, 0.95) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.5)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 0 20px rgba(217, 92, 20, 0.15)',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  progressSpinnerWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(217, 92, 20, 0.2)',
    border: '1px solid rgba(217, 92, 20, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  progressSpinner: {
    fontSize: '18px',
    color: '#D95C14',
  },
  progressTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    fontWeight: 700,
    color: '#EDE6D6',
    letterSpacing: '0.5px',
    display: 'block',
  },
  progressSubtitle: {
    fontSize: '11px',
    color: '#8D98AA',
    margin: '2px 0 0',
    lineHeight: 1.4,
  },
  progressBarWrapper: {
    marginBottom: '10px',
  },
  stepBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(14, 17, 23, 0.8)',
    border: '1px solid #283040',
  },
  stepText: {
    fontSize: '12px',
    color: '#C29B38',
    fontFamily: "'Cinzel', monospace, serif",
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  stepPercentText: {
    fontSize: '12px',
    color: '#8D98AA',
    fontWeight: 700,
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
    background: 'rgba(18, 22, 31, 0.85)',
    border: '1px solid #232936',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  moduleItemHighlight: {
    border: '1px solid rgba(217, 92, 20, 0.6)',
    background: 'linear-gradient(90deg, rgba(217, 92, 20, 0.12) 0%, rgba(18, 22, 31, 0.95) 100%)',
    boxShadow: '0 0 12px rgba(217, 92, 20, 0.2)',
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
    color: '#2ECC71',
    fontSize: '16px',
    filter: 'drop-shadow(0 0 4px rgba(46, 204, 113, 0.5))',
  },
  crossIcon: {
    color: '#E74C3C',
    fontSize: '16px',
    filter: 'drop-shadow(0 0 4px rgba(231, 76, 60, 0.5))',
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
    color: '#EDE6D6',
    fontSize: '13px',
    fontFamily: "'Cinzel', serif",
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
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  inlineContinueBtn: {
    background: 'linear-gradient(135deg, #D95C14 0%, #C29B38 100%)',
    borderColor: '#D95C14',
    color: '#FFFFFF',
    fontFamily: "'Cinzel', serif",
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(217, 92, 20, 0.4)',
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
    fontFamily: "'Cinzel', serif",
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
};
