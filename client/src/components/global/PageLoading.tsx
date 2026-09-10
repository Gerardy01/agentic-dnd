import { Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export default function PageLoading() {
  const { t } = useTranslation();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.runeSymbol}>⚔️</div>
        <Spin size="large" />
        <Text style={styles.text}>{t('global.loading')}</Text>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F1217',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px',
    borderRadius: '16px',
    background: 'rgba(26, 30, 38, 0.8)',
    border: '1px solid #353D4D',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
  runeSymbol: {
    fontSize: '36px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 0 10px rgba(217, 92, 20, 0.6))',
  },
  text: {
    color: '#D4AC0D',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
  },
};
