import { useState, useRef, useEffect } from 'react';
import { Form, type FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { campaignApi } from '@/api';
import useNotification from '@/hooks/global/useNotification';
import useStaticModal from '@/hooks/global/useStaticModal';
import useTokenStore from '@/stores/useTokenStore';
import { CampaignLanguageEnum } from '@/utils/enums';
import type { CampaignDataReturn, CampaignSSEEvent } from '@/models/campaignInterfaces';

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

  // SSE Progress state
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<number>(11);

  const eventSourceRef = useRef<EventSource | null>(null);

  const { t } = useTranslation();
  const { successNotification } = useNotification();
  const { serverErrorModal, errorModal } = useStaticModal();

  // Close EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleCloseModal = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    form.resetFields();
    setErrorMsg('');
    setProgressStep('');
    setProgressPercent(0);
    setProgressCurrent(0);
    onClose();
  };

  const submitGenerateCampaign: FormProps<CreateCampaignFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    setErrorMsg('');
    setProgressStep(t('campaigns.progressInitial'));
    setProgressPercent(3);
    setProgressCurrent(0);

    try {
      const [err, data] = await campaignApi.createCampaign({
        name: values.name.trim(),
        themePrompt: values.prompt.trim(),
        language: values.language || CampaignLanguageEnum.EN,
      });

      if (err) {
        setLoading(false);
        setProgressStep('');
        setProgressPercent(0);

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

      if (data?.processId) {
        // Connect to SSE stream for step-by-step progress
        const accessToken = useTokenStore.getState().accessToken;
        const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
        const sseUrl = `${apiBase}/campaign/progress/${data.processId}?token=${encodeURIComponent(accessToken)}`;

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const es = new EventSource(sseUrl);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
          try {
            const payload: CampaignSSEEvent = JSON.parse(event.data);

            if (payload.type === 'step') {
              setProgressStep(payload.message);
              setProgressCurrent(payload.current);
              setProgressTotal(payload.total);
              const percent = Math.min(100, Math.round((payload.current / payload.total) * 100));
              setProgressPercent(percent);
            } else if (payload.type === 'complete') {
              es.close();
              eventSourceRef.current = null;
              setProgressPercent(100);
              setLoading(false);

              successNotification(
                t('campaigns.createSuccessTitle'),
                t('campaigns.createSuccessMessage', { name: payload.data.name })
              );
              onSuccess(payload.data);
              handleCloseModal();
            } else if (payload.type === 'error') {
              es.close();
              eventSourceRef.current = null;
              setLoading(false);
              setErrorMsg(payload.message || 'Campaign creation failed');
            }
          } catch (parseError) {
            console.error('Failed to parse SSE event payload:', parseError);
          }
        };

        es.onerror = (err) => {
          console.warn('SSE connection notice / retry:', err);
          // Only abort if closed without having completed
          if (es.readyState === EventSource.CLOSED && eventSourceRef.current === es) {
            es.close();
            eventSourceRef.current = null;
            setLoading(false);
            setErrorMsg(t('global.serverError'));
          }
        };
      }
    } catch {
      setLoading(false);
      setProgressStep('');
      setProgressPercent(0);
      errorModal('Campaign Creation Disturbance', t('global.serverError'));
    }
  };

  return {
    form,
    loading,
    errorMsg,
    progressStep,
    progressPercent,
    progressCurrent,
    progressTotal,
    submitGenerateCampaign,
    handleCloseModal,
  };
}
