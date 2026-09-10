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
    background: '#0D0F14',
    padding: '24px',
  },
  card: {
    textAlign: 'center',
    maxWidth: '440px',
    background: '#151922',
    border: '1px solid #303747',
    borderRadius: '16px',
    padding: '40px 24px',
  },
  icon: {
    fontSize: '48px',
    color: '#D95C14',
    marginBottom: '16px',
  },
  title: {
    color: '#EDE6D6',
    fontFamily: "'Cinzel', serif",
    margin: '0 0 12px',
  },
  subtitle: {
    color: '#8D98AA',
    marginBottom: '24px',
  },
  btn: {
    fontFamily: "'Cinzel', serif",
  },
};
