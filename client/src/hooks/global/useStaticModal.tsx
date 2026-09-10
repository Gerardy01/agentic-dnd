import { App } from 'antd';
import { useTranslation } from 'react-i18next';

export default function useStaticModal() {
  const { modal } = App.useApp();
  const { t } = useTranslation();

  const successModal = (title?: string, content?: string, onOk?: () => void) => {
    modal.success({
      title: title || t('global.confirm'),
      content: content || '',
      onOk,
    });
  };

  const errorModal = (title?: string, content?: string) => {
    modal.error({
      title: title || 'Error',
      content: content || t('global.serverError'),
    });
  };

  const warningModal = (title?: string, content?: string) => {
    modal.warning({
      title: title || 'Warning',
      content: content || '',
    });
  };

  const serverErrorModal = (content?: string) => {
    modal.error({
      title: 'Arcane Disturbance',
      content: content || t('global.serverError'),
    });
  };

  const confirmationModal = (
    title: string,
    content: string,
    onOk: () => void | Promise<void>,
    onCancel?: () => void
  ) => {
    modal.confirm({
      title,
      content,
      onOk,
      onCancel,
      okText: t('global.confirm'),
      cancelText: t('global.cancel'),
    });
  };

  return {
    successModal,
    errorModal,
    warningModal,
    serverErrorModal,
    confirmationModal,
  };
}
