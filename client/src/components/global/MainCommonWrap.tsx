import { Layout, Menu, Dropdown, Button, Avatar } from 'antd';
import { Outlet } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FireOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import useMainCommonWrap from '@/hooks/global/useMainCommonWrap';
import InitModal from '@/components/global/InitModal';
import { palette } from '@/constants/theme';

const { Sider, Content } = Layout;

export default function MainCommonWrap() {
  const {
    collapsed,
    setCollapsed,
    selectedKey,
    menuItems,
    userMenuItems,
    username,
  } = useMainCommonWrap();

  return (
    <Layout style={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={setCollapsed}
        style={styles.sider}
        width={264}
        collapsedWidth={84}
      >
        <div style={styles.siderInner}>
          <div style={{ ...styles.brand, ...(collapsed ? styles.brandCollapsed : {}) }}>
            <div style={styles.brandMark}>
              <FireOutlined style={styles.brandIcon} />
            </div>
            {!collapsed && (
              <div style={styles.brandText}>
                <span style={styles.brandTitle}>Agentic D&amp;D</span>
                <span style={styles.brandSubtitle}>AI Dungeon Master</span>
              </div>
            )}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ ...styles.menu, ...(collapsed ? styles.menuCollapsed : {}) }}
          />

          <div style={styles.siderFooter}>
            <Dropdown menu={{ items: userMenuItems }} placement="topLeft" trigger={['click']}>
              <Button type="text" style={{ ...styles.userProfileBtn, ...(collapsed ? styles.userProfileBtnCollapsed : {}) }} aria-label={username}>
                <span style={styles.userInfo}>
                  <Avatar size={32} icon={<UserOutlined />} style={styles.userAvatar} />
                  {!collapsed && <span style={styles.userName}>{username}</span>}
                </span>
                {!collapsed && <MoreOutlined style={styles.userMore} />}
              </Button>
            </Dropdown>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={styles.collapseBtn}
              aria-label="Toggle sidebar"
            />
          </div>
        </div>
      </Sider>

      <Layout style={styles.innerLayout}>
        <Content style={styles.content} className="app-content">
          <div style={styles.contentInner}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <InitModal />
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    minHeight: '100vh',
    background: palette.pageBg,
  },
  sider: {
    background: palette.sidebar,
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
  },
  siderInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 0 16px 0',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '0 20px',
    marginBottom: '36px',
    minHeight: '52px',
  },
  brandMark: {
    width: '44px',
    height: '44px',
    flexShrink: 0,
    borderRadius: '12px',
    background: palette.crimson,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  brandIcon: {
    fontSize: '20px',
    color: '#F4EBD3',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
    minWidth: 0,
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: '#F4EBD3',
    whiteSpace: 'nowrap',
  },
  brandSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: '#B89968',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  brandCollapsed: {
    justifyContent: 'center',
    padding: 0,
  },
  menuCollapsed: {
    paddingRight: 0,
  },
  userProfileBtnCollapsed: {
    justifyContent: 'center',
    padding: 0,
  },
  menu: {
    flex: 1,
    background: 'transparent',
    borderInlineEnd: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    fontWeight: 500,
    paddingRight: '20px',
  },
  siderFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 14px 0',
    borderTop: '1px solid rgba(238, 229, 204, 0.12)',
    margin: '0 6px',
  },
  userProfileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '48px',
    padding: '0 8px',
    borderRadius: '12px',
    justifyContent: 'space-between',
    width: '100%',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },
  userAvatar: {
    backgroundColor: palette.crimson,
    color: '#F4EBD3',
    flexShrink: 0,
  },
  userName: {
    color: '#F4EBD3',
    fontWeight: 600,
    minWidth: 0,
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
  },
  userMore: {
    color: palette.sidebarText,
  },
  collapseBtn: {
    color: palette.sidebarText,
    height: '36px',
    width: '100%',
    justifyContent: 'center',
  },
  innerLayout: {
    background: palette.pageBg,
    minWidth: 0,
  },
  content: {
    padding: '40px 48px 56px',
    minHeight: '100vh',
  },
  contentInner: {
    maxWidth: '1240px',
    margin: '0 auto',
    width: '100%',
  },
};
