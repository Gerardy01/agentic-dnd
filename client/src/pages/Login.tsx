import { Button, Input, Form, Alert, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserOutlined, LockOutlined, FireOutlined } from '@ant-design/icons';
import useLogin from '@/hooks/login/useLogin';
import PageLoading from '@/components/global/PageLoading';

const { Title, Text } = Typography;

export default function Login() {
  const { loginForm, loading, errorMsg, pageLoad, submitLoginData } = useLogin();
  const { t } = useTranslation();

  if (pageLoad) {
    return <PageLoading />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow} />

      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <FireOutlined style={styles.logoIcon} />
          </div>
          <Title level={2} style={styles.title}>
            {t('auth.loginTitle')}
          </Title>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
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
          form={loginForm}
          layout="vertical"
          onFinish={submitLoginData}
          requiredMark={false}
          style={styles.form}
        >
          <Form.Item
            name="identifier"
            label={<span style={styles.label}>{t('auth.identifierLabel')}</span>}
            rules={[{ required: true, message: t('global.fieldRequired') }]}
          >
            <Input
              prefix={<UserOutlined style={styles.inputIcon} />}
              placeholder={t('auth.identifierPlaceholder')}
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={styles.label}>{t('auth.passwordLabel')}</span>}
            rules={[{ required: true, message: t('global.fieldRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined style={styles.inputIcon} />}
              placeholder={t('auth.passwordPlaceholder')}
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={styles.submitButton}
          >
            {t('auth.enterRealm')}
          </Button>
        </Form>

        <div style={styles.footer}>
          <Text style={styles.footerText}>
            {t('auth.noAccountYet')}{' '}
            <Link to="/register" style={styles.footerLink}>
              {t('auth.registerHere')}
            </Link>
          </Text>
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
    background: 'radial-gradient(circle, rgba(217, 92, 20, 0.12) 0%, rgba(13, 15, 20, 0) 70%)',
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
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(217, 92, 20, 0.2)',
    padding: '12px 8px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '54px',
    height: '54px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(217, 92, 20, 0.25) 0%, rgba(194, 155, 56, 0.15) 100%)',
    border: '1px solid #D95C14',
    marginBottom: '16px',
    boxShadow: '0 0 20px rgba(217, 92, 20, 0.3)',
  },
  logoIcon: {
    fontSize: '26px',
    color: '#D95C14',
  },
  title: {
    margin: '0 0 8px',
    color: '#EDE6D6',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    letterSpacing: '1px',
    fontSize: '24px',
  },
  subtitle: {
    color: '#8D98AA',
    fontSize: '13px',
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
  input: {
    borderRadius: '8px',
    background: '#0E1117',
    borderColor: '#303747',
  },
  inputIcon: {
    color: '#C29B38',
    marginRight: '6px',
  },
  submitButton: {
    marginTop: '12px',
    height: '46px',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    boxShadow: '0 4px 16px rgba(217, 92, 20, 0.4)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #252B38',
  },
  footerText: {
    color: '#7D8899',
    fontSize: '13px',
  },
  footerLink: {
    color: '#D95C14',
    fontWeight: 600,
    marginLeft: '4px',
  },
};
