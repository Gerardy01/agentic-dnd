import { useState } from 'react';
import { Form, type FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { campaignApi } from '@/api';
import useNotification from '@/hooks/global/useNotification';
import useStaticModal from '@/hooks/global/useStaticModal';
import { CampaignLanguageEnum } from '@/utils/enums';
import type { CampaignDataReturn } from '@/models/campaignInterfaces';

export interface CreateCampaignFormValues {
  name: string;
  prompt: string;
  language: string;
}

export default function useGenerateCampaignModal(
  onClose: () => void,
  onSuccess: (campaign: CampaignDataReturn) => void
) {
  const [form] = Form.useForm<CreateCampaignFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { t } = useTranslation();
  const { successNotification } = useNotification();
  const { serverErrorModal, errorModal } = useStaticModal();

  const handleCloseModal = () => {
    form.resetFields();
    setErrorMsg('');
    onClose();
  };

  const submitGenerateCampaign: FormProps<CreateCampaignFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const [err, data] = await campaignApi.createCampaign({
        name: values.name.trim(),
        themePrompt: values.prompt.trim(),
        language: values.language || CampaignLanguageEnum.EN,
      });

      if (err) {
        if (err.status === 400) {
          const schemaError = err.response?.data?.schemaErrors?.[0];
          if (schemaError) {
            setErrorMsg(`${schemaError.field}: ${schemaError.message}`);
          } else {
            setErrorMsg(err.response?.data?.message || t('global.serverError'));
          }
          return;
        }

        if (err.status === 422) {
          setErrorMsg(err.response?.data?.message || 'Invalid format for campaign generation');
          return;
        }

        if (err.status === 404) {
          setErrorMsg(err.response?.data?.userMessage || 'Resource not found');
          return;
        }

        serverErrorModal();
        return;
      }

      if (data) {
        successNotification(
          t('campaigns.createSuccessTitle'),
          t('campaigns.createSuccessMessage', { name: data.name })
        );
        onSuccess(data);
        handleCloseModal();
      }
    } catch {
      errorModal('Campaign Creation Disturbance', t('global.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    errorMsg,
    submitGenerateCampaign,
    handleCloseModal,
  };
}
