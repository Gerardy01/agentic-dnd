import { App } from 'antd';

export default function useNotification() {
  const { notification } = App.useApp();

  const successNotification = (message: string, description?: string) => {
    notification.success({
      message,
      description,
      placement: 'topRight',
    });
  };

  const errorNotification = (message: string, description?: string) => {
    notification.error({
      message,
      description,
      placement: 'topRight',
    });
  };

  const warningNotification = (message: string, description?: string) => {
    notification.warning({
      message,
      description,
      placement: 'topRight',
    });
  };

  const infoNotification = (message: string, description?: string) => {
    notification.info({
      message,
      description,
      placement: 'topRight',
    });
  };

  return {
    successNotification,
    errorNotification,
    warningNotification,
    infoNotification,
  };
}
