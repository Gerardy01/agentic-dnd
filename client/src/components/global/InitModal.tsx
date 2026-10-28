import { Modal, Form, Input, Button, Alert, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserOutlined, CrownOutlined, LogoutOutlined } from '@ant-design/icons';
import useInitModal from '@/hooks/global/useInitModal';

const { Title, Text, Paragraph } = Typography;

export default function InitModal() {
  const { form, isOpen, loading, errorMsg, submitUsername, handleLogout } = useInitModal();
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      footer={null}
      centered
      width={500}
      styles={{
        mask: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(43, 31, 23, 0.6)',
        },
        body: styles.modalBody,
      }}
    >
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <CrownOutlined style={styles.logoIcon} />
          </div>
          <div style={styles.tagWrapper}>
            <Tag color="gold" style={styles.tag}>
              {t('initModal.badge')}
            </Tag>
          </div>
          <Title level={2} style={styles.title}>
            {t('initModal.title')}
          </Title>
          <Paragraph style={styles.subtitle}>
            {t('initModal.subtitle')}
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

        <Form
          form={form}
          layout="vertical"
          onFinish={submitUsername}
          requiredMark={false}
          style={styles.form}
        >
          <Form.Item
            name="username"
            label={<span style={styles.label}>{t('initModal.inputLabel')}</span>}
            rules={[
              { required: true, message: t('initModal.nameRequired') },
              { min: 3, message: t('initModal.nameMin') },
              { max: 50, message: t('initModal.nameMax') },
            ]}
          >
            <Input
              prefix={<UserOutlined style={styles.inputIcon} />}
              placeholder={t('initModal.placeholder')}
              size="large"
              autoFocus
              maxLength={50}
              style={styles.input}
            />
          </Form.Item>

          <Text style={styles.helperText}>
            {t('initModal.helperText')}
          </Text>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={styles.submitButton}
          >
            {t('initModal.submit')}
          </Button>
        </Form>

        <div style={styles.footer}>
          <Text style={styles.footerText}>
            {t('initModal.switchAccount')}{' '}
            <Button
              type="link"
              onClick={handleLogout}
              icon={<LogoutOutlined />}
              style={styles.logoutBtn}
            >
              {t('initModal.logout')}
            </Button>
          </Text>
        </div>
      </div>
    </Modal>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalBody: {
    padding: '12px 4px 8px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(114, 43, 43, 0.25) 0%, rgba(139, 94, 43, 0.15) 100%)',
    border: '1px solid #722B2B',
    marginBottom: '14px',
    boxShadow: '0 0 24px rgba(114, 43, 43, 0.35)',
  },
  logoIcon: {
    fontSize: '28px',
    color: '#722B2B',
  },
  tagWrapper: {
    marginBottom: '8px',
  },
  tag: {
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1px',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '4px 0 10px',
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '31px',
  },
  subtitle: {
    color: '#6B5A48',
    fontSize: '14px',
    lineHeight: 1.6,
    margin: 0,
  },
  alert: {
    marginBottom: '18px',
    borderRadius: '8px',
    background: 'rgba(163, 58, 46, 0.15)',
    border: '1px solid #A33A2E',
  },
  form: {
    marginTop: '4px',
  },
  label: {
    color: '#5A4A39',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: '8px',
    background: '#F3EAD2',
    borderColor: '#CDBE96',
  },
  inputIcon: {
    color: '#8B5E2B',
    marginRight: '6px',
  },
  helperText: {
    display: 'block',
    color: '#8A7A66',
    fontSize: '13px',
    lineHeight: 1.5,
    marginTop: '-12px',
    marginBottom: '20px',
  },
  submitButton: {
    height: '46px',
    fontSize: '14px',
    letterSpacing: '1px',
    fontFamily: 'var(--font-body)',
    boxShadow: '0 4px 16px rgba(114, 43, 43, 0.4)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #DDD0AE',
  },
  footerText: {
    color: '#8A7A66',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  logoutBtn: {
    color: '#722B2B',
    padding: 0,
    fontSize: '13px',
    height: 'auto',
    fontWeight: 600,
  },
};
