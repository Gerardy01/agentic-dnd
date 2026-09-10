import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CompassOutlined,
  BookOutlined,
  ToolOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { SidebarMenuEnum } from '@/utils/enums';
import useAccountStore from '@/stores/useAccountStore';
import useTokenStore from '@/stores/useTokenStore';
import { authApi } from '@/api';

export default function useMainCommonWrap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const { username, email } = useAccountStore();
  const removeAccessToken = useTokenStore((state) => state.removeAccessToken);
  const removeAccount = useAccountStore((state) => state.removeAccount);

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return SidebarMenuEnum.DASHBOARD;
    if (path.startsWith('/campaigns')) return SidebarMenuEnum.CAMPAIGNS;
    if (path.startsWith('/workshop')) return SidebarMenuEnum.WORKSHOP;
    if (path.startsWith('/settings')) return SidebarMenuEnum.SETTINGS;
    return SidebarMenuEnum.DASHBOARD;
  }, [location.pathname]);

  const menuItems: MenuProps['items'] = [
    {
      key: SidebarMenuEnum.DASHBOARD,
      icon: <CompassOutlined />,
      label: t('menu.dashboard'),
      onClick: () => navigate('/'),
    },
    {
      key: SidebarMenuEnum.CAMPAIGNS,
      icon: <BookOutlined />,
      label: t('menu.campaigns'),
      onClick: () => navigate('/campaigns'),
    },
    {
      key: SidebarMenuEnum.WORKSHOP,
      icon: <ToolOutlined />,
      label: t('menu.workshop'),
      onClick: () => navigate('/workshop'),
    },
    {
      key: SidebarMenuEnum.SETTINGS,
      icon: <SettingOutlined />,
      label: t('menu.settings'),
      onClick: () => navigate('/settings'),
    },
  ];

  const handleLogout = async () => {
    await authApi.logout();
    removeAccessToken();
    removeAccount();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: username || email || 'Adventurer',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: t('dashboard.logout'),
      onClick: handleLogout,
    },
  ];

  return {
    collapsed,
    setCollapsed,
    selectedKey,
    menuItems,
    userMenuItems,
    username: username || 'Adventurer',
    email,
    handleLogout,
  };
}
