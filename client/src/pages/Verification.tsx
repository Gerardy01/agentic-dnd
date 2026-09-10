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
    backgroundColor: '#0D0F14',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(194, 155, 56, 0.12) 0%, rgba(13, 15, 20, 0) 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#151922',
    border: '1px solid #303747',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(194, 155, 56, 0.2)',
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
    background: 'linear-gradient(135deg, rgba(194, 155, 56, 0.25) 0%, rgba(217, 92, 20, 0.15) 100%)',
    border: '1px solid #C29B38',
    marginBottom: '16px',
    boxShadow: '0 0 20px rgba(194, 155, 56, 0.3)',
  },
  logoIcon: {
    fontSize: '26px',
    color: '#C29B38',
  },
  title: {
    margin: '0 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '22px',
  },
  subtitle: {
    color: '#8D98AA',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  emailBadge: {
    marginTop: '12px',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    background: '#1D2330',
    border: '1px solid #303747',
  },
  emailText: {
    color: '#D95C14',
    fontWeight: 600,
    fontSize: '12px',
  },
  alert: {
    marginBottom: '20px',
    borderRadius: '8px',
    background: 'rgba(192, 57, 43, 0.15)',
    border: '1px solid #C0392B',
  },
  form: {
    marginTop: '8px',
  },
  label: {
    color: '#C2BAA6',
    fontSize: '13px',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '0.5px',
  },
  otpInput: {
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#303747',
    textAlign: 'center',
    fontSize: '24px',
    letterSpacing: '8px',
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#EDE6D6',
  },
  submitButton: {
    marginTop: '12px',
    height: '46px',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
  resendWrapper: {
    textAlign: 'center',
    marginTop: '16px',
  },
  resendBtn: {
    color: '#C29B38',
    fontSize: '13px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #252B38',
  },
  backLink: {
    color: '#7D8899',
    fontSize: '13px',
  },
};
