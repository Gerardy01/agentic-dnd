import { Alert, Button, Form, Input, Select } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CompassOutlined,
  EditOutlined,
  FireOutlined,
  ForwardOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// hooks
import useCreateCampaign, {
  CAMPAIGN_PROMPT_MAX_LENGTH,
  CAMPAIGN_SEED_KEYS,
} from '@/hooks/campaign/useCreateCampaign';

// components
import CampaignForgeProgress from '@/components/campaign/create/CampaignForgeProgress';
import CampaignForgeProgressModal from '@/components/campaign/create/CampaignForgeProgressModal';
import CampaignForgeManifest from '@/components/campaign/create/CampaignForgeManifest';
import CampaignForgeSummary from '@/components/campaign/create/CampaignForgeSummary';

// constants
import { CAMPAIGN_LANGUAGE_OPTIONS } from '@/constants/selections';
import { CampaignLanguageEnum } from '@/utils/enums';
import { palette } from '@/constants/theme';

const { TextArea } = Input;

export default function CreateCampaign() {
  const {
    form,
    loading,
    errorMsg,
    progressStep,
    progressSubStep,
    progressPercent,
    progressSubPercent,
    progressCurrent,
    progressTotal,
    creationResult,
    isAllSuccess,
    firstFailedModule,
    promptValue,
    submitGenerateCampaign,
    handleContinueCampaign,
    handleFinishAndProceed,
    handleAddSeed,
    handleCancel,
  } = useCreateCampaign();

  const { t } = useTranslation();

  return (
    <div style={styles.page}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleCancel}
        disabled={loading}
        style={styles.backBtn}
      >
        {t('campaigns.createBackLink')}
      </Button>

      <div className="forge-layout">
        <section style={styles.main}>
          <div style={styles.eyebrow}>
            <CompassOutlined />
            <span>{t('campaigns.modalBadge')}</span>
          </div>
          <h1 style={styles.title}>
            {creationResult ? creationResult.name : t('campaigns.modalTitle')}
          </h1>
          <p style={styles.subtitle}>
            {creationResult ? t('campaigns.moduleStatusSubtitle') : t('campaigns.createSubtitle')}
          </p>

          {errorMsg && <Alert message={errorMsg} type="error" showIcon style={styles.alert} />}

          {!creationResult && (
            <Form
              form={form}
              layout="vertical"
              onFinish={submitGenerateCampaign}
              initialValues={{ language: CampaignLanguageEnum.EN }}
              requiredMark={false}
              disabled={loading}
            >
              <div className="forge-name-row">
                <Form.Item
                  name="name"
                  label={t('campaigns.nameLabel')}
                  rules={[
                    { required: true, message: t('campaigns.nameRequired') },
                    { max: 255, message: t('campaigns.nameMax') },
                  ]}
                >
                  <Input placeholder={t('campaigns.namePlaceholder')} maxLength={255} />
                </Form.Item>

                <Form.Item
                  name="language"
                  label={t('campaigns.languageLabel')}
                  rules={[{ required: true, message: t('campaigns.languageRequired') }]}
                >
                  <Select options={CAMPAIGN_LANGUAGE_OPTIONS} />
                </Form.Item>
              </div>

              <div style={styles.scribeNote}>
                <EditOutlined style={styles.scribeIcon} />
                <div>
                  <div style={styles.scribeTitle}>{t('campaigns.scribeNoteTitle')}</div>
                  <p style={styles.scribeText}>{t('campaigns.scribeNoteDesc')}</p>
                </div>
              </div>

              <Form.Item
                name="prompt"
                className="forge-prompt-item"
                label={
                  <span style={styles.promptLabel}>
                    <span>{t('campaigns.promptLabel')}</span>
                    <span style={styles.counter}>
                      {t('campaigns.promptCounter', {
                        count: promptValue.length,
                        max: CAMPAIGN_PROMPT_MAX_LENGTH,
                      })}
                    </span>
                  </span>
                }
                rules={[{ required: true, message: t('campaigns.promptRequired') }]}
              >
                <TextArea
                  placeholder={t('campaigns.promptPlaceholder')}
                  rows={8}
                  maxLength={CAMPAIGN_PROMPT_MAX_LENGTH}
                  style={styles.textArea}
                />
              </Form.Item>

              <div style={styles.seedsTitle}>{t('campaigns.seedsTitle')}</div>
              <div style={styles.seeds}>
                {CAMPAIGN_SEED_KEYS.map((seedKey) => (
                  <button
                    key={seedKey}
                    type="button"
                    className="forge-seed"
                    disabled={loading}
                    onClick={() => handleAddSeed(t(`campaigns.seeds.${seedKey}`))}
                  >
                    {t(`campaigns.seeds.${seedKey}`)}
                  </button>
                ))}
              </div>

              {loading && (
                <div style={styles.progressWrap}>
                  <CampaignForgeProgress
                    percent={progressPercent}
                    subPercent={progressSubPercent}
                    step={progressStep}
                    subStep={progressSubStep}
                    stepCurrent={progressCurrent}
                    stepTotal={progressTotal}
                  />
                </div>
              )}

              <div style={styles.submitArea}>
                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  loading={loading}
                  icon={<FireOutlined />}
                  style={styles.submitBtn}
                >
                  {loading ? t('campaigns.submittingBtn') : t('campaigns.submitBtn')}
                </Button>
                {!loading && <p style={styles.submitHint}>{t('campaigns.submitHint')}</p>}
              </div>
            </Form>
          )}

          {creationResult && (
            <div style={styles.manifest}>
              {isAllSuccess ? (
                <Alert type="success" showIcon message={t('campaigns.generationCompleteAlert')} />
              ) : (
                <Alert type="warning" showIcon message={t('campaigns.generationIncompleteAlert')} />
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

              <CampaignForgeManifest
                creationResult={creationResult}
                firstFailedModule={firstFailedModule}
                loading={loading}
                onContinue={handleContinueCampaign}
              />

              <div style={styles.actions}>
                {!isAllSuccess && (
                  <>
                    <Button size="large" onClick={handleFinishAndProceed} disabled={loading}>
                      {t('campaigns.enterCampaignBtn')}
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      loading={loading}
                      icon={<ForwardOutlined />}
                      onClick={handleContinueCampaign}
                    >
                      {loading ? t('campaigns.submittingBtn') : t('campaigns.continueBtn')}
                    </Button>
                  </>
                )}
                {isAllSuccess && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={handleFinishAndProceed}
                  >
                    {t('campaigns.enterCampaignBtn')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        <CampaignForgeSummary />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: '100%',
  },
  backBtn: {
    color: palette.inkMuted,
    padding: '0 8px',
    marginLeft: '-8px',
    marginBottom: '20px',
  },
  main: {
    minWidth: 0,
  },
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: palette.bronze,
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 5vw, 52px)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: palette.ink,
    margin: '0 0 16px',
  },
  subtitle: {
    color: palette.inkMuted,
    fontSize: '17px',
    maxWidth: '760px',
    marginBottom: '32px',
  },
  alert: {
    marginBottom: '20px',
    borderRadius: '12px',
  },
  scribeNote: {
    display: 'flex',
    gap: '14px',
    padding: '18px 20px',
    borderRadius: '14px',
    background: palette.surfaceInset,
    border: `1px solid ${palette.border}`,
    marginBottom: '24px',
  },
  scribeIcon: {
    color: palette.bronze,
    fontSize: '18px',
    marginTop: '4px',
  },
  scribeTitle: {
    fontWeight: 700,
    color: palette.ink,
    marginBottom: '4px',
  },
  scribeText: {
    color: palette.inkMuted,
    fontSize: '14.5px',
    margin: 0,
  },
  promptLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  counter: {
    color: palette.inkSubtle,
    fontSize: '13px',
    fontWeight: 400,
  },
  textArea: {
    resize: 'vertical',
    lineHeight: 1.7,
  },
  seedsTitle: {
    color: palette.bronze,
    fontSize: '12.5px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '4px 0 12px',
  },
  seeds: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  progressWrap: {
    marginTop: '24px',
  },
  submitArea: {
    marginTop: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  submitBtn: {
    height: '60px',
    borderRadius: '14px',
    fontSize: '20px',
    fontWeight: 700,
    boxShadow: '0 8px 22px rgba(114, 43, 43, 0.35)',
  },
  submitHint: {
    margin: 0,
    textAlign: 'center',
    color: palette.inkMuted,
    fontSize: '14px',
    maxWidth: '520px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
  },
  manifest: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
};
