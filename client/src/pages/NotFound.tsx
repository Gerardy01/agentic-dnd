import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CompassOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <CompassOutlined style={styles.icon} />
        <Title level={1} style={styles.title}>
          404
        </Title>
        <Paragraph style={styles.subtitle}>
          You have wandered beyond the mapped boundaries of the realm.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          style={styles.btn}
          onClick={() => navigate('/')}
        >
          Return to Gate
        </Button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EEE5CC',
    padding: '24px',
  },
  card: {
    textAlign: 'center',
    maxWidth: '440px',
    background: '#FAF3E0',
    border: '1px solid #CDBE96',
    borderRadius: '16px',
    padding: '40px 24px',
  },
  icon: {
    fontSize: '48px',
    color: '#722B2B',
    marginBottom: '16px',
  },
  title: {
    color: '#2B1F17',
    fontFamily: 'var(--font-heading)',
    margin: '0 0 12px',
  },
  subtitle: {
    color: '#6B5A48',
    marginBottom: '24px',
  },
  btn: {
    fontFamily: 'var(--font-body)',
  },
};
