import { Tag } from 'antd';

// interfaces
import type { LevelValueProgression } from '@/models/classInterfaces';

interface ClassProgressionTagsProps {
  keyPrefix: string;
  progression: LevelValueProgression[];
}

export default function ClassProgressionTags({
  keyPrefix,
  progression,
}: ClassProgressionTagsProps): React.JSX.Element {
  return (
    <div style={styles.badgeScroll}>
      {progression.map((item) => (
        <Tag key={`${keyPrefix}-lvl-${item.level}`} style={styles.progressionBadge}>
          <span style={styles.progLvl}>Lv {item.level}:</span>{' '}
          <span style={styles.progVal}>{item.value}</span>
        </Tag>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  badgeScroll: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  progressionBadge: {
    background: 'rgba(70, 45, 20, 0.04)',
    border: '1px solid #DDD0AE',
    color: '#2B1F17',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
  },
  progLvl: {
    color: '#6B5A48',
    fontFamily: 'var(--font-body)',
  },
  progVal: {
    color: '#2B1F17',
    fontWeight: 700,
  },
};
