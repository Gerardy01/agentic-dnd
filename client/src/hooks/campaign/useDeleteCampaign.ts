import { useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { campaignApi } from '@/api';

export default function useDeleteCampaign() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setConfirmName('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setConfirmName('');
  };

  const handleDelete = async (
    campaignId: number,
    campaignName: string,
    onSuccess?: () => void
  ): Promise<boolean> => {
    if (confirmName !== campaignName) {
      message.error(t('campaignDetail.delete.nameDoesNotMatch'));
      return false;
    }

    setIsDeleting(true);
    try {
      const [error] = await campaignApi.deleteCampaign(campaignId);

      if (error) {
        const errorMsg = error.response?.data?.message || error.response?.data?.userMessage || t('campaignDetail.delete.failed');
        message.error(errorMsg);
        return false;
      }

      message.success(t('campaignDetail.delete.success'));
      closeModal();
      onSuccess?.();
      return true;
    } catch (err) {
      message.error(t('campaignDetail.delete.failed'));
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isModalOpen,
    confirmName,
    isDeleting,
    setConfirmName,
    openModal,
    closeModal,
    handleDelete,
  };
}
