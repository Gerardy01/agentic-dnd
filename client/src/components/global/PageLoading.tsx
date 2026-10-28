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
    backgroundColor: '#FAF3E0',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px',
    borderRadius: '16px',
    background: '#FAF3E0',
    border: '1px solid #CDBE96',
    boxShadow: '0 8px 32px rgba(70, 45, 20, 0.23)',
  },
  runeSymbol: {
    fontSize: '36px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 0 10px rgba(114, 43, 43, 0.6))',
  },
  text: {
    color: '#B7791F',
    fontSize: '15px',
    letterSpacing: '1px',
    fontFamily: 'var(--font-heading)',
  },
};
