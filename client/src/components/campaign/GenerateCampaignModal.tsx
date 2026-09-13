import { Modal, Form, Input, Button, Alert, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  FireOutlined,
  CompassOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import useGenerateCampaignModal from '@/hooks/campaign/useGenerateCampaignModal';
import type { CampaignDataReturn } from '@/models/campaignInterfaces';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface GenerateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (campaign: CampaignDataReturn) => void;
}

export default function GenerateCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: GenerateCampaignModalProps) {
  const { form, loading, errorMsg, submitGenerateCampaign, handleCloseModal } =
    useGenerateCampaignModal(onClose, onSuccess);
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      onCancel={loading ? undefined : handleCloseModal}
      footer={null}
      centered
      width={640}
      closable={!loading}
      closeIcon={<CloseOutlined style={styles.closeIcon} />}
      styles={{
        mask: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(7, 9, 13, 0.85)',
        },
        body: styles.modalBody,
      }}
    >
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.badgeWrapper}>
            <div style={styles.logoBadge}>
              <FireOutlined style={styles.logoIcon} />
            </div>
            <Tag color="orange" style={styles.tag}>
              <CompassOutlined style={{ marginRight: 4 }} />
              {t('campaigns.modalBadge')}
            </Tag>
          </div>
          <Title level={2} style={styles.title}>
            {t('campaigns.modalTitle')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('campaigns.modalSubtitle')}
          </Paragraph>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={styles.alert}
          />
        )}

        {/* Form Section */}
        <Form
          form={form}
          layout="vertical"
          onFinish={submitGenerateCampaign}
          requiredMark={false}
          style={styles.form}
        >
          {/* Campaign Name Field */}
          <Form.Item
            name="name"
            label={
              <span style={styles.label}>
                <BookOutlined style={styles.labelIcon} />
                {t('campaigns.nameLabel')}
              </span>
            }
            rules={[
              { required: true, message: t('campaigns.nameRequired') },
              { max: 255, message: t('campaigns.nameMax') },
            ]}
          >
            <Input
              placeholder={t('campaigns.namePlaceholder')}
              size="large"
              maxLength={255}
              disabled={loading}
              style={styles.input}
            />
          </Form.Item>

          {/* Guide Card Explaining The Prompt Purpose */}
          <div style={styles.guideCard}>
            <div style={styles.guideHeader}>
              <InfoCircleOutlined style={styles.guideIcon} />
              <Text style={styles.guideTitle}>
                {t('campaigns.promptGuideTitle')}
              </Text>
            </div>
            <Paragraph style={styles.guideText}>
              {t('campaigns.promptGuideDesc')}
            </Paragraph>
          </div>

          {/* Prompt Multiline Textarea Field */}
          <Form.Item
            name="prompt"
            label={
              <span style={styles.label}>
                <CompassOutlined style={styles.labelIcon} />
                {t('campaigns.promptLabel')}
              </span>
            }
            rules={[{ required: true, message: t('campaigns.promptRequired') }]}
          >
            <TextArea
              placeholder={t('campaigns.promptPlaceholder')}
              autoSize={{ minRows: 4, maxRows: 8 }}
              disabled={loading}
              style={styles.textArea}
            />
          </Form.Item>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <Button
              onClick={handleCloseModal}
              disabled={loading}
              style={styles.cancelButton}
            >
              {t('global.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<FireOutlined />}
              style={styles.submitButton}
            >
              {loading ? t('campaigns.submittingBtn') : t('campaigns.submitBtn')}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalBody: {
    padding: '16px 8px 8px',
  },
  closeIcon: {
    color: '#8D98AA',
    fontSize: '16px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  badgeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.3) 0%, rgba(194, 155, 56, 0.15) 100%)',
    border: '1px solid rgba(217, 92, 20, 0.8)',
    boxShadow: '0 0 24px rgba(217, 92, 20, 0.4)',
  },
  logoIcon: {
    fontSize: '26px',
    color: '#D95C14',
    filter: 'drop-shadow(0 0 6px rgba(217, 92, 20, 0.8))',
  },
  tag: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: '1px',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '11px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '4px 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '22px',
  },
  subtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.6,
    maxWidth: '520px',
    margin: '0 auto',
  },
  alert: {
    marginBottom: '16px',
    borderRadius: '8px',
    background: 'rgba(192, 57, 43, 0.15)',
    border: '1px solid #C0392B',
  },
  form: {
    marginTop: '4px',
  },
  label: {
    color: '#EDE6D6',
    fontSize: '13px',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '0.5px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    color: '#D95C14',
  },
  input: {
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#303747',
    fontSize: '14px',
    color: '#FFFFFF',
  },
  textArea: {
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#303747',
    fontSize: '13px',
    color: '#FFFFFF',
    lineHeight: 1.6,
  },
  guideCard: {
    background: 'linear-gradient(135deg, rgba(20, 24, 32, 0.8) 0%, rgba(15, 18, 24, 0.95) 100%)',
    border: '1px solid #2B3342',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '16px',
    borderLeft: '3px solid #C29B38',
  },
  guideHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  guideIcon: {
    color: '#C29B38',
    fontSize: '14px',
  },
  guideTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    color: '#C29B38',
    letterSpacing: '0.5px',
    fontWeight: 700,
  },
  guideText: {
    color: '#9CA7BA',
    fontSize: '12px',
    lineHeight: 1.6,
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #232936',
  },
  cancelButton: {
    background: '#151922',
    borderColor: '#303747',
    color: '#8D98AA',
    height: '42px',
    padding: '0 20px',
    fontFamily: "'Cinzel', serif",
  },
  submitButton: {
    height: '42px',
    padding: '0 24px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    fontFamily: "'Cinzel', serif",
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
};
