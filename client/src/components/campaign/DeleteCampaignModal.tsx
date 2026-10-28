import { Modal, Input, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface DeleteCampaignModalProps {
  isOpen: boolean;
  campaignName: string;
  confirmName: string;
  isDeleting: boolean;
  onConfirmNameChange: (value: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function DeleteCampaignModal({
  isOpen,
  campaignName,
  confirmName,
  isDeleting,
  onConfirmNameChange,
  onDelete,
  onCancel,
}: DeleteCampaignModalProps) {
  const { t } = useTranslation();

  const isConfirmValid = confirmName === campaignName;

  return (
    <Modal
      open={isOpen}
      title={
        <span style={styles.modalTitle}>
          <ExclamationCircleOutlined style={styles.warningIcon} />
          {t('campaignDetail.delete.modalTitle')}
        </span>
      }
      okText={t('campaignDetail.delete.confirmButton')}
      cancelText={t('campaignDetail.delete.cancelButton')}
      onOk={onDelete}
      onCancel={onCancel}
      okButtonProps={{
        danger: true,
        disabled: !isConfirmValid,
        loading: isDeleting,
      }}
      cancelButtonProps={{
        disabled: isDeleting,
      }}
      closable={!isDeleting}
      maskClosable={!isDeleting}
    >
      <div style={styles.modalContent}>
        <Alert
          message={t('campaignDetail.delete.warningTitle')}
          description={t('campaignDetail.delete.warningDescription')}
          type="warning"
          showIcon
          style={styles.alert}
        />

        <Paragraph style={styles.description}>
          {t('campaignDetail.delete.instruction')}
        </Paragraph>

        <div style={styles.campaignNameBox}>
          <Text strong style={styles.campaignNameLabel}>
            {t('campaignDetail.delete.campaignName')}:
          </Text>
          <Text code style={styles.campaignNameText}>
            {campaignName}
          </Text>
        </div>

        <div style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {t('campaignDetail.delete.confirmLabel')}:
          </Text>
          <Input
            placeholder={t('campaignDetail.delete.confirmPlaceholder')}
            value={confirmName}
            onChange={(e) => onConfirmNameChange(e.target.value)}
            disabled={isDeleting}
            status={confirmName && !isConfirmValid ? 'error' : ''}
            style={styles.input}
          />
          {confirmName && !isConfirmValid && (
            <Text type="danger" style={styles.errorText}>
              {t('campaignDetail.delete.nameDoesNotMatch')}
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '22px',
    color: '#2B1F17',
  },
  warningIcon: {
    color: '#A33A2E',
    fontSize: '20px',
  },
  modalContent: {
    paddingTop: '16px',
  },
  alert: {
    marginBottom: '16px',
    borderRadius: '8px',
  },
  description: {
    marginBottom: '16px',
    color: '#6B5A48',
    fontSize: '14px',
  },
  campaignNameBox: {
    padding: '12px 16px',
    background: 'rgba(114, 43, 43, 0.08)',
    border: '1px solid rgba(114, 43, 43, 0.3)',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  campaignNameLabel: {
    display: 'block',
    marginBottom: '4px',
    color: '#6B5A48',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
  },
  campaignNameText: {
    fontSize: '15px',
    color: '#2B1F17',
    fontFamily: 'var(--font-body)',
  },
  inputGroup: {
    marginBottom: '8px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    color: '#6B5A48',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
  },
  input: {
    fontFamily: 'var(--font-body)',
  },
  errorText: {
    display: 'block',
    marginTop: '4px',
    fontSize: '13px',
  },
};
