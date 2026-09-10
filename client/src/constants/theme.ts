import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#D95C14',
    colorInfo: '#D95C14',
    colorSuccess: '#4E9F3D',
    colorWarning: '#D4AC0D',
    colorError: '#C0392B',
    colorTextBase: '#E8E2D5',
    colorBgBase: '#12151B',
    colorBgContainer: '#1A1E26',
    colorBgElevated: '#212631',
    colorBorder: '#353D4D',
    colorBorderSecondary: '#292F3C',
    fontFamily: "'Cinzel', 'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimary: '#D95C14',
      colorPrimaryHover: '#E86C28',
      colorPrimaryActive: '#B8490B',
      borderRadius: 8,
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: '#141820',
      colorBorder: '#3A4252',
      colorText: '#FFFFFF',
      colorTextPlaceholder: '#6E788B',
    },
    Card: {
      colorBgContainer: '#181C24',
      colorBorderSecondary: '#313847',
    },
    Modal: {
      contentBg: '#181C24',
      headerBg: '#181C24',
    },
    Typography: {
      colorText: '#E8E2D5',
      colorTextHeading: '#F2ECE1',
    },
    Menu: {
      darkItemBg: '#14171E',
      darkItemSelectedBg: '#D95C14',
    },
  },
};
