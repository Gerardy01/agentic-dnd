import { Layout, Menu, Dropdown, Button, Typography, Space, Avatar } from 'antd';
import { Outlet } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FireOutlined,
} from '@ant-design/icons';
import useMainCommonWrap from '@/hooks/global/useMainCommonWrap';
import InitModal from '@/components/global/InitModal';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

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
        style={styles.sider}
        width={240}
      >
        <div style={styles.brand}>
          <FireOutlined style={styles.brandIcon} />
          {!collapsed && (
            <div style={styles.brandText}>
              <span style={styles.brandTitle}>AGENTIC D&amp;D</span>
              <span style={styles.brandSubtitle}>AI DUNGEON MASTER</span>
            </div>
          )}
        </div>

        <div style={styles.divider} />

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={styles.menu}
        />
      </Sider>

      <Layout style={styles.innerLayout}>
        <Header style={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
          />

          <div style={styles.headerRight}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Button type="text" style={styles.userProfileBtn}>
                <Space>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.userName}>{username}</Text>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content style={styles.content}>
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
    background: '#0F1217',
  },
  sider: {
    background: '#141820',
    borderRight: '1px solid #29303D',
    boxShadow: '4px 0 16px rgba(0, 0, 0, 0.4)',
  },
  brand: {
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '12px',
  },
  brandIcon: {
    fontSize: '24px',
    color: '#D95C14',
    filter: 'drop-shadow(0 0 8px rgba(217, 92, 20, 0.6))',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '15px',
    fontWeight: 700,
    color: '#EDE6D6',
    letterSpacing: '1.5px',
  },
  brandSubtitle: {
    fontSize: '9px',
    color: '#C29B38',
    letterSpacing: '2px',
    fontFamily: "'Cinzel', serif",
  },
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #353D4D, transparent)',
    margin: '0 16px 12px',
  },
  menu: {
    background: 'transparent',
    borderRight: 'none',
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    fontSize: '14px',
  },
  innerLayout: {
    background: '#0D0F14',
  },
  header: {
    padding: '0 24px',
    background: '#141820',
    borderBottom: '1px solid #29303D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  collapseBtn: {
    color: '#C29B38',
    fontSize: '16px',
    width: '40px',
    height: '40px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userProfileBtn: {
    display: 'flex',
    alignItems: 'center',
    height: '42px',
    padding: '0 12px',
    borderRadius: '8px',
    background: '#1A1F2A',
    border: '1px solid #353D4D',
  },
  userAvatar: {
    backgroundColor: '#D95C14',
    color: '#FFFFFF',
  },
  userName: {
    color: '#EDE6D6',
    fontWeight: 600,
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
  },
  content: {
    margin: '24px',
    minHeight: 'calc(100vh - 112px)',
  },
  contentInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
};
