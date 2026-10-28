import { Button, Input, Form, Alert, Typography, Card, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SafetyCertificateOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useVerification from '@/hooks/verification/useVerification';

const { Title, Text } = Typography;

export default function Verification() {
  const {
    form,
    loading,
    resending,
    errorMsg,
    email,
    hasToken,
    submitVerification,
    handleResendOtp,
  } = useVerification();

  const { t } = useTranslation();

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow} />

      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <SafetyCertificateOutlined style={styles.logoIcon} />
          </div>
          <Title level={2} style={styles.title}>
            {t('auth.verificationTitle')}
          </Title>
          <Text style={styles.subtitle}>{t('auth.verificationSubtitle')}</Text>
          {email && (
            <div style={styles.emailBadge}>
              <Text style={styles.emailText}>{email}</Text>
            </div>
          )}
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={styles.alert}
          />
        )}

        {!hasToken && (
          <Alert
            message="No active verification token detected. Please return to the gate and sign in again."
            type="warning"
            showIcon
            style={styles.alert}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={submitVerification}
          requiredMark={false}
          style={styles.form}
        >
          <Form.Item
            name="code"
            label={<span style={styles.label}>{t('auth.otpCodeLabel')}</span>}
            rules={[
              { required: true, message: t('global.fieldRequired') },
              {
                pattern: /^\d{6}$/,
                message: 'Must be a 6-digit numeric seal code',
              },
            ]}
          >
            <Input
              placeholder="123456"
              size="large"
              maxLength={6}
              style={styles.otpInput}
              disabled={!hasToken}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            disabled={!hasToken}
            style={styles.submitButton}
          >
            {t('auth.verifyCode')}
          </Button>

          <div style={styles.resendWrapper}>
            <Button
              type="link"
              icon={<ReloadOutlined />}
              loading={resending}
              onClick={handleResendOtp}
              style={styles.resendBtn}
            >
              {t('auth.resendCode')}
            </Button>
          </div>
        </Form>

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            <Space>
              <ArrowLeftOutlined />
              <span>{t('auth.backToLogin')}</span>
            </Space>
          </Link>
        </div>
      </Card>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE5CC',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 94, 43, 0.12) 0%, rgba(238, 229, 204, 0) 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#FAF3E0',
    border: '1px solid #CDBE96',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(70, 45, 20, 0.27), 0 0 1px 1px rgba(139, 94, 43, 0.2)',
    padding: '12px 8px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '54px',
    height: '54px',
    borderRadius: '12px',
    background: '#722B2B',
    marginBottom: '16px',
    boxShadow: '0 6px 16px rgba(114, 43, 43, 0.3)',
  },
  logoIcon: {
    fontSize: '26px',
    color: '#8B5E2B',
  },
  title: {
    margin: '0 0 8px',
    color: '#2B1F17',
    fontFamily: 'var(--font-display)',
    fontSize: '38px',
  },
  subtitle: {
    color: '#6B5A48',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  emailBadge: {
    marginTop: '12px',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    background: '#EFE6CC',
    border: '1px solid #CDBE96',
  },
  emailText: {
    color: '#722B2B',
    fontWeight: 600,
    fontSize: '13px',
  },
  alert: {
    marginBottom: '20px',
    borderRadius: '8px',
    background: 'rgba(163, 58, 46, 0.15)',
    border: '1px solid #A33A2E',
  },
  form: {
    marginTop: '8px',
  },
  label: {
    color: '#5A4A39',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    letterSpacing: '0.5px',
  },
  otpInput: {
    borderRadius: '8px',
    background: '#F3EAD2',
    borderColor: '#CDBE96',
    textAlign: 'center',
    fontSize: '24px',
    letterSpacing: '8px',
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#2B1F17',
  },
  submitButton: {
    marginTop: '12px',
    height: '46px',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: 'var(--font-body)',
    boxShadow: '0 4px 16px rgba(114, 43, 43, 0.4)',
  },
  resendWrapper: {
    textAlign: 'center',
    marginTop: '16px',
  },
  resendBtn: {
    color: '#8B5E2B',
    fontSize: '14px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #DDD0AE',
  },
  backLink: {
    color: '#8A7A66',
    fontSize: '14px',
  },
};
