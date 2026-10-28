import { Skeleton } from 'antd';
import { palette } from '@/constants/theme';

interface CampaignTabSkeletonProps {
  variant: 'cards' | 'map';
}

const CARD_PLACEHOLDER_COUNT = 6;

export default function CampaignTabSkeleton({ variant }: CampaignTabSkeletonProps) {
  if (variant === 'map') {
    return (
      <div className="skeleton-map" aria-busy="true">
        <div style={styles.panel}>
          <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 1 }} />
          <Skeleton.Input active block style={styles.searchInput} />
          <Skeleton active title={false} paragraph={{ rows: 6, width: ['90%', '70%', '80%', '60%', '75%', '50%'] }} />
        </div>
        <div style={styles.panel}>
          <Skeleton.Button active size="small" style={styles.badge} />
          <Skeleton active title={{ width: '35%' }} paragraph={{ rows: 3 }} />
          <Skeleton active title={{ width: '25%' }} paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div aria-busy="true">
      <div style={styles.header}>
        <Skeleton active title={{ width: 260 }} paragraph={{ rows: 1, width: 340 }} style={styles.headerText} />
        <Skeleton.Input active style={styles.filterInput} />
      </div>
      <div className="skeleton-cards">
        {Array.from({ length: CARD_PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <Skeleton.Avatar active shape="square" size={44} />
              <Skeleton active title={{ width: '70%' }} paragraph={false} style={styles.cardTitle} />
            </div>
            <Skeleton active title={false} paragraph={{ rows: 3, width: ['100%', '90%', '60%'] }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  headerText: {
    flex: 1,
    minWidth: '240px',
  },
  filterInput: {
    width: '260px',
    maxWidth: '100%',
  },
  card: {
    padding: '20px',
    borderRadius: '16px',
    background: palette.surface,
    border: `1px solid ${palette.border}`,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '16px',
  },
  cardTitle: {
    flex: 1,
  },
  panel: {
    padding: '20px',
    borderRadius: '16px',
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  searchInput: {
    height: '40px',
  },
  badge: {
    width: '90px',
  },
};
