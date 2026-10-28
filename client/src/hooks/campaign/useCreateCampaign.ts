import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, type FormProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { campaignApi } from '@/api';
import useNotification from '@/hooks/global/useNotification';
import useStaticModal from '@/hooks/global/useStaticModal';
import useTokenStore from '@/stores/useTokenStore';
import { calculateCampaignProgressPercent, calculateCampaignSubProgressPercent } from '@/utils/utility';
import { CampaignLanguageEnum } from '@/utils/enums';
import type { CampaignDataReturn, CampaignSSEEvent } from '@/models/campaignInterfaces';
import { CAMPAIGN_MODULE_KEYS, type CampaignModuleKey } from './useCampaignContinuation';

export { CAMPAIGN_MODULE_KEYS, type CampaignModuleKey };

export interface CreateCampaignFormValues {
  name: string;
  prompt: string;
  language: string;
}

export const CAMPAIGN_PROMPT_MAX_LENGTH = 2000;

export const CAMPAIGN_SEED_KEYS = [
  'grimdark',
  'highFantasy',
  'gothicHorror',
  'cosmicMystery',
  'postApocalyptic',
  'mythicBronzeAge',
] as const;

export type CampaignSeedKey = (typeof CAMPAIGN_SEED_KEYS)[number];

export default function useCreateCampaign() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateCampaignFormValues>();
  const promptValue = Form.useWatch('prompt', form) ?? '';
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Creation result & manifest tracking
  const [creationResult, setCreationResult] = useState<CampaignDataReturn | null>(null);

  // SSE Progress state
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressSubStep, setProgressSubStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressSubPercent, setProgressSubPercent] = useState<number>(0);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [progressTotal, setProgressTotal] = useState<number>(12);

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

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    closeEventSource();
    navigate('/campaigns');
  }, [closeEventSource, navigate]);

  const handleFinishAndProceed = useCallback(() => {
    closeEventSource();
    if (creationResult) {
      navigate(`/campaigns/${creationResult.id}`);
      return;
    }
    navigate('/campaigns');
  }, [closeEventSource, creationResult, navigate]);

  const handleAddSeed = useCallback((seedLabel: string) => {
    const current: string = form.getFieldValue('prompt') ?? '';
    const next = current.trim() ? `${current.trim()} ${seedLabel}.` : `${seedLabel}.`;
    form.setFieldValue('prompt', next.slice(0, CAMPAIGN_PROMPT_MAX_LENGTH));
  }, [form]);

  const subscribeToSSE = useCallback((processId: string) => {
    const accessToken = useTokenStore.getState().accessToken;
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const sseUrl = `${apiBase}/campaign/progress/${processId}?token=${encodeURIComponent(accessToken)}`;

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
          setProgressSubStep(payload.sub?.message ?? '');
          setProgressCurrent(payload.current);
          setProgressTotal(payload.total);
          setProgressPercent(calculateCampaignProgressPercent(payload));
          setProgressSubPercent(calculateCampaignSubProgressPercent(payload));
        } else if (payload.type === 'complete') {
          es.close();
          eventSourceRef.current = null;
          setProgressPercent(100);
          setProgressSubPercent(100);
          setLoading(false);
          setCreationResult(payload.data);

          const allDone = payload.data.successParameter
            ? CAMPAIGN_MODULE_KEYS.every((mod) => payload.data.successParameter?.[mod] === true)
            : true;

          if (allDone) {
            successNotification(
              t('campaigns.createSuccessTitle'),
              t('campaigns.createSuccessMessage', { name: payload.data.name })
            );
          }
        } else if (payload.type === 'error') {
          es.close();
          eventSourceRef.current = null;
          setLoading(false);
          setErrorMsg(payload.message || 'Campaign generation failed');
        }
      } catch (parseError) {
        console.error('Failed to parse SSE event payload:', parseError);
      }
    };

    es.onerror = (err) => {
      console.warn('SSE connection notice / retry:', err);
      if (es.readyState === EventSource.CLOSED && eventSourceRef.current === es) {
        es.close();
        eventSourceRef.current = null;
        setLoading(false);
        setErrorMsg(t('global.serverError'));
      }
    };
  }, [t, successNotification]);

  const submitGenerateCampaign: FormProps<CreateCampaignFormValues>['onFinish'] = async (values) => {
    setLoading(true);
    setErrorMsg('');
    setProgressStep(t('campaigns.progressInitial'));
    setProgressSubStep('');
    setProgressPercent(3);
    setProgressSubPercent(0);
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
        setProgressSubStep('');
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
        subscribeToSSE(data.processId);
      }
    } catch {
      setLoading(false);
      setProgressStep('');
      setProgressSubStep('');
      setProgressPercent(0);
      errorModal('Campaign Creation Disturbance', t('global.serverError'));
    }
  };

  const handleContinueCampaign = async () => {
    if (!creationResult || !creationResult.successParameter) return;

    setLoading(true);
    setErrorMsg('');
    setProgressStep(t('campaigns.progressInitial'));
    setProgressSubStep('');
    setProgressPercent(3);
    setProgressSubPercent(0);
    setProgressCurrent(0);

    try {
      const [err, data] = await campaignApi.continueCampaign(creationResult.id, {
        successParameter: creationResult.successParameter,
      });

      if (err) {
        setLoading(false);
        setProgressStep('');
        setProgressSubStep('');
        setProgressPercent(0);

        if (err.status === 400 || err.status === 422) {
          setErrorMsg(err.response?.data?.message || 'Invalid parameters for campaign continuation');
          return;
        }

        if (err.status === 404) {
          setErrorMsg(err.response?.data?.userMessage || 'Campaign not found');
          return;
        }

        serverErrorModal();
        return;
      }

      if (data?.processId) {
        subscribeToSSE(data.processId);
      }
    } catch {
      setLoading(false);
      setProgressStep('');
      setProgressSubStep('');
      setProgressPercent(0);
      errorModal('Campaign Continuation Disturbance', t('global.serverError'));
    }
  };

  const isAllSuccess = creationResult?.successParameter
    ? CAMPAIGN_MODULE_KEYS.every((mod) => creationResult.successParameter?.[mod] === true)
    : false;

  const firstFailedModule = creationResult?.successParameter
    ? CAMPAIGN_MODULE_KEYS.find((mod) => !creationResult.successParameter?.[mod])
    : undefined;

  return {
    form,
    loading,
    errorMsg,
    progressStep,
    progressSubStep,
    progressPercent,
    progressSubPercent,
    progressCurrent,
    progressTotal,
    creationResult,
    isAllSuccess,
    firstFailedModule,
    promptValue,
    submitGenerateCampaign,
    handleContinueCampaign,
    handleFinishAndProceed,
    handleAddSeed,
    handleCancel,
  };
}
